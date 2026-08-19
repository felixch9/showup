"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SERVICES } from "@/lib/catalog";
import { depositOf, inColumbia, jobId, quotePrice } from "@/lib/quote";
import { pickCrew } from "@/lib/catalog";
import { upsertJob } from "@/lib/store";
import { useI18n } from "@/components/Providers";
import type { ServiceId } from "@/lib/types";

function BookInner() {
  const { d, lang } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const [service, setService] = useState<ServiceId>(
    (params.get("service") as ServiceId) || "driveway",
  );
  const [size, setSize] = useState("medium");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("29206");
  const [when, setWhen] = useState<string>(d.today);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const price = quotePrice(service, size);
  const deposit = depositOf(price);
  const areaOk = inColumbia(zip);
  const paint = service === "paint";

  const summary = useMemo(() => d.svc[service].name, [d, service]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!areaOk) return;
    const crew = pickCrew(service, zip);
    const id = jobId();
    upsertJob({
      id,
      createdAt: Date.now(),
      service,
      size,
      address,
      zip,
      when,
      name,
      phone,
      notes,
      price: paint ? 0 : price,
      deposit: paint ? 0 : deposit,
      crewId: crew.id,
      status: "booked",
      lang,
      market: "columbia",
    });
    router.push(`/track/${id}`);
  }

  return (
    <main className="wrap py-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form className="grid gap-4" onSubmit={submit}>
        <h1 className="text-5xl">{d.bookTitle}</h1>
        <label>
          {d.pickService}
          <select value={service} onChange={(e) => setService(e.target.value as ServiceId)}>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {d.svc[s.id].name}
              </option>
            ))}
          </select>
        </label>
        <label>
          {d.yard}
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="small">{d.size.small}</option>
            <option value="medium">{d.size.medium}</option>
            <option value="large">{d.size.large}</option>
          </select>
        </label>
        <label>
          {d.address}
          <input required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="4423 Forest Drive" />
        </label>
        <label>
          {d.zip}
          <input required value={zip} onChange={(e) => setZip(e.target.value)} inputMode="numeric" />
        </label>
        {!areaOk ? <p className="text-sm text-cobalt">{d.outOfArea}</p> : null}
        {paint ? <p className="text-sm text-[var(--muted)]">{d.paintNote}</p> : null}
        <label>
          {d.when}
          <select value={when} onChange={(e) => setWhen(e.target.value)}>
            <option>{d.today}</option>
            <option>{d.tomorrow}</option>
            <option>{d.sat}</option>
          </select>
        </label>
        <label>
          {d.name}
          <input required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          {d.phone}
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label>
          {d.notes}
          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <button className="btn btn-acid" disabled={!areaOk} type="submit">
          {d.confirm} {paint ? "" : `· $${deposit}`}
        </button>
      </form>
      <aside className="card overflow-hidden h-fit">
        <img src={SERVICES.find((s) => s.id === service)?.photo} alt="" className="h-48 w-full object-cover" />
        <div className="p-5">
          <p className="text-sm text-[var(--muted)]">{summary}</p>
          <p className="text-4xl font-bold mt-2">{paint ? "Quote" : `$${price}`}</p>
          {!paint ? (
            <ul className="mt-4 text-sm space-y-2">
              <li className="flex justify-between"><span>{d.deposit}</span><b>${deposit}</b></li>
              <li className="flex justify-between"><span>{d.rest}</span><b>${price - deposit}</b></li>
            </ul>
          ) : null}
          <p className="mt-4 text-xs text-[var(--muted)]">
            Demo checkout — no card charged. Stripe plugs in when Felix connects it. The slot still holds on this phone.
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
