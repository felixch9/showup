"use client";

import { useState } from "react";

export default function Gift() {
  const [sent, setSent] = useState(false);
  return (
    <main className="wrap py-10 max-w-lg">
      <h1 className="text-4xl">Gift cards</h1>
      <p className="mt-2 text-[var(--muted)]">Send a neighbor a driveway wash. DoorDash gift-card pattern.</p>
      {sent ? (
        <p className="card p-5 mt-6">Demo gift queued. No money moved.</p>
      ) : (
        <form className="mt-6 grid gap-3" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <label>To email<input required type="email" /></label>
          <label>
            Amount
            <select defaultValue="50">
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </label>
          <label>Note<textarea rows={3} /></label>
          <button className="btn btn-acid" type="submit">Send gift</button>
        </form>
      )}
    </main>
  );
}
