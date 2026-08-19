"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CREWS } from "@/lib/catalog";
import { getShop } from "@/lib/store";
import { useI18n } from "@/components/Providers";
import type { Shop } from "@/lib/types";

export default function ShopPage() {
  const { slug } = useParams<{ slug: string }>();
  const { d, lang } = useI18n();
  const crew = CREWS.find((c) => c.slug === slug);
  const [shop, setShop] = useState<Shop | undefined>();

  useEffect(() => {
    setShop(getShop(slug));
  }, [slug]);

  if (crew) {
    return (
      <main>
        <section className="relative min-h-[50vh] text-paper">
          <img src={crew.photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-ink/60" />
          <div className="wrap relative py-24">
            <p className="chip w-fit">ShowUp crew · {crew.rating} ★</p>
            <h1 className="text-5xl mt-4">{crew.name}</h1>
            <p className="mt-3 max-w-xl text-white/80">{lang === "es" ? crew.bioEs : crew.bio}</p>
            <Link className="btn btn-acid mt-6" href={`/book?service=${crew.trades[0]}`}>
              {d.ctaBook}
            </Link>
          </div>
        </section>
        <section className="wrap py-12">
          <p className="text-sm text-[var(--muted)]">{crew.areas.join(" · ")}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {crew.trades.map((tr) => (
              <Link key={tr} href={`/book?service=${tr}`} className="card p-4">
                <h3 className="text-xl">{d.svc[tr].name}</h3>
                <p className="text-sm text-[var(--muted)]">{d.svc[tr].blurb}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (!shop) {
    return (
      <main className="wrap py-16">
        <h1 className="text-4xl">Demo not on this phone yet</h1>
        <p className="mt-3 text-[var(--muted)]">Generate one from For crews or Ops.</p>
        <Link className="btn btn-ink mt-6" href="/pros">{d.pros}</Link>
      </main>
    );
  }

  return (
    <main className="wrap py-12">
      <p className="chip !bg-ink !text-acid w-fit">Demo storefront · not live jobs</p>
      <h1 className="text-5xl mt-4">{shop.name}</h1>
      <p className="text-lg mt-2">{shop.city} · {shop.trade}</p>
      <h2 className="text-3xl mt-8">{shop.headline}</h2>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">{shop.lede}</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {shop.services.map((s) => (
          <div key={s.name} className="card p-4 flex justify-between">
            <span>{s.name}</span>
            <b>{s.price}</b>
          </div>
        ))}
      </div>
      <p className="mt-8 max-w-2xl">{shop.about}</p>
      <a className="btn btn-acid mt-8" href={`tel:${shop.phone}`}>{shop.cta} · {shop.phone}</a>
      <p className="mt-6 text-sm text-[var(--muted)]">
        This page was generated for a contractor pitch. They pay, we connect booking to ShowUp, then it goes live.
      </p>
    </main>
  );
}
