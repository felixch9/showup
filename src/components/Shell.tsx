"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "./Providers";

export function Shell({ children }: { children: React.ReactNode }) {
  const { d, lang, setLang } = useI18n();
  const path = usePathname();
  const dark = path === "/" || path.startsWith("/track");

  return (
    <div className="min-h-full flex flex-col">
      <header
        className={`sticky top-0 z-40 ${dark ? "bg-ink/80 text-paper" : "bg-paper/90 text-ink"} backdrop-blur-md`}
      >
        <div className="wrap flex items-center gap-3 py-3">
          <Link href="/" className="display text-xl font-bold tracking-tight">
            {d.brand}
          </Link>
          <span className="hidden sm:inline text-xs opacity-70">
            {d.city} · {d.pr}
          </span>
          <nav className="ml-auto flex items-center gap-1 text-sm font-semibold">
            <Link className="px-3 py-2" href="/book">
              {d.book}
            </Link>
            <Link className="px-3 py-2 hidden sm:inline" href="/pros">
              {d.pros}
            </Link>
            <Link className="px-3 py-2 hidden md:inline opacity-70" href="/ops">
              {d.ops}
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
        <div className="wrap grid gap-4 md:grid-cols-[1fr_auto]">
          <p>{d.foot}</p>
          <div className="flex gap-4">
            <Link href="/pros">{d.pros}</Link>
            <Link href="/ops">{d.ops}</Link>
            <Link href="/book">{d.book}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
