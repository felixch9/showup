"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { cityBySlug } from "@/lib/cities";
import { CREWS } from "@/lib/catalog";
import { popularSpecs } from "@/lib/spec";
import { setCitySlug } from "@/lib/store";
import { BottomNav } from "@/components/Shell";
import { MapLive } from "@/components/MapLive";

export default function CityHome() {
  const { city } = useParams<{ city: string }>();
  const c = cityBySlug(city) ?? cityBySlug("columbia-sc")!;

  useEffect(() => {
    setCitySlug(c.slug);
  }, [c.slug]);

  const crews = CREWS.filter((x) => x.market === c.slug);
  const show = crews.length ? crews : CREWS.filter((x) => x.market === "columbia");

  return (
    <main className="pb-20">
      <section className="bg-ink text-paper">
        <div className="wrap py-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="chip w-fit">
              {c.name}, {c.state} · {c.crews} crews · {c.eta} min
            </p>
            <h1 className="text-5xl mt-4">What does your home need?</h1>
            <p className="mt-3 text-white/70 max-w-lg">
              Pick a service. Describe the property. Lock a price. A qualified crew accepts — not a 21&quot; push mower on a jungle lot.
            </p>
          </div>
          <MapLive label={`${show[0]?.name ?? "Crew"} · ${c.eta} min out`} eta={c.name} />
        </div>
      </section>

      <section className="wrap py-10">
        <h2 className="text-3xl">Popular near you</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularSpecs().map((s) => (
            <Link key={s.id} href={`/book?service=${s.id}&city=${c.slug}`} className="card">
              <img src={s.photo} alt="" className="h-36 w-full object-cover" />
              <div className="p-4">
                <h3 className="text-xl">{s.name}</h3>
                <p className="text-sm text-[var(--muted)]">{s.category}</p>
                <p className="mt-1 font-bold">from ${s.from}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap pb-10">
        <h2 className="text-3xl">Crews near you</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {show.map((crew) => (
            <Link key={crew.id} href={`/shop/${crew.slug}`} className="card flex gap-4 p-3">
              <img src={crew.photo} alt="" className="h-28 w-28 rounded-xl object-cover" />
              <div>
                <p className="text-xs font-bold text-moss uppercase">
                  {crew.tier ?? "silver"} · {crew.rating} ★ · {crew.etaMin} min
                </p>
                <h3 className="text-2xl mt-1">{crew.name}</h3>
                <p className="text-sm">{crew.trade}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{(crew.equipment ?? []).slice(0, 4).join(" · ")}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <BottomNav
        active={`/c/${c.slug}`}
        items={[
          { href: `/c/${c.slug}`, label: "Home" },
          { href: "/book", label: "Book" },
          { href: "/orders", label: "Orders" },
          { href: "/pass", label: "Pass" },
          { href: "/account", label: "Account" },
        ]}
      />
    </main>
  );
}
