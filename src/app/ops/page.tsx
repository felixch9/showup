"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLeads, upsertLead, upsertShop, getJobs } from "@/lib/store";
import { leadId, slugify } from "@/lib/quote";
import { useI18n } from "@/components/Providers";
import type { Job, Lead, LeadStatus } from "@/lib/types";

export default function OpsPage() {
  const { d, lang } = useI18n();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [paste, setPaste] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("Paste a public listing. Agent drafts — it does not send.");

  function reload() {
    setLeads(getLeads());
    setJobs(getJobs());
  }

  useEffect(() => {
    reload();
  }, []);

  async function runPaste() {
    setBusy(true);
    setMsg("Agent reading listing…");
    try {
      const parsed = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "parse", text: paste }),
      }).then((r) => r.json());
      const demo = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "demo",
          name: parsed.name,
          trade: parsed.trade,
          city: parsed.city,
          phone: parsed.phone,
          lang,
        }),
      }).then((r) => r.json());
      const scripted = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "script",
          name: parsed.name,
          trade: parsed.trade,
          city: parsed.city,
          lang,
        }),
      }).then((r) => r.json());
      const slug = demo.slug || slugify(parsed.name);
      upsertShop({ ...demo, slug, lang });
      upsertLead({
        id: leadId(),
        createdAt: Date.now(),
        name: parsed.name,
        trade: parsed.trade,
        city: parsed.city,
        market: /pr|juan|bayam/i.test(parsed.city || "") ? "puerto-rico" : "columbia",
        phone: parsed.phone || "",
        website: parsed.website || "",
        source: "pasted public listing",
        notes: parsed.notes || paste.slice(0, 180),
        status: "scripted",
        script: scripted.script,
        demoSlug: slug,
      });
      setPaste("");
      setMsg(`Demo + script ready for ${parsed.name}. You call. Agent does not send.`);
      reload();
    } catch {
      setMsg("Agent failed. Fallback still saved if the parse was partial.");
    } finally {
      setBusy(false);
    }
  }

  async function scriptLead(lead: Lead) {
    setBusy(true);
    const scripted = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "script",
        name: lead.name,
        trade: lead.trade,
        city: lead.city,
        lang,
      }),
    }).then((r) => r.json());
    upsertLead({ ...lead, script: scripted.script, status: "scripted" });
    reload();
    setBusy(false);
  }

  async function mockLead(lead: Lead) {
    setBusy(true);
    const demo = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "demo",
        name: lead.name,
        trade: lead.trade,
        city: lead.city,
        phone: lead.phone,
        lang,
      }),
    }).then((r) => r.json());
    const slug = demo.slug || slugify(lead.name);
    upsertShop({ ...demo, slug, lang });
    upsertLead({ ...lead, demoSlug: slug, status: "mocked" });
    reload();
    setBusy(false);
  }

  function setStatus(lead: Lead, status: LeadStatus) {
    upsertLead({ ...lead, status });
    reload();
  }

  return (
    <main className="wrap py-10">
      <p className="chip !bg-ink !text-acid w-fit">Human in the loop · no auto-send</p>
      <h1 className="text-5xl mt-3">{d.opsTitle}</h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">{d.opsLede}</p>
      <p className="mt-2 text-sm">{msg}</p>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <label>
            {d.paste}
            <textarea
              rows={8}
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              placeholder="Turtle Shell Pressure Washing — Columbia 29209 — driveway and house wash. Call (803) … Facebook post text, Google listing, flyer transcript."
            />
          </label>
          <button className="btn btn-acid mt-3" disabled={busy || paste.length < 8} onClick={runPaste} type="button">
            {d.runAgent}
          </button>
        </div>
        <div className="card p-5">
          <h2 className="text-2xl">Jobs on this phone</h2>
          {jobs.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--muted)]">None yet. Book one as a homeowner to see tracking.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {jobs.map((j) => (
                <li key={j.id} className="flex justify-between gap-2">
                  <Link href={`/track/${j.id}`} className="underline">
                    {j.id} · {j.address || j.zip}
                  </Link>
                  <span>{j.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-10 grid gap-4">
        {leads.map((lead) => (
          <article key={lead.id} className="card p-5 grid gap-3 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-moss">
                {lead.status} · {lead.market} · {lead.source}
              </p>
              <h3 className="text-2xl mt-1">{lead.name}</h3>
              <p className="text-sm">
                {lead.trade} · {lead.city} · {lead.phone || "no phone yet"}
              </p>
              <p className="text-sm text-[var(--muted)] mt-1">{lead.notes}</p>
              {lead.script ? (
                <blockquote className="mt-3 text-sm border-l-4 border-acid pl-3">{lead.script}</blockquote>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <button className="btn btn-ghost" type="button" disabled={busy} onClick={() => mockLead(lead)}>
                Demo
              </button>
              <button className="btn btn-ghost" type="button" disabled={busy} onClick={() => scriptLead(lead)}>
                {d.callScript}
              </button>
              {lead.demoSlug ? (
                <Link className="btn btn-ghost text-center" href={`/shop/${lead.demoSlug}`}>
                  Open demo
                </Link>
              ) : null}
              {lead.phone ? (
                <a className="btn btn-ink text-center" href={`tel:${lead.phone}`}>
                  Call
                </a>
              ) : null}
              <button className="btn btn-acid" type="button" onClick={() => setStatus(lead, "joined")}>
                {d.ship}
              </button>
              <button className="text-xs underline" type="button" onClick={() => setStatus(lead, "rejected")}>
                Not a fit
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
