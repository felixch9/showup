# SHOWUP

Nationwide home-services marketplace. DoorDash / Uber Eats product shape — lawn, pressure wash, gutters, handyman — not food.

Three apps:

- **Customer** `/` `/c/[city]` `/book` `/track` `/orders` `/pass` `/gift` `/group`
- **Crew** `/dash/apply` (identity) `/dash` `/dash/offers` `/dash/earnings` `/dash/ratings`
- **Business** `/merchant` tablet, menu, hours, promos, payouts

Identity signup follows public Dasher / Uber courier docs: ZIP + 2FA, legal name, 18+, SSN flag (no number stored), vehicle, insurance, gov ID + selfie match, FCRA + MVR consent, W-9/payout, safety quiz, then a sandbox screening pipeline. Files never leave the browser.

Not affiliated with DoorDash or Uber.

```bash
cd C:\Users\felix\showup
npm run dev
```
