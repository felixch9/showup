"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCrewSession, getJob, getOffers, setCrewSession, setOffers, upsertJob } from "@/lib/store";
import type { Offer } from "@/lib/types";
import type { PhotoSlot } from "@/lib/quote-engine";

export default function Offers() {
  const router = useRouter();
  const [offers, set] = useState<Offer[]>([]);
  const [now, setNow] = useState(Date.now());
  const [openPhotos, setOpen] = useState<string | null>(null);

  useEffect(() => {
    set(getOffers());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  function decline(id: string) {
    const next = offers.filter((o) => o.id !== id);
    setOffers(next);
    set(next);
    const s = getCrewSession();
    setCrewSession({ ...s, acceptance: Math.max(50, s.acceptance - 2) });
  }

  function accept(o: Offer) {
    const s = getCrewSession();
    setCrewSession({
      ...s,
      acceptance: Math.min(100, s.acceptance + 1),
      jobs: s.jobs + 1,
      today: s.today + (o.youEarn ?? o.pay + o.tip + o.peak),
    });
    if (o.jobId) {
      const job = getJob(o.jobId);
      if (job) upsertJob({ ...job, status: "accepted", machine: "accepted" });
    }
    setOffers(offers.filter((x) => x.id !== o.id));
    router.push(`/dash/job/${o.jobId ?? o.id}`);
  }

  return (
    <main className="px-4 py-5 pb-24">
      <h1 className="text-3xl">New job</h1>
      <p className="text-sm text-white/60 mt-1">Customer price, our cut, what you earn. Decline jobs your kit can&apos;t do.</p>
      <div className="mt-5 grid gap-3">
        {offers.map((o) => {
          const sec = Math.max(0, Math.round((o.expires - now) / 1000));
          const job = o.jobId ? getJob(o.jobId) : undefined;
          const photos = (job?.answers?.photos as PhotoSlot[] | undefined) ?? [];
          const earn = o.youEarn ?? o.pay + o.tip + o.peak;
          return (
            <article key={o.id} className="offer rounded-2xl bg-white text-ink p-4">
              <div className="flex justify-between text-xs font-bold">
                <span>{o.minutes} min · {o.miles} mi</span>
                <span className="text-red-600">{sec}s</span>
              </div>
              <h2 className="text-2xl mt-1">{o.service}</h2>
              <p>{o.neighborhood}</p>
              <dl className="mt-3 text-sm space-y-1">
                <div className="flex justify-between"><dt>Customer pays</dt><dd>${(o.customerPays ?? earn + (o.platformFee ?? 0)).toFixed(2)}</dd></div>
                <div className="flex justify-between"><dt>SHOWUP fees</dt><dd>-${(o.platformFee ?? 17).toFixed(2)}</dd></div>
                <div className="flex justify-between text-xl font-bold"><dt>YOU EARN</dt><dd>${earn.toFixed(2)}</dd></div>
              </dl>
              {o.bullets?.length ? (
                <ul className="mt-3 text-sm opacity-80 list-disc pl-4">
                  {o.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : null}
              {photos.length ? (
                <button className="text-sm underline mt-2" type="button" onClick={() => setOpen(openPhotos === o.id ? null : o.id)}>
                  View photos
                </button>
              ) : null}
              {openPhotos === o.id ? (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {photos.map((ph) => (
                    <img key={ph.id} src={ph.dataUrl} alt="" className="h-20 object-cover rounded-lg" />
                  ))}
                </div>
              ) : null}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="btn btn-ghost" type="button" onClick={() => decline(o.id)}>Decline</button>
                <button className="btn btn-acid" type="button" onClick={() => accept(o)}>Accept ${earn.toFixed(0)}</button>
              </div>
            </article>
          );
        })}
        {offers.length === 0 ? (
          <p className="text-white/60">Board is quiet. A customer booking lands here with the spec — grass height, kit required, photos.</p>
        ) : null}
      </div>
    </main>
  );
}
