import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const raw = await req.text();
  const sb = supabase();
  if (sb) {
    await sb.from("payments").upsert({
      id: `wh_${Date.now()}`,
      status: "received",
      stripe_session_id: "see-logs",
      live: process.env.NEXT_PUBLIC_SHOWUP_LIVE === "true",
    });
  }
  return NextResponse.json({ received: true, bytes: raw.length });
}
