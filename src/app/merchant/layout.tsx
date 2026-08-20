"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/Shell";

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="min-h-full bg-[#f6f3ec] text-ink flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 bg-ink text-paper">
        <Link href="/merchant" className="display font-bold">
          SHOWUP <span className="text-acid">Business</span>
        </Link>
        <Link href="/" className="text-xs opacity-70">
          Customer
        </Link>
      </header>
      <div className="flex-1">{children}</div>
      <BottomNav
        active={path}
        items={[
          { href: "/merchant", label: "Orders" },
          { href: "/merchant/menu", label: "Menu" },
          { href: "/merchant/hours", label: "Hours" },
          { href: "/merchant/promo", label: "Promo" },
          { href: "/merchant/payouts", label: "Money" },
        ]}
      />
    </div>
  );
}
