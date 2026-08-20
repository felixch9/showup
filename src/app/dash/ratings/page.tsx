"use client";

import { useEffect, useState } from "react";
import { getCrewSession } from "@/lib/store";

export default function Ratings() {
  const [s, setS] = useState(getCrewSession());
  useEffect(() => setS(getCrewSession()), []);

  const rows = [
    ["Customer rating", s.rating.toFixed(2), "4.70 for Platinum"],
    ["Acceptance", `${s.acceptance}%`, "70% Platinum / 50% Gold"],
    ["Completion", `${s.completion}%`, "95%+"],
    ["On-time", `${s.onTime}%`, "90%+"],
  ];

  return (
    <main className="px-4 py-5 pb-24">
      <p className="text-acid text-xs uppercase tracking-widest">{s.tier} status</p>
      <h1 className="text-3xl mt-1">Ratings</h1>
      <p className="text-sm text-white/60 mt-2">
        DoorDash publishes these four numbers for Dasher Rewards (Silver / Gold / Platinum). We use the same idea for crews.
      </p>
      <div className="mt-6 grid gap-3">
        {rows.map(([k, v, n]) => (
          <div key={k} className="rounded-2xl bg-white/5 p-4 flex justify-between">
            <div>
              <p className="text-sm opacity-60">{k}</p>
              <p className="text-xs opacity-40">{n}</p>
            </div>
            <p className="text-2xl font-bold">{v}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
