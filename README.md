# SHOWUP

https://showup-wheat.vercel.app

Next.js marketplace prototype for outdoor home jobs (lawn, wash, gutters) with customer, crew, and business screens. Built by Felix R. Collazo Helgeson ([felixch9](https://github.com/felixch9)). Columbia, SC. CompTIA Security+ ce.

**Honesty:** this is a demo, not a live marketplace. Persistence is browser `localStorage`. Job states advance on a demo clock (`src/lib/job-machine.ts`). Stripe and Supabase are gated behind env flags and unused unless you turn them on. No production money. No production database. The yellow **DEMO MODE** banner on the live site is correct; leave it on.

## Stack

From `package.json`: Next.js 16, React 19, TypeScript, Tailwind CSS, Supabase JS, Stripe, Capacitor 8.

## Run

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` only if you want optional keys. The app runs without them. Keep `NEXT_PUBLIC_SHOWUP_LIVE` unset or `false` so DEMO MODE stays on.

## More

- Product notes: [`docs/CTO.md`](docs/CTO.md)
- Service spec engine: [`src/lib/spec.ts`](src/lib/spec.ts)

MIT. Not affiliated with DoorDash or Uber.
