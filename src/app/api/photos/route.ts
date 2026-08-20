import { NextResponse } from "next/server";
import { uploadPhoto } from "@/lib/cloud";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof Blob)) return NextResponse.json({ error: "file" }, { status: 400 });
  const name = `job/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  const url = await uploadPhoto(name, file);
  if (!url) return NextResponse.json({ demo: true, url: null });
  return NextResponse.json({ url, demo: false });
}
