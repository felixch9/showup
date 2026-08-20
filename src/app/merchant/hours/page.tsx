"use client";

import { getMerchant, setMerchant } from "@/lib/store";
import { useEffect, useState } from "react";

export default function Hours() {
  const [hours, setHours] = useState("7:00a – 6:00p");
  const [prep, setPrep] = useState(25);
  useEffect(() => {
    const m = getMerchant();
    setHours(m.hours);
    setPrep(m.prepMin);
  }, []);
  function save() {
    setMerchant({ ...getMerchant(), hours, prepMin: prep });
  }
  return (
    <main className="px-4 py-5 pb-24 grid gap-3 max-w-lg">
      <h1 className="text-3xl">Hours & prep</h1>
      <label>
        Regular hours
        <input value={hours} onChange={(e) => setHours(e.target.value)} />
      </label>
      <label>
        Prep / travel buffer (min)
        <input type="number" value={prep} onChange={(e) => setPrep(Number(e.target.value))} />
      </label>
      <p className="text-sm text-[var(--muted)]">Special hours and holiday closures live here in production — same as DoorDash store availability.</p>
      <button className="btn btn-ink" type="button" onClick={save}>
        Save
      </button>
    </main>
  );
}
