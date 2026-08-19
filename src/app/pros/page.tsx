"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/quote";
import { upsertLead, upsertShop } from "@/lib/store";
import { leadId } from "@/lib/quote";
import { useI18n } from "@/components/Providers";

export default function ProsPage() {
  const { d, lang } = useI18n();
  const router = useRouter();
  const [plan, setPlan] = useState<"jobs" | "page" | "both">("jobs");
  const [name, setName] = useState("");
  const [trade, setTrade] = useState("Pressure washing");
  const [city, setCity] = useState("Columbia, SC");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "demo",
          name,
          trade,
          city,
          phone,
          lang,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Agent failed");
      const slug = data.slug || slugify(name);
      upsertShop({ ...data, slug, name, trade, city, phone, lang });
      upsertLead({
        id: leadId(),
        createdAt: Date.now(),
        name,
        trade,
        city,
        market: city.toLowerCase().includes("pr") || city.toLowerCase().includes("juan")
          ? "puerto-rico"
          : "columbia",
        phone,
        website: `/shop/${slug}`,
        source: "contractor join form",
        notes: `Plan: ${plan}`,
        status: "mocked",
        script: "",
        demoSlug: slug,
      });
      router.push(`/shop/${slug}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="wrap py-12 grid gap-10 lg:grid-cols-2">
      <div>
        <p className="chip !bg-ink !text-acid w-fit">Crews · Columbia first</p>
        <h1 className="text-5xl mt-4">{d.prosTitle}</h1>
        <p className="mt-4 text-lg text-[var(--muted)]">{d.prosLede}</p>
        <img src="/photos/flyer.jpg" alt="" className="mt-8 rounded-3xl" />
      </div>
      <form className="card p-6 grid gap-4" onSubmit={generate}>
        <div className="grid gap-2">
          {([
            ["jobs", d.planJobs, d.planJobsD],
            ["page", d.planPage, d.planPageD],
            ["both", d.planBoth, d.planBothD],
          ] as const).map(([id, t, b]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPlan(id)}
              className={`text-left rounded-2xl border p-3 ${plan === id ? "border-ink bg-acid/40" : "border-[var(--line)]"}`}
            >
              <b>{t}</b>
              <p className="text-sm text-[var(--muted)]">{b}</p>
            </button>
          ))}
        </div>
        <label>
          {d.bizName}
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Rivera Pressure Wash" />
        </label>
        <label>
          {d.trade}
          <input required value={trade} onChange={(e) => setTrade(e.target.value)} />
        </label>
        <label>
          City
          <input required value={city} onChange={(e) => setCity(e.target.value)} />
        </label>
        <label>
          {d.phone}
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        {err ? <p className="text-sm text-red-700">{err}</p> : null}
        <button className="btn btn-acid" disabled={busy} type="submit">
          {busy ? "Grok is building…" : d.generate}
        </button>
        <p className="text-xs text-[var(--muted)]">
          Demo is free. Monthly or take-rate starts when you say the site is good to ship. No Facebook scraping. No auto-DMs.
        </p>
      </form>
    </main>
  );
}
