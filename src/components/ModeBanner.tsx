"use client";

export function ModeBanner() {
  const live = process.env.NEXT_PUBLIC_SHOWUP_LIVE === "true";
  if (live) return null;
  return (
    <div className="bg-acid text-ink text-center text-xs font-bold tracking-wide py-1.5 px-3">
      DEMO MODE — no real charges, no live background checks, Columbia SC is the first real market.
    </div>
  );
}
