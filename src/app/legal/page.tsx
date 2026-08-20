export default function Legal() {
  return (
    <main className="wrap py-10 max-w-2xl prose">
      <h1 className="text-4xl">Legal · sandbox</h1>
      <p className="mt-4 text-[var(--muted)]">
        ShowUp is not affiliated with DoorDash, Uber, Uber Eats, or Checkr. Product flows follow publicly documented marketplace patterns (consumer app, courier identity, merchant portal).
      </p>
      <h2 className="text-2xl mt-8">Identity & FCRA</h2>
      <p className="mt-2">
        Production will use a licensed consumer reporting agency for SSN trace, criminal history (where permitted, typically 7 years), sex-offender registry, and MVR for drivers. This website is a sandbox: it does not transmit Social Security numbers, ID images, or biometric templates to a server. File inputs stay in the browser.
      </p>
      <h2 className="text-2xl mt-8">Payments</h2>
      <p className="mt-2">Deposits, ShowPass, and instant pay are simulated until Stripe / ATH Móvil are connected.</p>
      <h2 className="text-2xl mt-8">Independent contractors</h2>
      <p className="mt-2">Crews are 1099 contractors. Customers contract through the platform. Insurance COI required before live jobs in a real city.</p>
    </main>
  );
}
