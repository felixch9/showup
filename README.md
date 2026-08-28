# SHOWUP

This is a Next.js prototype of a home-services marketplace (customer / crew / merchant). Persistence is browser localStorage. Job progress is a demo clock. Not production payments or a production database.

**Live demo:** [https://showup-wheat.vercel.app](https://showup-wheat.vercel.app)

The yellow **DEMO MODE** banner stays on. That is the honest label.

Lawn, pressure wash, gutters, yard work — not food. Not affiliated with DoorDash or Uber.

## What is real vs demo

**Real (code you can read):**

- Instant quote from [`src/lib/spec.ts`](src/lib/spec.ts) + `src/lib/quote-engine.ts`
- `crewCanTake()` in `src/lib/capabilities.ts` — a push-mower crew does not get a half-acre 18" job

Quote formula:

```
subtotal = base + size + condition + extras + ASAP
fee      = ShowPass ? 0 : max($3.99, 9% of subtotal)
total    = subtotal + fee + tip − promo
deposit  = max($25, 20% of total)
platform = 15% of subtotal + fee
crew     = total − platform   (tips 100% to crew)
```

18"+ grass and 3-story wash go to manual review. No fake locked price.

**Demo (do not read this as a live marketplace):**

- City crew counts are seeded numbers
- Job tracking advances on a timer (`stateFromElapsed` in `src/lib/job-machine.ts`)
- Bookings live in the browser (`localStorage`)
- Stripe and Checkr are gated. No live charges. No real background checks. No real CRA.

## Surfaces

- **Customer** `/` `/c/[city]` `/book` `/track` `/orders` `/pass` `/gift` `/group`
- **Crew** `/dash/apply` `/dash` `/dash/offers` `/dash/earnings` `/dash/ratings`
- **Merchant** `/merchant`

## Stack

From `package.json`: Next.js 16, React 19, TypeScript, Tailwind 4, Supabase JS, Stripe, Capacitor 8.

## Run

```bash
npm install
npm run dev
```

No keys required for the demo. Optional placeholders are in [`.env.example`](.env.example). Leave `NEXT_PUBLIC_SHOWUP_LIVE` unset or `false` so the banner stays on.

## Docs

- [`docs/CTO.md`](docs/CTO.md) — product notes, architecture, what not to rebuild
- [`src/lib/spec.ts`](src/lib/spec.ts) — service spec engine

## License

MIT · Felix R. Collazo Helgeson / [felixch9](https://github.com/felixch9)
