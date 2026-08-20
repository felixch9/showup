"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { cityBySlug } from "@/lib/cities";
import { CREWS, SERVICES } from "@/lib/catalog";
import { setCitySlug } from "@/lib/store";
import { useI18n } from "@/components/Providers";
import { BottomNav } from "@/components/Shell";
import { MapLive } from "@/components/MapLive";

export default function CityHome() {
  const { city } = useParams<{ city: string }>();
  const { d } = useI18n();
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
            <h1 className="text-5xl mt-4">What do you need done?</h1>
            <p className="mt-3 text-white/70 max-w-lg">
              Same flow as a food app: pick a service, lock a price, watch the truck. ShowPass knocks the service fee to $0.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SERVICES.map((s) => (
                <Link key={s.id} className="btn btn-acid !py-2" href={`/book?service=${s.id}&city=${c.slug}`}>
                  {d.svc[s.id].name}
                </Link>
              ))}
            </div>
          </div>
          <MapLive label={`${show[0]?.name ?? "Crew"} · ${c.eta} min out`} eta={c.name} />
        </div>
      </section>

      <section className="wrap py-10">
        <div className="flex justify-between items-end gap-4">
          <h2 className="text-3xl">Crews near you</h2>
          <Link href="/pass" className="text-sm font-bold">
            ShowPass · $0 fees →
          </Link>
        </div>
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
                <p className="text-xs text-[var(--muted)] mt-1">{crew.areas.join(" · ")}</p>
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
