"use client";

import { useRouter } from "next/navigation";

export default function MerchantOnboard() {
  const router = useRouter();
  return (
    <main className="px-4 py-8 pb-24 max-w-lg">
      <h1 className="text-4xl">Get on ShowUp</h1>
      <ol className="mt-6 space-y-3 text-sm">
        <li>1. Business name, EIN or SSN last-4 (sandbox)</li>
        <li>2. Service menu + photos</li>
        <li>3. Hours and service area</li>
        <li>4. Bank for payouts</li>
        <li>5. Insurance COI</li>
        <li>6. Tablet / phone as Order Manager</li>
      </ol>
      <button className="btn btn-ink mt-6" type="button" onClick={() => router.push("/merchant")}>
        Skip demo onboard
      </button>
    </main>
  );
}
