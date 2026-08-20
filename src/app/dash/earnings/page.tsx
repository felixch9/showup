"use client";

import { useEffect, useState } from "react";
import { getCrewSession, getIdentity } from "@/lib/store";

export default function Earnings() {
  const [today, setToday] = useState(0);
  const [week, setWeek] = useState(0);
  const [tips, setTips] = useState(0);
  const [payout, setPayout] = useState("");

  useEffect(() => {
    const s = getCrewSession();
    setToday(s.today);
    setWeek(s.week);
    setTips(s.tips);
    setPayout(getIdentity().payout);
  }, []);

  return (
    <main className="px-4 py-5 pb-24">
      <h1 className="text-3xl">Earnings</h1>
      <p className="text-5xl font-bold mt-4">${week.toFixed(2)}</p>
      <p className="text-sm opacity-60">This week · {payout === "instant" ? "Instant after each job" : "Weekly ACH"}</p>
      <div className="grid grid-cols-2 gap-2 mt-6">
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-xs opacity-60">Today</p>
          <p className="text-2xl font-bold">${today.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-xs opacity-60">Tips (100% yours)</p>
          <p className="text-2xl font-bold">${tips.toFixed(2)}</p>
        </div>
      </div>
      <ul className="mt-6 space-y-3 text-sm">
        <li className="flex justify-between border-b border-white/10 pb-2"><span>Driveway · Forest Acres</span><b>$33.00</b></li>
        <li className="flex justify-between border-b border-white/10 pb-2"><span>Lawn · Irmo</span><b>$19.00</b></li>
        <li className="flex justify-between border-b border-white/10 pb-2"><span>Peak pay 4–7p</span><b>$12.00</b></li>
      </ul>
      <button className="btn btn-acid w-full mt-6" type="button">
        Cash out now (demo)
      </button>
    </main>
  );
}
