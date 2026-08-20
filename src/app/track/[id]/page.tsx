"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { crewById, serviceById } from "@/lib/catalog";
import { getJob, jobProgress, upsertJob } from "@/lib/store";
import { MapLive } from "@/components/MapLive";
import { useI18n } from "@/components/Providers";
import type { Job } from "@/lib/types";

export default function TrackPage() {
  const { id } = useParams<{ id: string }>();
  const { d } = useI18n();
  const [job, setJob] = useState<Job | undefined>();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setJob(getJob(id));
    const t = setInterval(() => setTick((n) => n + 1), 2000);
    return () => clearInterval(t);
  }, [id]);

  useEffect(() => {
    if (!job) return;
    const p = jobProgress(job);
    if (p.status !== job.status) {
      const next = { ...job, status: p.status };
      upsertJob(next);
      setJob(next);
    }
  }, [tick, job]);

  if (!job) {
    return (
      <main className="wrap py-16">
        <h1 className="text-4xl">Job not on this phone</h1>
        <p className="mt-3 text-[var(--muted)]">Bookings live in this browser until Stripe + SMS are wired.</p>
        <Link className="btn btn-ink mt-6" href="/book">{d.book}</Link>
      </main>
    );
  }

  const crew = crewById(job.crewId);
  const svc = serviceById(job.service);
  const p = jobProgress(job);
  const label =
    p.status === "booked" ? d.booked :
    p.status === "confirmed" ? "Merchant confirmed" :
    p.status === "enroute" ? d.onway :
    p.status === "onsite" ? d.onsite : d.done;

  return (
    <main className="bg-ink text-paper min-h-[80vh]">
      <div className="wrap py-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="chip w-fit">{job.id} · {label}</p>
          <h1 className="text-5xl mt-4">{d.tracking}</h1>
          <div className="mt-6">
            <MapLive
              label={`${crew?.name ?? "Crew"} · ${label}`}
              eta={`${d.eta} ${Math.max(1, Math.round((100 - p.pct) / 6))} min`}
            />
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/10">
            <div className="h-2 rounded-full bg-acid" style={{ width: `${p.pct}%` }} />
          </div>
        </div>
        <aside className="card !bg-[#161b14] !border-white/10 p-5">
          {crew ? (
            <div className="flex gap-3">
              <img src={crew.photo} alt="" className="h-16 w-16 rounded-xl object-cover" />
              <div>
                <h2 className="text-2xl">{crew.name}</h2>
                <p className="text-sm opacity-70">{crew.trade} · {crew.rating} ★</p>
              </div>
            </div>
          ) : null}
          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Service</dt><dd>{svc ? d.svc[svc.id].name : job.service}</dd></div>
            <div className="flex justify-between"><dt>{d.when}</dt><dd>{job.when}</dd></div>
            <div className="flex justify-between"><dt>{d.address}</dt><dd className="text-right max-w-[60%]">{job.address}</dd></div>
            <div className="flex justify-between"><dt>Total</dt><dd>{job.price ? `$${job.price}` : "quote"}</dd></div>
            <div className="flex justify-between"><dt>{d.deposit}</dt><dd>${job.deposit} held</dd></div>
          </dl>
          {p.status === "done" ? (
            <div className="mt-6">
              <img src="/photos/split.jpg" alt="Job photos" className="rounded-xl" />
              <p className="mt-3 text-sm">{d.payRest} ${Math.max(0, job.price - job.deposit)}</p>
            </div>
          ) : (
            <p className="mt-6 text-sm opacity-70">
              You will get photos when they finish. If something looks off, it does not ship — we send them back.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
