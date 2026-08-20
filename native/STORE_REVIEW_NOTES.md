# SHOWUP — App Store / Play review notes

Paste into App Store Connect → App Review Information → Notes.

SHOWUP is a **three-sided home-services marketplace** (customer, crew, merchant) for lawn, pressure washing, and gutters. First market: **Columbia, SC**.

This is **not** a Safari wrapper. The Capacitor shell loads our production web app **and** uses native device APIs that a website tab cannot:

| Native plugin | User-visible behavior |
|---|---|
| Camera | Customer lawn/job photos; crew identity selfie |
| Geolocation | “Near me” matching for Columbia crews |
| Push notifications | Job accepted / crew on the way (permission prompt on first launch) |
| Preferences | Session + last city on device |
| Splash + status bar | Branded standalone launch (`#0c100b`) |
| Hardware back (Android) | In-app history, not exit |

**How to review (demo — no real card):**

1. Open the app. Yellow **DEMO MODE** banner is expected.
2. Book lawn: https://showup-wheat.vercel.app/book?service=lawn (or in-app). Set grass 8–12″, attach 2 photos, Book.
3. Crew: `/dash/apply` — any 6-digit code. Then `/dash/offers` → Accept.
4. Track the job. Merchant tablet: `/merchant`.
5. Delete data: `/account/delete`.

**Accounts:** No login required for demo bookings. `/auth` magic link is for when Supabase is connected.

**Payments:** Stripe Checkout is implemented. **Live charges are off** (`NEXT_PUBLIC_SHOWUP_LIVE` is false). Reviewers will not be billed.

**Background checks:** UI is sandbox. Not a live FCRA product. Checkr later. We do not collect SSNs.

**Privacy / Terms / Support:**  
https://showup-wheat.vercel.app/privacy  
https://showup-wheat.vercel.app/terms  
https://showup-wheat.vercel.app/support
