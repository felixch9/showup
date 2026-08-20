"use client";

export default function Promo() {
  return (
    <main className="px-4 py-5 pb-24">
      <h1 className="text-3xl">Campaigns</h1>
      <p className="text-sm text-[var(--muted)] mt-2">Item discount, storewide %, or sponsored listing — merchant portal pattern.</p>
      <div className="card p-4 mt-4">
        <h2 className="text-xl">FIRST10</h2>
        <p>$10 off first job · live</p>
      </div>
      <div className="card p-4 mt-3">
        <h2 className="text-xl">Weekday lawn 15%</h2>
        <p>Mon–Thu · scheduled</p>
      </div>
      <button className="btn btn-ink mt-4" type="button">
        New campaign
      </button>
    </main>
  );
}
