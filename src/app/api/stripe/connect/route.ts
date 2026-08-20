import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  if (!process.env.STRIPE_SECRET_KEY || process.env.NEXT_PUBLIC_SHOWUP_LIVE !== "true") {
    return NextResponse.json({
      demo: true,
      accountId: `acct_demo_${Date.now().toString().slice(-6)}`,
      url: "/dash",
    });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const account = await stripe.accounts.create({ type: "express" });
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://showup-wheat.vercel.app";
  const link = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${origin}/dash/apply`,
    return_url: `${origin}/dash`,
    type: "account_onboarding",
  });
  return NextResponse.json({ demo: false, accountId: account.id, url: link.url });
}
