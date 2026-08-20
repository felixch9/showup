"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "./Providers";
import { cityBySlug } from "@/lib/cities";
import { getCitySlug } from "@/lib/store";
import { useEffect, useState } from "react";

export function Shell({ children }: { children: React.ReactNode }) {
  const { d, lang, setLang } = useI18n();
  const path = usePathname();
  const [city, setCity] = useState("columbia-sc");
  const app = path.startsWith("/dash") || path.startsWith("/merchant") || path.startsWith("/apply");

  useEffect(() => {
    setCity(getCitySlug());
  }, [path]);

  if (app) return <>{children}</>;

  const c = cityBySlug(city);
  const dark = path === "/" || path.startsWith("/track") || path.startsWith("/c/");

  return (
    <div className="min-h-full flex flex-col">
      <header
        className={`sticky top-0 z-40 ${dark ? "bg-ink/80 text-paper" : "bg-paper/90 text-ink"} backdrop-blur-md`}
      >
        <div className="wrap flex items-center gap-3 py-3">
          <Link href="/" className="display text-xl font-bold tracking-tight">
            {d.brand}
          </Link>
          <Link href="/" className="hidden sm:inline text-xs opacity-70 underline-offset-2 hover:underline">
            {c ? `${c.name}, ${c.state}` : "Pick a city"}
          </Link>
          <nav className="ml-auto flex items-center gap-1 text-sm font-semibold">
            <Link className="px-2 py-2 hidden md:inline" href={c ? `/c/${c.slug}` : "/"}>
              Services
            </Link>
            <Link className="px-2 py-2 hidden sm:inline" href="/orders">
              Orders
            </Link>
            <Link className="px-2 py-2 hidden lg:inline" href="/dash/apply">
              Crew
            </Link>
            <Link className="px-2 py-2 hidden lg:inline" href="/merchant">
              Business
            </Link>
            <button
              className="ml-1 rounded-full border border-current/20 px-2 py-1 text-xs"
              onClick={() => setLang(lang === "en" ? "es" : "en")}
              type="button"
            >
              {lang === "en" ? "ES" : "EN"}
            </button>
            <Link className="btn btn-acid !py-2 !px-3 text-sm" href="/book">
              {d.ctaBook}
            </Link>
          </nav>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-t border-[var(--line)] py-10 text-sm text-[var(--muted)]">
        <div className="wrap grid gap-6 md:grid-cols-4">
          <p className="md:col-span-2">
            ShowUp is a home-services marketplace — the DoorDash-shaped product for lawn, wash, gutters, and trades. Not affiliated with DoorDash or Uber. Identity checks in this demo are sandbox: no real SSN or ID is uploaded to a server.
          </p>
          <div className="grid gap-1">
            <Link href="/dash/apply">Become a crew</Link>
            <Link href="/merchant">Become a business</Link>
            <Link href="/pass">ShowPass</Link>
            <Link href="/ops">Ops desk</Link>
          </div>
          <div className="grid gap-1">
            <Link href="/support">Support</Link>
            <Link href="/legal">Legal · FCRA sandbox</Link>
            <Link href="/account">Account</Link>
            <Link href="/gift">Gift cards</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function BottomNav({
  items,
  active,
}: {
  items: { href: string; label: string }[];
  active: string;
}) {
  return (
    <nav className="app-nav">
      {items.map((i) => (
        <Link key={i.href} href={i.href} className={active === i.href ? "on" : ""}>
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
