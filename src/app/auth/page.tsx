"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const sb = supabase();

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!sb) {
      setMsg("Demo mode: no Supabase keys. Local bookings still work on this device.");
      return;
    }
    const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    setMsg(error ? error.message : "Check your email for the SHOWUP link.");
  }

  return (
    <main className="wrap py-16 max-w-md">
      <h1 className="text-4xl">Sign in</h1>
      <p className="mt-2 text-[var(--muted)]">Magic link. Required for jobs to sync across your phone and a crew&apos;s phone.</p>
      <form className="mt-6 grid gap-3" onSubmit={send}>
        <label>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <button className="btn btn-acid" type="submit">Send link</button>
      </form>
      {msg ? <p className="mt-4 text-sm">{msg}</p> : null}
    </main>
  );
}
