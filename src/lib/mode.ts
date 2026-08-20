/** Demo until SHOWUP_LIVE=true AND Stripe + Supabase keys exist. */
export function isLive() {
  return process.env.NEXT_PUBLIC_SHOWUP_LIVE === "true";
}

export function hasSupabase() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function hasStripe() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

export function liveCity() {
  return process.env.NEXT_PUBLIC_LIVE_CITY || "columbia-sc";
}
