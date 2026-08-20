"use client";

import Link from "next/link";
import { getIdentity } from "@/lib/store";
import { useEffect, useState } from "react";

export default function DashAccount() {
  const [email, setEmail] = useState("");
  useEffect(() => setEmail(getIdentity().email), []);
  return (
    <main className="px-4 py-5 pb-24 grid gap-3">
      <h1 className="text-3xl">Account</h1>
      <p className="text-sm opacity-60">{email}</p>
      <Link className="rounded-2xl bg-white/5 p-4" href="/dash/apply">Documents hub</Link>
      <Link className="rounded-2xl bg-white/5 p-4" href="/dash/id-check">Live ID selfie</Link>
      <Link className="rounded-2xl bg-white/5 p-4" href="/support">VIP support (Platinum)</Link>
      <Link className="rounded-2xl bg-white/5 p-4" href="/legal">Background check FAQ</Link>
    </main>
  );
}
