"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SpecField } from "@/components/booking/SpecFields";
import { matchCrews } from "@/lib/capabilities";
import { cityForZip, jobId, validZip } from "@/lib/quote";
import { buildQuote, requiredPhotosMet, type Answers } from "@/lib/quote-engine";
import { popularSpecs, resolveServiceId, specById } from "@/lib/spec";
import { getAccount, setOffers, upsertJob } from "@/lib/store";
import type { ServiceId } from "@/lib/types";

function defaults(id: string): Answers {
  const resolved = resolveServiceId(id);
  if (resolved === "lawn") {
    return {
      lot_size: "6k_10k",
      current_grass_height: "8_12",
      desired_grass_height: 3,
      clippings: "mulch",
      zones: ["front", "back"],
      addons: ["edge"],
      photos: [],
    };
  }
  if (resolved === "wash") {
    const surfaces = id === "housewash" ? ["house"] : id === "driveway" ? ["driveway"] : ["driveway"];
    return { surfaces, stories: "1", condition: "algae", features: ["water"], photos: [] };
  }
  return { photos: [] };
}

function BookInner() {
  const router = useRouter();
  const params = useSearchParams();
  const incoming = (params.get("service") as ServiceId) || "lawn";
  const [service, setService] = useState<ServiceId>(resolveServiceId(incoming));
  const [answers, setAnswers] = useState<Answers>(() => defaults(incoming));
  const [address, setAddress] = useState("123 Main Street");
  const [zip, setZip] = useState("29206");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [asap, setAsap] = useState(true);
  const [when, setWhen] = useState("Today, 3–5pm");
  const [tip, setTip] = useState(8);
  const [promo, setPromo] = useState("");
  const [pass, setPass] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => setPass(getAccount().pass), []);

  const spec = specById(service)!;
  const city = cityForZip(zip);
  const quote = useMemo(
    () => buildQuote(service, answers, { pass, tip, promo, urgency: asap ? "asap" : "schedule" }),
    [service, answers, pass, tip, promo, asap],
  );
  const photosOk = requiredPhotosMet(service, answers);
  const areaOk = validZip(zip);
  const canBook = areaOk && photosOk && !quote.manualReview && quote.total > 0;

  function switchService(id: ServiceId) {
    setService(id);
    setAnswers(defaults(id));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canBook && !quote.manualReview) return;
    const crew = matchCrews(service, answers, zip)[0];
    const id = jobId();
    upsertJob({
      id,
      createdAt: Date.now(),
      service,
      size: String(answers.lot_size ?? answers.stories ?? "standard"),
      address,
      zip,
      when: asap ? "ASAP" : when,
      name,
      phone,
      notes,
      price: quote.total,
      deposit: quote.deposit,
      fee: quote.fee,
      tip,
      promo,
      crewId: crew.id,
      status: "searching",
      lang: "en",
      market: city.slug,
      scheduled: !asap,
      contactless: true,
      answers,
      quoteLines: quote.lines,
      minutes: quote.minutes,
      providerEarn: quote.providerEarn,
      platformCut: quote.platformCut,
      machine: "searching",
      needs: quote.needs,
    });
    setOffers([
      {
        id: `O-${id}`,
        jobId: id,
        service: spec.name,
        serviceId: service,
        neighborhood: address,
        miles: 2.3,
        pay: quote.providerEarn - tip,
        tip,
        peak: asap ? 8 : 0,
        minutes: Math.max(8, Math.round(quote.minutes * 0.15)),
        expires: Date.now() + 45000,
        customerPays: quote.total,
        platformFee: quote.platformCut,
        youEarn: quote.providerEarn,
        bullets: quote.lines.filter((l) => l.amount !== 0).slice(0, 8).map((l) => `${l.label}${l.amount ? ` ${l.amount > 0 ? "+" : ""}$${l.amount}` : ""}`),
      },
    ]);
    const pay = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: id, amount: quote.deposit }),
    }).then((r) => r.json());
    if (pay.url) {
      window.location.href = pay.url;
      return;
    }
    router.push(`/track/${id}`);
  }

  return (
    <main className="wrap py-8 pb-16 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <form className="grid gap-8" onSubmit={submit}>
        <div>
          <p className="text-sm text-[var(--muted)]">{spec.category} · {city.name}, {city.state}</p>
          <h1 className="text-5xl mt-1">{spec.name}</h1>
          <p className="mt-2 text-[var(--muted)]">Service → property → condition → add-ons → photos → locked price. Same modifier model as a DoorDash item, built for jobs.</p>
        </div>
        <label>
          Service
          <select value={service} onChange={(e) => switchService(e.target.value as ServiceId)}>
            {popularSpecs().concat(specById("paint") ? [specById("paint")!] : []).map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            Service property
            <input required value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>
          <label>
            ZIP
            <input required value={zip} onChange={(e) => setZip(e.target.value)} inputMode="numeric" />
          </label>
        </div>
        {spec.questions.map((q) => (
          <SpecField key={q.id} q={q} answers={answers} onChange={setAnswers} />
        ))}
        <label className="!flex items-center gap-2">
          <input type="checkbox" className="!w-auto" checked={asap} onChange={(e) => setAsap(e.target.checked)} />
          ASAP
        </label>
        {!asap ? (
          <label>
            Window
            <select value={when} onChange={(e) => setWhen(e.target.value)}>
              <option>Today, 3–5pm</option>
              <option>Tomorrow, 8–10am</option>
              <option>Saturday, 9–12</option>
            </select>
          </label>
        ) : null}
        <label>
          Promo
          <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="FIRST10" />
        </label>
        <label>
          Tip
          <select value={tip} onChange={(e) => setTip(Number(e.target.value))}>
            <option value={0}>$0</option>
            <option value={5}>$5</option>
            <option value={8}>$8</option>
            <option value={12}>$12</option>
          </select>
        </label>
        <label>
          Your name
          <input required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Mobile
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label>
          Gate / dogs / HOA
          <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        {quote.manualReview ? (
          <p className="text-sm text-cobalt">This one needs a human look (3-story, 18&quot; grass, or paint). We still take the request — no instant lock.</p>
        ) : null}
        {!photosOk ? <p className="text-sm">Add the required photos to lock the price.</p> : null}
        <button className="btn btn-acid" disabled={!canBook && !quote.manualReview} type="submit">
          {quote.manualReview ? "Request review" : `Book now · $${quote.deposit} deposit`}
        </button>
      </form>
      <aside className="card h-fit sticky top-20 overflow-hidden">
        <img src={spec.photo} alt="" className="h-40 w-full object-cover" />
        <div className="p-5">
          <p className="text-sm text-[var(--muted)]">Instant quote</p>
          <p className="text-4xl font-bold">${quote.total.toFixed(2)}</p>
          <p className="text-xs text-[var(--muted)] mt-1">~{Math.round(quote.minutes / 60) || 1}h {quote.minutes % 60}m · Stripe Connect in production</p>
          <ul className="mt-4 text-sm space-y-1.5">
            {quote.lines.map((l, i) => (
              <li key={`${l.label}-${i}`} className="flex justify-between gap-2">
                <span>{l.label}</span>
                <b>{l.amount < 0 ? `-$${Math.abs(l.amount)}` : `$${l.amount}`}</b>
              </li>
            ))}
            <li className="flex justify-between border-t border-[var(--line)] pt-2">
              <span>SHOWUP fee {pass ? "(Pass $0)" : ""}</span>
              <b>${quote.fee.toFixed(2)}</b>
            </li>
            <li className="flex justify-between"><span>Tip</span><b>${quote.tip}</b></li>
            <li className="flex justify-between"><span>Deposit now</span><b>${quote.deposit}</b></li>
          </ul>
          <p className="mt-4 text-xs text-[var(--muted)]">
            Crew sees ${quote.providerEarn.toFixed(2)} after platform cut ${quote.platformCut.toFixed(2)}. Only crews with the right kit get the offer — a 21&quot; push mower does not get 14&quot; grass on a half acre.
          </p>
        </div>
      </aside>
    </main>
  );
}

export default function BookPage() {
  return (
    <Suspense>
      <BookInner />
    </Suspense>
  );
}
