"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getJobs } from "@/lib/store";
import type { Job } from "@/lib/types";
import { BottomNav } from "@/components/Shell";

export default function Orders() {
  const [jobs, setJobs] = useState<Job[]>([]);
  useEffect(() => setJobs(getJobs()), []);
  return (
    <main className="wrap py-10 pb-24">
      <h1 className="text-4xl">Orders</h1>
      <p className="text-sm text-[var(--muted)] mt-1">Reorder is one tap. Receipts live on this phone until accounts are real.</p>
      <div className="mt-6 grid gap-3">
        {jobs.length === 0 ? (
          <p className="card p-5">No orders yet. <Link className="underline" href="/book">Book one</Link>.</p>
        ) : (
          jobs.map((j) => (
            <article key={j.id} className="card p-4 flex justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase">{j.status} · {j.id}</p>
                <h2 className="text-xl">{j.service} · {j.zip}</h2>
                <p className="text-sm text-[var(--muted)]">{j.address} · ${j.price}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Link className="btn btn-ink !py-2" href={`/track/${j.id}`}>Track</Link>
                <Link className="btn btn-ghost !py-2" href={`/book?service=${j.service}`}>Reorder</Link>
              </div>
            </article>
          ))
        )}
      </div>
      <BottomNav
        active="/orders"
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
