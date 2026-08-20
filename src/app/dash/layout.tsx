"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/Shell";
import { ModeBanner } from "@/components/ModeBanner";
import { getIdentity } from "@/lib/store";
import { useEffect, useState } from "react";

export default function DashLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const apply = path.startsWith("/dash/apply");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setOk(getIdentity().status === "approved");
  }, [path]);

  return (
    <div className="min-h-full bg-[#10150f] text-paper flex flex-col">
      <ModeBanner />
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <Link href={ok ? "/dash" : "/dash/apply"} className="display font-bold text-lg">
          SHOWUP <span className="text-acid">Crew</span>
        </Link>
        <Link href="/" className="text-xs opacity-60">
          Customer app
        </Link>
      </header>
      <div className="flex-1">{children}</div>
      {!apply ? (
        <BottomNav
          active={path}
          items={[
            { href: ok ? "/dash" : "/dash/apply", label: "Home" },
            { href: "/dash/offers", label: "Offers" },
            { href: "/dash/earnings", label: "Pay" },
            { href: "/dash/ratings", label: "Ratings" },
            { href: "/dash/account", label: "Account" },
          ]}
        />
      ) : null}
    </div>
  );
}
