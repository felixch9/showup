export default function Privacy() {
  return (
    <main className="wrap py-12 max-w-2xl space-y-4 text-sm leading-6">
      <h1 className="text-4xl">Privacy Policy</h1>
      <p className="text-[var(--muted)]">Effective August 20, 2026 · SHOWUP · Columbia, SC</p>
      <p>
        SHOWUP is a home-services marketplace. This policy describes what we collect, why, and how to delete it. The live website is{" "}
        <a href="https://showup-wheat.vercel.app">showup-wheat.vercel.app</a>.
      </p>
      <h2 className="text-2xl pt-4">What we collect</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Account: name, email, phone, saved addresses.</li>
        <li>Jobs: service answers (grass height, surfaces), photos you upload, location of the property, payment metadata.</li>
        <li>Crews: equipment profile, vehicle description, Stripe Connect account id, Checkr status (not SSN).</li>
        <li>Device: approximate location when you grant it (to match nearby crews), camera when you take job/ID photos in the app.</li>
        <li>Payments: processed by Stripe. We store payment intent / session ids, amounts, and payout status — not full card numbers.</li>
      </ul>
      <h2 className="text-2xl pt-4">What we do not collect (demo / now)</h2>
      <p>
        We do not store Social Security numbers, unencrypted ID images, or raw biometric templates on SHOWUP servers. Identity screening, when enabled, will run through Checkr&apos;s hosted flow. Until Checkr is live, ID/selfie files stay on your device or in a private storage bucket you control for the demo.
      </p>
      <h2 className="text-2xl pt-4">Why</h2>
      <p>To book jobs, match a qualified crew, take deposits, pay crews, prevent fraud, and improve safety.</p>
      <h2 className="text-2xl pt-4">Sharing</h2>
      <p>
        Assigned crew sees the job spec and customer photos. Stripe processes payments. Checkr (when enabled) processes background checks. We do not sell personal data.
      </p>
      <h2 className="text-2xl pt-4">Retention & deletion</h2>
      <p>
        Job photos are kept for the job plus a limited dispute window. Request deletion at{" "}
        <a href="/account/delete">/account/delete</a> or email privacy@showup.local. We honor deletion except records we must keep for payments, legal, or fraud.
      </p>
      <h2 className="text-2xl pt-4">Children</h2>
      <p>SHOWUP is not for children under 16. Crews must be 18+.</p>
      <h2 className="text-2xl pt-4">Contact</h2>
      <p>Columbia, SC. privacy@showup.local · support URL: https://showup-wheat.vercel.app/support</p>
    </main>
  );
}
