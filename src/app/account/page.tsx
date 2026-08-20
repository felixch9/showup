"use client";

import { useEffect, useState } from "react";
import { defaultAccount, getAccount, setAccount } from "@/lib/store";
import type { Account } from "@/lib/types";
import { BottomNav } from "@/components/Shell";
import Link from "next/link";

export default function AccountPage() {
  const [a, setA] = useState<Account>(defaultAccount());
  useEffect(() => setA(getAccount()), []);
  function save() {
    setAccount(a);
  }
  return (
    <main className="wrap py-10 pb-24 max-w-lg">
      <h1 className="text-4xl">Account</h1>
      <div className="mt-6 grid gap-3">
        <label>Name<input value={a.name} onChange={(e) => setA({ ...a, name: e.target.value })} /></label>
        <label>Email<input value={a.email} onChange={(e) => setA({ ...a, email: e.target.value })} /></label>
        <label>Phone<input value={a.phone} onChange={(e) => setA({ ...a, phone: e.target.value })} /></label>
        <label>
          Saved address
          <input
            value={a.addresses[0]?.line ?? ""}
            onChange={(e) => setA({ ...a, addresses: [{ label: "Home", line: e.target.value, zip: a.addresses[0]?.zip ?? "" }] })}
          />
        </label>
        <p className="text-sm">Payment · {a.payments[0]?.brand} ••{a.payments[0]?.last4}</p>
        <button className="btn btn-ink" type="button" onClick={save}>Save</button>
        <Link href="/pass">ShowPass {a.pass ? "active" : "get $0 fees"}</Link>
        <Link href="/gift">Gift cards</Link>
        <Link href="/group">Group order</Link>
        <Link href="/dash/apply">Also drive · merge accounts (DoorDash does this)</Link>
      </div>
      <BottomNav
        active="/account"
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
