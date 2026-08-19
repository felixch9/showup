# SHOWUP

Home services you can see coming. Columbia, SC first. Puerto Rico second.

This is the live product:

- Homeowners book lawn / pressure wash / gutters with a **locked price** and a **live truck pin**
- Crews get a booking page instead of a Facebook flyer
- Ops (`/ops`) is the agent desk: paste a public listing, Grok writes the demo + 20-second call script, **you** make the call

It does **not** scrape Facebook, auto-DM, or auto-text. That is how you get banned and fined.

## Run

```bash
cd C:\Users\felix\showup
npm run dev
```

Open http://localhost:3000

`.env.local` needs `XAI_API_KEY` for Grok demos. Without it, the agent still returns a template demo.

## Routes

| Path | Who |
|---|---|
| `/` | Homeowners |
| `/book` | Lock a job |
| `/track/[id]` | Watch the crew |
| `/shop/[slug]` | Crew or generated demo site |
| `/pros` | Contractors join + generate demo |
| `/ops` | You. Pipeline. Review. Ship. |
| `/waitlist` | Puerto Rico |

## Money later

Stripe is not connected. Bookings and demos persist in the browser so you can pitch today. When a card key exists, deposit checkout plugs into `/book`.
