"use client";

import { useState } from "react";
import Link from "next/link";

export default function IdCheck() {
  const [file, setFile] = useState("");
  const [done, setDone] = useState(false);

  return (
    <main className="px-4 py-8 pb-24 max-w-md mx-auto">
      <h1 className="text-3xl">Confirm it&apos;s you</h1>
      <p className="mt-2 text-sm text-white/60">
        Uber and DoorDash randomly ask for a selfie between jobs so accounts are not shared. This is a sandbox match against the profile photo on this phone.
      </p>
      <label className="id-slot mt-6 !text-ink">
        Take selfie
        <input
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0]?.name ?? "")}
        />
        <span className="text-xs">{file || "Camera"}</span>
      </label>
      <button
        className="btn btn-acid w-full mt-4"
        disabled={!file}
        type="button"
        onClick={() => setDone(true)}
      >
        Match
      </button>
      {done ? (
        <p className="mt-4 text-acid">
          98% match · you can keep working.{" "}
          <Link className="underline" href="/dash">
            Home
          </Link>
        </p>
      ) : null}
    </main>
  );
}
