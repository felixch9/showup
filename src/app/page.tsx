"use client";

import Link from "next/link";
import { AREAS_SC, CREWS, SERVICES } from "@/lib/catalog";
import { useI18n } from "@/components/Providers";
import { MapLive } from "@/components/MapLive";
import type { ServiceId } from "@/lib/types";

export default function Home() {
  const { d } = useI18n();

  return (
    <main>
      <section className="relative min-h-[92vh] text-paper">
        <img
          src="/photos/hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-scrim absolute inset-0" />
        <div className="wrap relative flex min-h-[92vh] flex-col justify-end pb-14 pt-28">
          <p className="chip w-fit mb-4">{d.heroKicker}</p>
          <h1 className="max-w-4xl text-5xl sm:text-7xl font-extrabold">{d.hero}</h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">{d.lede}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn btn-acid" href="/book">
              {d.ctaBook}
            </Link>
            <Link className="btn btn-ghost !text-paper !border-white/30" href="/pros">
              {d.ctaPros}
            </Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <MapLive label={d.live} eta="Forest Acres · driveway wash $149" />
            <div className="card !bg-ink text-paper p-5">
              <p className="text-xs uppercase tracking-widest opacity-60">Locked today</p>
              <ul className="mt-3 space-y-3 text-sm">
                <li className="flex justify-between"><span>Lawn · small</span><b>$49</b></li>
                <li className="flex justify-between"><span>Driveway</span><b>$119–189</b></li>
                <li className="flex justify-between"><span>Gutters</span><b>$129–219</b></li>
                <li className="flex justify-between"><span>House wash</span><b>$229+</b></li>
              </ul>
              <p className="mt-4 text-xs opacity-60">20% deposit. Rest when photos hit your phone.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="wrap">
          <h2 className="text-4xl sm:text-5xl max-w-2xl">{d.howTitle}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              [d.how1t, d.how1],
              [d.how2t, d.how2],
              [d.how3t, d.how3],
            ].map(([t, b], i) => (
              <article key={t} className="card p-6">
                <p className="text-acid bg-ink w-8 h-8 rounded-full grid place-items-center font-bold">
                  {i + 1}
                </p>
                <h3 className="mt-4 text-2xl">{t}</h3>
                <p className="mt-2 text-[var(--muted)]">{b}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="wrap">
          <h2 className="text-4xl">{d.services}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => {
              const meta = d.svc[s.id as ServiceId];
              const from = Object.values(s.prices).filter(Boolean)[0];
              return (
                <Link key={s.id} href={`/book?service=${s.id}`} className="card group">
                  <img src={s.photo} alt="" className="h-44 w-full object-cover" />
                  <div className="p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-xl">{meta.name}</h3>
                      <span className="text-sm font-bold">
                        {from ? `from $${from}` : "quote"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--muted)]">{meta.blurb}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="wrap">
          <h2 className="text-4xl">{d.crews}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {CREWS.map((c) => (
              <Link key={c.id} href={`/shop/${c.slug}`} className="card flex gap-4 p-3">
                <img src={c.photo} alt="" className="h-28 w-28 rounded-xl object-cover" />
                <div>
                  <p className="text-xs font-bold text-moss">
                    {c.etaMin} min · {c.rating} ★ · {c.jobs} jobs
                  </p>
                  <h3 className="text-2xl mt-1">{c.name}</h3>
                  <p className="text-sm">{c.trade}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">{c.areas.join(" · ")}</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">
            {AREAS_SC.slice(0, 12).join(" · ")}
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="wrap grid gap-6 md:grid-cols-2 items-center">
          <img src="/photos/flyer.jpg" alt="Handmade flyer next to a booking phone" className="rounded-3xl" />
          <div>
            <h2 className="text-4xl">{d.flyerTitle}</h2>
            <p className="mt-4 text-[var(--muted)] text-lg">{d.flyer}</p>
            <Link className="btn btn-ink mt-6" href="/pros">
              {d.flyerCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="relative text-paper">
        <img src="/photos/pr.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="wrap relative py-20">
          <p className="chip w-fit">San Juan · Bayamón · Carolina · Guaynabo</p>
          <h2 className="mt-4 text-5xl max-w-xl">{d.prTitle}</h2>
          <p className="mt-4 max-w-lg text-white/80">{d.prBody}</p>
          <Link className="btn btn-acid mt-6" href="/waitlist">
            {d.waitlist}
          </Link>
        </div>
      </section>
    </main>
  );
}
