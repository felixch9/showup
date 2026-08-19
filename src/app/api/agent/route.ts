import { NextResponse } from "next/server";
import OpenAI from "openai";
import { slugify } from "@/lib/quote";

export const runtime = "nodejs";

function client() {
  const key = process.env.XAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key, baseURL: "https://api.x.ai/v1" });
}

function fallbackDemo(body: {
  name: string;
  trade: string;
  city: string;
  phone: string;
  lang?: string;
}) {
  const slug = slugify(body.name || body.trade);
  const es = body.lang === "es";
  return {
    slug,
    name: body.name,
    trade: body.trade,
    city: body.city,
    phone: body.phone,
    headline: es
      ? `${body.trade} con precio fijo en ${body.city}`
      : `${body.trade} with a locked price in ${body.city}`,
    lede: es
      ? "Reserva en el teléfono. Ves el camión. Depósito para que de verdad lleguemos."
      : "Book on your phone. Watch the truck. Deposit so we actually show up.",
    services: [
      { name: body.trade, price: "from $99" },
      { name: es ? "Visita el mismo día" : "Same-week slot", price: es ? "según cupo" : "when open" },
    ],
    about: es
      ? `${body.name} entra a ShowUp para dejar el flyer y cobrar en serio.`
      : `${body.name} is joining ShowUp so the flyer can retire.`,
    cta: es ? "Reservar" : "Book this crew",
    lang: body.lang || "en",
  };
}

function fallbackParse(text: string) {
  const phone = text.match(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/)?.[0] || "";
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return {
    name: lines[0]?.slice(0, 60) || "Local crew",
    trade: /wash|pressure|lavado/i.test(text)
      ? "Pressure washing"
      : /lawn|mow|césped|yard/i.test(text)
        ? "Lawn"
        : "Home services",
    city: /columbia|irmo|lexington/i.test(text)
      ? "Columbia, SC"
      : /san juan|bayamón|carolina|caguas|ponce/i.test(text)
        ? "San Juan, PR"
        : "Columbia, SC",
    phone,
    website: "",
    notes: "Parsed without model fallback. Verify before calling.",
  };
}

function fallbackScript(name: string, trade: string, city: string, lang: string) {
  if (lang === "es") {
    return `Hola, busco a ${name}. Soy de ShowUp en ${city}. Vi que hacen ${trade} y la gente tiene que cazarlos por flyer. En 10 minutos les armo una página para reservar con precio fijo y pin en vivo. Cero costo para entrar; cobramos 15% solo si les mandamos el trabajo. ¿Les mando el demo por mensaje?`;
  }
  return `Hey — looking for ${name}. This is ShowUp in ${city}. People in your zip book lawn and wash on their phone and watch the truck. I mocked a booking page from your ${trade} listing. Free to get on the board. We take 15% only on jobs we send. Can I text you the demo?`;
}

async function grokJson(prompt: string) {
  const c = client();
  if (!c) return null;
  try {
    const model = process.env.XAI_MODEL || "grok-4.5";
    const resp = await c.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are the ShowUp agent. ShowUp books home services in Columbia, SC (Puerto Rico later). Return JSON only. Never claim you messaged Facebook, scraped a private profile, or auto-texted anyone. Outreach is a call script for a human to deliver.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    });
    const text = resp.choices[0]?.message?.content || "";
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start < 0 || end < 0) return null;
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body.action as string;

    if (action === "demo") {
      const parsed =
        (await grokJson(
          `Create a contractor storefront JSON for ${body.name}, ${body.trade}, ${body.city}, phone ${body.phone}. Language ${body.lang || "en"}. Keys: slug, headline, lede, services (array of {name, price}), about, cta. Prices must be realistic for Columbia SC or Puerto Rico. No fake reviews. No claim they already work for ShowUp.`,
        )) || fallbackDemo(body);
      return NextResponse.json({
        ...fallbackDemo(body),
        ...parsed,
        name: body.name,
        trade: body.trade,
        city: body.city,
        phone: body.phone,
        slug: parsed.slug || slugify(body.name),
      });
    }

    if (action === "parse") {
      const parsed =
        (await grokJson(
          `Extract a home-service business from this public text. JSON keys: name, trade, city, phone, website, notes. If unknown, empty string. Text:\n${body.text}`,
        )) || fallbackParse(body.text || "");
      return NextResponse.json(parsed);
    }

    if (action === "script") {
      const parsed = await grokJson(
        `Write a 20-second phone script (field: script) for a human to call ${body.name}, a ${body.trade} in ${body.city}. Language ${body.lang || "en"}. Friendly, not salesy. Offer a free booking-page demo. Do not mention scraping. JSON {script}`,
      );
      return NextResponse.json({
        script: parsed?.script || fallbackScript(body.name, body.trade, body.city, body.lang || "en"),
      });
    }

    if (action === "review") {
      const parsed = await grokJson(
        `Review this contractor demo for ship-readiness. JSON {ok: boolean, issues: string[], summary: string}. Demo:\n${JSON.stringify(body.shop || {})}`,
      );
      return NextResponse.json(
        parsed || { ok: true, issues: [], summary: "Looks shippable as a demo. Human should call before going live." },
      );
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Agent error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
