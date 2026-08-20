"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCrewSession, getOffers, setCrewSession, setOffers } from "@/lib/store";
import type { Offer } from "@/lib/types";

export default function Offers() {
  const router = useRouter();
  const [offers, set] = useState<Offer[]>([]);
  const [now, setNow] = useState(Date.now());

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
    setCrewSession({ ...s, acceptance: Math.min(100, s.acceptance + 1), jobs: s.jobs + 1, today: s.today + o.pay + o.tip + o.peak });
    setOffers(offers.filter((x) => x.id !== o.id));
    router.push(`/dash/job/${o.id}`);
  }

  return (
    <main className="px-4 py-5 pb-24">
      <h1 className="text-3xl">Offers</h1>
      <p className="text-sm text-white/60 mt-1">Accept or decline. Acceptance rate feeds Silver / Gold / Platinum.</p>
      <div className="mt-5 grid gap-3">
        {offers.map((o) => {
          const sec = Math.max(0, Math.round((o.expires - now) / 1000));
          return (
            <article key={o.id} className="offer rounded-2xl bg-white text-ink p-4">
              <div className="flex justify-between text-xs font-bold">
                <span>{o.minutes} min away · {o.miles} mi</span>
                <span className="text-red-600">{sec}s</span>
              </div>
              <h2 className="text-2xl mt-1">{o.service}</h2>
              <p>{o.neighborhood}</p>
              <p className="mt-2 text-3xl font-bold">
                ${(o.pay + o.tip + o.peak).toFixed(2)}
              </p>
              <p className="text-xs opacity-60">
                ${o.pay} base · ${o.tip} tip · ${o.peak} peak
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="btn btn-ghost" type="button" onClick={() => decline(o.id)}>
                  Decline
                </button>
                <button className="btn btn-acid" type="button" onClick={() => accept(o)}>
                  Accept
                </button>
              </div>
            </article>
          );
        })}
        {offers.length === 0 ? (
          <p className="text-white/60">Board is quiet. Stay live — peak pay lights up after 4pm in most cities.</p>
        ) : null}
      </div>
    </main>
  );
}
