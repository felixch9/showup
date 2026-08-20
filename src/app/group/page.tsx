"use client";

import { useState } from "react";

export default function Group() {
  const [link] = useState("showup://group/SU-HOUSE");
  const [items, setItems] = useState(["Driveway wash — you"]);
  return (
    <main className="wrap py-10 max-w-lg">
      <h1 className="text-4xl">Group job</h1>
      <p className="mt-2 text-[var(--muted)]">
        Roommates add their own services to one cart. Guests do not need an account. Public DoorDash group-order pattern.
      </p>
      <p className="card p-4 mt-6 font-mono text-sm">{link}</p>
      <ul className="mt-4 space-y-2">
        {items.map((i) => (
          <li key={i} className="card p-3">{i}</li>
        ))}
      </ul>
      <button
        className="btn btn-ink mt-4"
        type="button"
        onClick={() => setItems([...items, "Lawn · guest"])}
      >
        Add as guest
      </button>
    </main>
  );
}
