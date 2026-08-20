"use client";

import { useEffect, useState } from "react";
import { getJobs, getMerchant, setMerchant, upsertJob } from "@/lib/store";
import type { Job, MerchantStore } from "@/lib/types";

export default function MerchantHome() {
  const [store, setStore] = useState<MerchantStore | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    setStore(getMerchant());
    setJobs(getJobs());
  }, []);

  if (!store) return null;

  function pause() {
    const next = { ...store!, open: !store!.open, pausedUntil: store!.open ? Date.now() + 3600000 : 0 };
    setMerchant(next);
    setStore(next);
  }

  function confirm(j: Job) {
    const next = { ...j, status: "confirmed" as const };
    upsertJob(next);
    setJobs(getJobs());
  }

  return (
    <main className="px-4 py-5 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-moss">
            {store.open ? "Store live" : "Paused"} · prep {store.prepMin}m
          </p>
          <h1 className="text-3xl">{store.name}</h1>
        </div>
        <button className="btn btn-ink" type="button" onClick={pause}>
          {store.open ? "Pause 60m" : "Go live"}
        </button>
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Tablet / Order Manager pattern: confirm, bump prep, mark ready. DoorDash merchant portal features, applied to crews.
      </p>
      <div className="mt-6 grid gap-3">
        {jobs.length === 0 ? (
          <p className="card p-5">No tickets yet. A customer booking lands here like a red tablet ping.</p>
        ) : (
          jobs.map((j) => (
            <article key={j.id} className="card p-4">
              <div className="flex justify-between text-xs font-bold">
                <span>{j.id} · {j.status}</span>
                <span>${j.price}</span>
              </div>
              <h2 className="text-xl mt-1">{j.service} · {j.size}</h2>
              <p className="text-sm">{j.address} {j.zip}</p>
              {j.status === "booked" ? (
                <button className="btn btn-acid mt-3" type="button" onClick={() => confirm(j)}>
                  Confirm · {store.prepMin} min
                </button>
              ) : (
                <p className="text-sm mt-2 text-moss">Customer can track the truck.</p>
              )}
            </article>
          ))
        )}
      </div>
    </main>
  );
}
