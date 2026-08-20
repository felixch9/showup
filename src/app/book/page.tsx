"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SERVICES } from "@/lib/catalog";
import { cityForZip, depositOf, feeOf, jobId, quotePrice, validZip } from "@/lib/quote";
import { pickCrew } from "@/lib/catalog";
import { getAccount, upsertJob } from "@/lib/store";
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
  const [promo, setPromo] = useState("");
  const [tip, setTip] = useState(8);
  const [contactless, setContactless] = useState(true);
  const [asap, setAsap] = useState(true);
  const [pass, setPass] = useState(false);

  useEffect(() => {
    setPass(getAccount().pass);
  }, []);

  const price = quotePrice(service, size);
  const fee = feeOf(price, pass);
  const off = promo.toUpperCase() === "FIRST10" ? Math.min(10, price) : 0;
  const total = Math.max(0, price + fee + tip - off);
  const deposit = depositOf(total);
  const areaOk = validZip(zip);
  const paint = service === "paint";
  const city = cityForZip(zip);

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
      when: asap ? "ASAP" : when,
      name,
      phone,
      notes,
      price: paint ? 0 : total,
      deposit: paint ? 0 : deposit,
      fee,
      tip,
      promo,
      crewId: crew.id,
      status: "booked",
      lang,
      market: city.slug,
      scheduled: !asap,
      contactless,
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
        {!areaOk ? (
          <p className="text-sm text-cobalt">Need a 5-digit US or PR ZIP.</p>
        ) : (
          <p className="text-sm text-[var(--muted)]">
            Routing to {city.name}, {city.state}
          </p>
        )}
        <label className="!flex items-center gap-2">
          <input type="checkbox" className="!w-auto" checked={asap} onChange={(e) => setAsap(e.target.checked)} />
          ASAP · live pin
        </label>
        <label className="!flex items-center gap-2">
          <input type="checkbox" className="!w-auto" checked={contactless} onChange={(e) => setContactless(e.target.checked)} />
          No-contact · text when on site
        </label>
        <label>
          Promo
          <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="FIRST10" />
        </label>
        <label>
          Tip for crew
          <select value={tip} onChange={(e) => setTip(Number(e.target.value))}>
            <option value={0}>$0</option>
            <option value={5}>$5</option>
            <option value={8}>$8</option>
            <option value={12}>$12</option>
            <option value={20}>$20</option>
          </select>
        </label>
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
          <p className="text-4xl font-bold mt-2">{paint ? "Quote" : `$${total.toFixed(2)}`}</p>
          {!paint ? (
            <ul className="mt-4 text-sm space-y-2">
              <li className="flex justify-between"><span>Job</span><b>${price}</b></li>
              <li className="flex justify-between"><span>Service fee {pass ? "(ShowPass $0)" : ""}</span><b>${fee.toFixed(2)}</b></li>
              <li className="flex justify-between"><span>Tip</span><b>${tip}</b></li>
              {off ? <li className="flex justify-between"><span>FIRST10</span><b>-${off}</b></li> : null}
              <li className="flex justify-between"><span>{d.deposit}</span><b>${deposit}</b></li>
              <li className="flex justify-between"><span>{d.rest}</span><b>${(total - deposit).toFixed(2)}</b></li>
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
