"use client";

import { useState } from "react";

export default function DeleteAccount() {
  const [ok, setOk] = useState(false);
  return (
    <main className="wrap py-12 max-w-lg">
      <h1 className="text-4xl">Delete my data</h1>
      <p className="mt-3 text-[var(--muted)]">
        Required for App Store / Play and privacy law. This clears SHOWUP data on this device and files a deletion request when the cloud is connected.
      </p>
      {ok ? (
        <p className="card p-5 mt-6">Local SHOWUP keys cleared. Cloud deletion is queued when Supabase is configured.</p>
      ) : (
        <button
          className="btn btn-ink mt-6"
          type="button"
          onClick={() => {
            Object.keys(localStorage)
              .filter((k) => k.startsWith("showup."))
              .forEach((k) => localStorage.removeItem(k));
            fetch("/api/account/delete", { method: "POST" }).catch(() => {});
            setOk(true);
          }}
        >
          Delete my SHOWUP data
        </button>
      )}
    </main>
  );
}
