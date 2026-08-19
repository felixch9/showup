"use client";

import { useState } from "react";
import { useI18n } from "@/components/Providers";

export default function Waitlist() {
  const { d } = useI18n();
  const [ok, setOk] = useState(false);

  return (
    <main className="wrap py-16 max-w-xl">
      <h1 className="text-5xl">{d.prTitle}</h1>
      <p className="mt-4 text-[var(--muted)]">{d.prBody}</p>
      {ok ? (
        <p className="mt-8 card p-5">Saved on this phone. When WhatsApp + ATH Móvil are live, we use this list first.</p>
      ) : (
        <form
          className="mt-8 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setOk(true);
          }}
        >
          <label>
            {d.name}
            <input required name="name" />
          </label>
          <label>
            {d.email}
            <input required name="contact" placeholder="WhatsApp or email" />
          </label>
          <label>
            City
            <input required defaultValue="San Juan" />
          </label>
          <button className="btn btn-acid" type="submit">{d.waitlist}</button>
        </form>
      )}
    </main>
  );
}
