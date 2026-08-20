"use client";

export default function Payouts() {
  return (
    <main className="px-4 py-5 pb-24">
      <h1 className="text-3xl">Payouts</h1>
      <p className="text-5xl font-bold mt-4">$1,284.40</p>
      <p className="text-sm text-[var(--muted)]">This week · deposit Tuesday</p>
      <ul className="mt-6 space-y-2 text-sm">
        <li className="flex justify-between"><span>Jobs</span><b>$1,610.00</b></li>
        <li className="flex justify-between"><span>ShowUp fee 15%</span><b>-$241.50</b></li>
        <li className="flex justify-between"><span>Promos we fund</span><b>-$84.10</b></li>
      </ul>
    </main>
  );
}
