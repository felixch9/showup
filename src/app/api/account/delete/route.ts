import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST() {
  const sb = supabase();
  if (sb) {
    await sb.from("deletion_requests").insert({ email: "device" });
  }
  return NextResponse.json({ ok: true, cloud: Boolean(sb) });
}
