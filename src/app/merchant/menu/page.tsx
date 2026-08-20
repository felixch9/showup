"use client";

import { SERVICES } from "@/lib/catalog";
import { useI18n } from "@/components/Providers";
import { useState } from "react";

export default function MenuPage() {
  const { d } = useI18n();
  const [off, setOff] = useState<string[]>([]);
  return (
    <main className="px-4 py-5 pb-24">
      <h1 className="text-3xl">Service menu</h1>
      <p className="text-sm text-[var(--muted)] mt-1">86 an item the way restaurants 86 a dish.</p>
      <div className="mt-4 grid gap-3">
        {SERVICES.map((s) => (
          <div key={s.id} className="card p-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg">{d.svc[s.id].name}</h2>
              <p className="text-sm text-[var(--muted)]">from ${Object.values(s.prices).filter(Boolean)[0] || "quote"}</p>
            </div>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => setOff((x) => (x.includes(s.id) ? x.filter((i) => i !== s.id) : [...x, s.id]))}
            >
              {off.includes(s.id) ? "Sold out" : "Available"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
