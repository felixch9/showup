export default function Terms() {
  return (
    <main className="wrap py-12 max-w-2xl space-y-4 text-sm leading-6">
      <h1 className="text-4xl">Terms of Service</h1>
      <p className="text-[var(--muted)]">Effective August 20, 2026</p>
      <p>
        SHOWUP connects customers with independent crews for lawn, pressure washing, gutters, and similar jobs. Crews are 1099 contractors, not employees.
      </p>
      <h2 className="text-2xl pt-4">Demo vs live</h2>
      <p>
        Until you see a live-mode confirmation and a real Stripe charge, bookings are demo: no money moves, no background check is completed, and jobs may exist only on your device plus our staging database.
      </p>
      <h2 className="text-2xl pt-4">Customers</h2>
      <p>
        Quotes are estimates locked from the spec you submit. Photos must fairly represent the job. Deposits authorize payment. Remaining balance is due when after-photos land. Tips go 100% to the crew.
      </p>
      <h2 className="text-2xl pt-4">Crews / merchants</h2>
      <p>
        You must be 18+, legally allowed to work, and carry insurance before live jobs. You only receive offers your equipment can do. SHOWUP takes a platform fee (about 15% of the service subtotal plus the customer service fee unless waived by ShowPass).
      </p>
      <h2 className="text-2xl pt-4">Prohibited</h2>
      <p>No off-platform cash to dodge fees. No fake photos. No licensed electrical/plumbing/structural work on SHOWUP v1.</p>
      <h2 className="text-2xl pt-4">Limitation</h2>
      <p>SHOWUP is a marketplace. We do not perform the physical work. Liability for property damage sits with the crew&apos;s insurance once live.</p>
      <p>
        Privacy: <a href="/privacy">/privacy</a>
      </p>
    </main>
  );
}
