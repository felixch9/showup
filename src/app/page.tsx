"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CITIES, findCity } from "@/lib/cities";
import { setCitySlug } from "@/lib/store";
import { popularSpecs } from "@/lib/spec";

export default function Home() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [miss, setMiss] = useState("");

  function go(e: React.FormEvent) {
    e.preventDefault();
    const city = findCity(q) || CITIES.find((c) => c.name.toLowerCase() === q.toLowerCase());
    if (!city) {
      setMiss("We launch city-by-city. Pick one below — any US ZIP still books a demo crew.");
      return;
    }
    setCitySlug(city.slug);
    router.push(`/c/${city.slug}`);
  }

  return (
    <main>
      <section className="relative min-h-[88vh] text-paper">
        <img src="/photos/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-scrim absolute inset-0" />
        <div className="wrap relative flex min-h-[88vh] flex-col justify-end pb-16 pt-24">
          <p className="chip w-fit">7,000+ neighborhoods · identity-verified crews</p>
          <h1 className="max-w-4xl text-5xl sm:text-7xl font-extrabold mt-4">
            Home services, tracked like a delivery.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">
            Lawn, pressure wash, gutters, handyman. Locked price. Live pin. Deposit so they show up. Same product shape as DoorDash and Uber Eats — crews, not burritos.
          </p>
          <form onSubmit={go} className="mt-8 flex flex-col sm:flex-row gap-2 max-w-xl">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Address, city, or ZIP"
              className="!rounded-full flex-1"
            />
            <button className="btn btn-acid" type="submit">
              Find crews
            </button>
          </form>
          {miss ? <p className="mt-3 text-sm text-acid">{miss}</p> : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn btn-ghost !text-paper !border-white/30" href="/dash/apply">
              Become a crew
            </Link>
            <Link className="btn btn-ghost !text-paper !border-white/30" href="/merchant">
              Become a business
            </Link>
            <Link className="btn btn-ghost !text-paper !border-white/30" href="/pass">
              ShowPass $9.99
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="wrap">
          <h2 className="text-4xl">Pick a market</h2>
          <p className="mt-2 text-[var(--muted)]">Live density first. Everywhere else still books — we route a demo crew.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CITIES.map((c) => (
              <button
                key={c.slug}
                type="button"
                className="card p-4 text-left"
                onClick={() => {
                  setCitySlug(c.slug);
                  router.push(`/c/${c.slug}`);
                }}
              >
                <div className="flex justify-between text-xs font-bold uppercase tracking-wide">
                  <span className={c.busy === "hot" ? "text-moss" : "text-[var(--muted)]"}>
                    {c.busy === "hot" ? "Hot" : c.busy === "busy" ? "Busy" : "Open"}
                  </span>
                  <span>{c.eta} min</span>
                </div>
                <h3 className="text-2xl mt-2">
                  {c.name}
                  <span className="text-base opacity-50"> {c.state}</span>
                </h3>
                <p className="text-sm text-[var(--muted)]">{c.crews} crews on the board</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="wrap">
          <h2 className="text-4xl">Three apps. One marketplace.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["Customer", "Browse, cart, promo, schedule, live map, reorder, ShowPass, group jobs, gift cards.", "/book"],
              ["Crew", "Zip signup, ID + selfie, FCRA background, MVR, insurance, W-9, instant pay, hotspots, Silver/Gold/Platinum.", "/dash/apply"],
              ["Business", "Store hours, service menu, tablet orders, pause, prep time, promos, weekly payouts.", "/merchant"],
            ].map(([t, b, href]) => (
              <Link key={t} href={href} className="card p-6">
                <h3 className="text-2xl">{t}</h3>
                <p className="mt-2 text-[var(--muted)]">{b}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="wrap grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {popularSpecs().map((s) => (
            <Link key={s.id} href={`/book?service=${s.id}`} className="card">
              <img src={s.photo} alt="" className="h-36 w-full object-cover" />
              <div className="p-3">
                <p className="font-bold">{s.name}</p>
                <p className="text-sm text-[var(--muted)]">from ${s.from}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
