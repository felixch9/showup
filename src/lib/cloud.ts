import { supabase } from "./supabase";
import type { IdentityApp, Job, Offer } from "./types";

export async function cloudUpsertJob(job: Job) {
  const sb = supabase();
  if (!sb) return;
  await sb.from("jobs").upsert({
    id: job.id,
    payload: job,
    status: job.status,
    market: job.market,
    crew_id: job.crewId,
    updated_at: new Date().toISOString(),
  });
}

export async function cloudLoadJobs(): Promise<Job[]> {
  const sb = supabase();
  if (!sb) return [];
  const { data } = await sb.from("jobs").select("payload").order("updated_at", { ascending: false }).limit(50);
  return (data ?? []).map((r) => r.payload as Job);
}

export async function cloudUpsertOffer(offer: Offer) {
  const sb = supabase();
  if (!sb) return;
  await sb.from("offers").upsert({
    id: offer.id,
    payload: offer,
    job_id: offer.jobId ?? null,
    expires_at: new Date(offer.expires).toISOString(),
  });
}

export async function cloudLoadOffers(): Promise<Offer[]> {
  const sb = supabase();
  if (!sb) return [];
  const { data } = await sb.from("offers").select("payload").limit(50);
  return (data ?? []).map((r) => r.payload as Offer);
}

export async function cloudUpsertIdentity(app: IdentityApp) {
  const sb = supabase();
  if (!sb) return;
  await sb.from("identity_apps").upsert({
    email: app.email,
    payload: {
      ...app,
      idFront: app.idFront ? "uploaded" : "",
      idBack: app.idBack ? "uploaded" : "",
      selfie: app.selfie ? "uploaded" : "",
      insurance: app.insurance ? "uploaded" : "",
      registration: app.registration ? "uploaded" : "",
    },
    background_status: app.backgroundStatus,
    identity_status: app.identityStatus,
    stripe_account_id: app.stripeAccountId,
  });
}

export async function uploadPhoto(path: string, file: Blob) {
  const sb = supabase();
  if (!sb) return null;
  const { error } = await sb.storage.from("job-photos").upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" });
  if (error) return null;
  const { data } = sb.storage.from("job-photos").getPublicUrl(path);
  return data.publicUrl;
}
