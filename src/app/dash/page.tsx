"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCrewSession, getIdentity, setCrewSession } from "@/lib/store";
import type { CrewSession } from "@/lib/types";
import { MapLive } from "@/components/MapLive";

export default function DashHome() {
  const router = useRouter();
  const [s, setS] = useState<CrewSession | null>(null);
  const [name, setName] = useState("Crew");

  useEffect(() => {
    const id = getIdentity();
    if (id.status !== "approved") {
      router.replace("/dash/apply");
      return;
    }
    setName(id.first || "Crew");
    setS(getCrewSession());
  }, [router]);

  if (!s) return null;

  function toggle() {
    const next = { ...s!, online: !s!.online };
    setCrewSession(next);
    setS(next);
  }

  return (
    <main className="px-4 py-5 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-acid">{s.tier} · {s.rating} ★</p>
          <h1 className="text-3xl mt-1">Hey {name}</h1>
        </div>
        <button className={`btn ${s.online ? "btn-acid" : "btn-ghost !text-paper"}`} onClick={toggle} type="button">
          {s.online ? "You're live" : "Go live"}
        </button>
      </div>
      <div className="mt-4 relative rounded-2xl overflow-hidden min-h-[260px]">
        <MapLive label={s.online ? "Hot zone · Midlands" : "Offline"} eta="Peak +$3–$5" />
        <span className="heat bg-red-500 w-28 h-28 left-[12%] top-[30%]" />
        <span className="heat bg-orange-400 w-24 h-24 left-[48%] top-[42%]" />
        <span className="heat bg-acid w-20 h-20 left-[70%] top-[22%]" />
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {[
          ["Today", `$${s.today.toFixed(2)}`],
          ["Jobs", String(s.jobs)],
          ["Tips", `$${s.tips}`],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-white/5 p-3">
            <p className="text-xs opacity-60">{k}</p>
            <p className="text-xl font-bold">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2">
        <Link className="btn btn-acid w-full" href="/dash/offers">
          {s.online ? "See offers" : "Go live to get offers"}
        </Link>
        <Link className="btn btn-ghost !text-paper w-full" href="/dash/id-check">
          Random ID selfie (post-job check)
        </Link>
      </div>
      <p className="mt-4 text-xs opacity-50">
        Hotspots, Dash Now, peak pay, and between-job selfie checks are the public DoorDash/Uber pattern. Map is simulated.
      </p>
    </main>
  );
}
