export default function Legal() {
  return (
    <main className="wrap py-10 max-w-2xl prose">
      <h1 className="text-4xl">Legal · sandbox</h1>
      <p className="mt-4 text-[var(--muted)]">
        ShowUp is not affiliated with DoorDash, Uber, Uber Eats, or Checkr. Product flows follow publicly documented marketplace patterns (consumer app, courier identity, merchant portal).
      </p>
      <h2 className="text-2xl mt-8">Identity & FCRA</h2>
      <p className="mt-2">
        Production uses a Checkr-hosted candidate flow for disclosures, SSN, and consent. SHOWUP stores <code>background_check_status</code> and <code>identity_status</code> — not raw SSNs or ID images. This sandbox never uploads those.
      </p>
      <h2 className="text-2xl mt-8">Payments (Stripe Connect)</h2>
      <p className="mt-2">
        Customer charge → SHOWUP platform fee → crew connected account. Connect Express onboarding holds KYC. Instant/weekly payouts are Connect payouts. Demo does not move money.
      </p>
      <h2 className="text-2xl mt-8">Independent contractors</h2>
      <p className="mt-2">Crews are 1099 contractors. Customers contract through the platform. Insurance COI required before live jobs in a real city.</p>
    </main>
  );
}
