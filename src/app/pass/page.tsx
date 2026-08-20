"use client";

import { getAccount, setAccount } from "@/lib/store";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/Shell";

export default function Pass() {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(getAccount().pass), []);
  function buy() {
    const a = getAccount();
    const next = { ...a, pass: true, passUntil: Date.now() + 30 * 86400000 };
    setAccount(next);
    setOn(true);
  }
  return (
    <main className="wrap py-10 pb-24 max-w-xl">
      <p className="chip !bg-ink !text-acid w-fit">ShowPass</p>
      <h1 className="text-5xl mt-3">$0 service fees. Every job.</h1>
      <p className="mt-4 text-lg text-[var(--muted)]">
        DashPass analog: $9.99/month, cancel anytime. Priority on Platinum crews when they are free.
      </p>
      <ul className="mt-6 space-y-2">
        <li>$0 service fee on eligible jobs</li>
        <li>Up to 10% off select crews</li>
        <li>Highly rated crew preference</li>
        <li>Works in every live city including PR</li>
      </ul>
      {on ? (
        <p className="mt-6 card p-4">Active on this phone. Demo — no card charged.</p>
      ) : (
        <button className="btn btn-acid mt-6" type="button" onClick={buy}>
          Start ShowPass · $9.99
        </button>
      )}
      <BottomNav
        active="/pass"
        items={[
          { href: "/", label: "Home" },
          { href: "/book", label: "Book" },
          { href: "/orders", label: "Orders" },
          { href: "/pass", label: "Pass" },
          { href: "/account", label: "Account" },
        ]}
      />
    </main>
  );
}
