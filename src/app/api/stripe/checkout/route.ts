import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.json();
  const jobId = String(body.jobId || "");
  const amount = Math.max(25, Math.round(Number(body.amount) || 25));
  const origin = new URL(req.url).origin;

  if (!process.env.STRIPE_SECRET_KEY || process.env.NEXT_PUBLIC_SHOWUP_LIVE !== "true") {
    return NextResponse.json({
      demo: true,
      url: `${origin}/track/${jobId}?paid=demo`,
    });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${origin}/track/${jobId}?paid=1`,
    cancel_url: `${origin}/book?canceled=1`,
    metadata: { jobId },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(amount * 100),
          product_data: { name: `SHOWUP deposit ${jobId}` },
        },
      },
    ],
  });
  return NextResponse.json({ url: session.url, demo: false });
}
