# SHOWUP — TPM / CTO pack

**Product:** DoorDash-shaped marketplace for home services (lawn, pressure wash, gutters, yard, junk). Not food. Not a DoorDash clone brand.

**Repo:** `C:\Users\felix\showup` · [github.com/felixch9/showup](https://github.com/felixch9/showup)

**Current stage:** High-fidelity **web prototype**. Three surfaces (customer, crew, business) + service spec engine + instant quote + identity *sandbox*. Persistence is **browser localStorage**. No real money, no real CRA, no production DB.

If this is the wrong company, say one sentence. Everything below assumes SHOWUP.

---

## 1. Company call

| | |
|---|---|
| **Job to be done** | Homeowner gets a locked-price outdoor job done by a *qualified* nearby crew they can see coming, with before/after proof. |
| **Wedge** | Columbia, SC lawn + pressure wash. Density before geography. PR (WhatsApp + ATH Móvil) after 50 completed jobs. |
| **Moat to earn** | Job-condition modifiers (grass height, siding type, photos) + crew *capability matching*. Food apps cannot copy this. |
| **Who pays** | Homeowner (job + fee + tip). Platform take ~15% + service fee. ShowPass $9.99/mo waives fee. Crews: 1099. |
| **What we are not** | Angi lead spam. Facebook scraper. Thumbtack bid board. Food delivery. |

**North-star metric (90 days):** completed jobs / week in Columbia with photo proof and a paid deposit.

---

## 2. What already exists (do not rebuild)

Prototype routes that must *evolve*, not be thrown away:

| Surface | Routes | Reality |
|---|---|---|
| Customer | `/` cities, `/c/[city]`, `/book` spec engine, `/track/[id]` state machine, `/orders`, `/pass`, `/gift`, `/group` | Instant quote from `src/lib/spec.ts` + `quote-engine.ts`. Photos compressed in-browser. |
| Crew | `/dash/apply`, `/dash`, `/dash/offers`, `/dash/job/[id]`, `/dash/earnings`, `/dash/ratings`, `/dash/id-check` | Checkr/Stripe *copy* only. Equipment tags. Offer ticket: customer pays / platform / you earn. |
| Business | `/merchant` tablet, menu, hours, promo, payouts | Pause store, confirm job. |
| Ops | `/ops`, `/pros`, `/api/agent` | Grok demo sites; human-in-loop outreach. |
| Specs | lawn, wash, gutters, cleanup, leaf, hedge, mulch, junk, handyman, paint | New service = new object in `SPECS`, not a new app. |

**Hard rule:** keep the spec engine. Next work is *productionizing around it*.

---

## 3. User flows (v1 production)

### 3.1 Customer

```
Open city → pick service → property (address/ZIP)
  → spec questions (condition, add-ons, photos)
  → instant quote (or "manual review")
  → authorize payment (Stripe)
  → SEARCHING_FOR_CREW
  → accepted → preparing → en_route → arrived
  → before photos → in progress → after photos
  → confirm / dispute window
  → capture remaining balance + tip
  → rate
```

Friendly copy already in `src/lib/job-machine.ts`. Do not invent a second state machine.

**Quote formula (lock this):**

```
subtotal = base + size + condition + extras + ASAP
fee      = ShowPass ? 0 : max($3.99, 9% of subtotal)
total    = subtotal + fee + tip − promo
deposit  = max($25, 20% of total) authorized up front
platform = 15% of subtotal + fee
crew     = total − platform   (tips 100% to crew)
```

18"+ grass and 3-story wash: `manualReview: true` — no fake lock.

### 3.2 Crew

```
ZIP + phone 2FA
  → legal name, DOB 18+
  → Checkr-hosted candidate (SSN never hits SHOWUP DB)
  → Stripe Connect Express (acct_xxx only)
  → vehicle + insurance docs in Connect/Checkr, not our disk
  → equipment + max stories + services (capability profile)
  → safety quiz
  → background_check_status=cleared AND identity_status=verified
  → go live on heatmap
  → offer (spec bullets + photos + YOU EARN)
  → accept / decline (acceptance rate)
  → nav → arrived → before/after photos
  → random selfie match
  → payout (instant or weekly via Connect)
```

### 3.3 Business (merchant)

```
Stripe Connect + EIN via Connect
  → service menu from SPECS
  → hours / prep / pause
  → incoming tickets
  → confirm or add time
  → payouts dashboard
```

Independent one-person crew = *both* crew app and a thin store. Do not force two logins forever; merge accounts like DoorDash consumer↔Dasher.

---

## 4. Target architecture

```
                    ┌─────────────┐
   Next.js App      │  Vercel     │
   (App Router)     │  + cron     │
                    └──────┬──────┘
           ┌───────────────┼────────────────┐
           ▼               ▼                ▼
     Postgres+PostGIS   Redis/KV        S3/R2 photos
     (Neon or Supabase) (offers,        (never localStorage)
                         locations)
           │
           ├─ Stripe Connect (customers + crews + merchants)
           ├─ Checkr (hosted candidate)
           ├─ Twilio SMS (2FA, “on the way”)  [PR: WhatsApp Cloud later]
           ├─ Mapbox or Google Routes (ETA)
           └─ SpaceXAI / xAI  (Grok 4.6 + vision on job photos)
                    api.x.ai · XAI_API_KEY server-side only
```

**Realtime:** job events + crew location via **Supabase Realtime** or **Ably**. Do not poll localStorage in production.

**Matching:** Postgres query: service + equipment ⊇ needs + max_stories + ST_DWithin(crew, property, radius) + online + not busy. Rank by ETA, rating, tier.

**AI (SpaceXAI, not OpenAI):**

| Job | Model | Rule |
|---|---|---|
| Photo assist (overgrowth, surfaces, debris) | `grok-4.6` vision | **Assist only.** Never sole price. |
| Demo storefront copy (`/api/agent`) | `grok-4.6` | Keep. |
| Support summaries | `grok-4.6` | Human send. |
| Crew marketing images | `grok-imagine-image-2.0` | Optional. |

SDK for Next: `ai` + `@ai-sdk/xai` (`xai.responses('grok-4.6')`) or `openai` client with `baseURL: https://api.x.ai/v1`. Key never in the browser.

---

## 5. Tech stack (freeze for v1)

| Layer | Choice | Why |
|---|---|---|
| App | **Next.js 16 App Router + TypeScript** (already) | One codebase for customer/crew/merchant web. Native apps later via the same APIs. |
| UI | Tailwind 4 + existing SHOWUP tokens | Do not restyle from scratch. |
| DB | **Postgres** (Neon) + **Drizzle ORM** | Relational marketplace; PostGIS later for radius. |
| Auth | **Clerk** or **Supabase Auth** | Phone OTP. Crew vs customer roles. |
| Payments | **Stripe Connect Express** + PaymentIntents | Destination charges; application_fee_amount; Connect onboarding KYC. |
| Identity | **Checkr hosted** | FCRA, SSN, MVR. We store status + report id. |
| Photos | **Cloudflare R2** or S3 + signed URLs | Client compress then upload. |
| SMS | Twilio US; WhatsApp Cloud API for PR phase 2 | TCPA: transactional job texts only with booking consent. |
| Maps | Mapbox GL | Heatmap + nav deep-link to Google/Apple Maps on phone. |
| AI | **SpaceXAI / xAI Grok 4.6** | `/build-with-ai` default. |
| Hosting | Vercel | Project already linked; production deploy needs Felix’s Vercel role. |
| Observability | Sentry + Vercel analytics | Job funnel events. |
| Email | Resend | Receipts, FCRA adverse-action *only if we ever become the CRA customer-of-record — prefer Checkr sends that.* |

**Explicit non-goals v1:** native iOS/Android (PWA + “Add to Home Screen” first), ATH Móvil, Facebook scrape, bidding marketplace, electric/plumbing/licensed trades.

---

## 6. Data model (v1 tables)

Do not add 200 tables. This is the freeze list:

```
users                    id, role (customer|crew|merchant|admin), phone, email
properties               user_id, line, zip, lat, lng, notes
crews                    user_id, stripe_account_id, checkr_id,
                         background_status, identity_status, max_stories, online, last_lng, last_lat
crew_equipment           crew_id, equipment_id
crew_services            crew_id, service_id
crew_areas               crew_id, city_slug, polygon? (city slug enough at start)

service_definitions      id, json spec (or normalized questions)
service_options          …

bookings                 property_id, service_id, answers jsonb, photos[],
                         quote jsonb, machine_state, stripe_pi
job_offers               booking_id, crew_id, you_earn, expires_at, status
jobs                     booking_id, crew_id, machine_state, timestamps
job_events               job_id, state, at, actor
job_photos               job_id, kind (customer|before|after), r2_key

payments                 stripe_pi, amount, fee, application_fee
payouts                  stripe_transfer_id, crew_id, amount
reviews                  job_id, stars, tags

provider_availability    crew_id, window
```

`answers jsonb` is the spec-engine payload. Do not explode grass height into 40 columns.

---

## 7. Engineering specs for developers

### Epic A — Persistence (blocks everything)

**A1** Neon + Drizzle + migrate spec/catalog/crews off localStorage.  
**A2** Auth (phone). Session on all three apps.  
**A3** Photo upload to R2; booking stores keys not data URLs.  
**A4** Job state machine server-side; client is a subscriber.  
**Acceptance:** book on phone A, track on phone B, offer appears on crew C.

### Epic B — Money

**B1** Stripe Checkout/PaymentIntent for deposit.  
**B2** Connect Express for crew (`acct_`).  
**B3** On `completed`+customer confirm: capture remainder, transfer crew share.  
**B4** ShowPass as Stripe Subscription.  
**Acceptance:** test clocks, destination charge, application fee visible in Stripe.

### Epic C — Trust

**C1** Checkr hosted invite; webhook → `background_status`. No SSN column.  
**C2** Capability match query uses equipment + stories.  
**C3** Random selfie: vendor or Grok vision match against profile photo; store score not biometrics long-term (legal review).  
**Acceptance:** uncleared crew cannot go live; push-mower crew never sees 18" half-acre offer.

### Epic D — Live ops

**D1** Offer fanout: top N matching online crews, 45s TTL, first accept wins.  
**D2** Location ping while `enroute`/`in_progress` (opt-in, job-scoped).  
**D3** Customer track page from server events.  

### Epic E — AI assist (SpaceXAI)

**E1** POST `/api/vision/job` with 2–4 photos → `{ grass_band, surfaces[], debris, confidence }`. Prefills spec; user can override.  
**E2** Keep `/api/agent` on `grok-4.6` via `https://api.x.ai/v1`.  
**Acceptance:** quote never changes *only* because the model spoke.

### Epic F — Columbia launch slice

**F1** Service area = Columbia ZIP set (already in catalog).  
**F2** Ops desk: real crews onboarded by Felix, not scraped FB.  
**F3** Legal pages reviewed (independent contractor, photography, TCPA).  

**PR size:** one epic slice per PR. Spec engine changes are data PRs.

---

## 8. Launch plan

### Now (week 0) — already true

- Prototype on `localhost:3450` / LAN.
- Spec engine + quote + capabilities + lifecycle copy.
- Do **not** take real SSNs. Do **not** auto-text. Do **not** scrape Facebook.

### Days 1–14 — “money and memory”

- Epic A + B in test mode.
- 3 real Columbia crews (Luis-class) onboarded **in person** with Connect + Checkr test.
- 10 friends-and-family lawn jobs at locked prototype prices.
- Kill any flow that still writes PII to localStorage.

### Days 15–45 — “Columbia closed beta”

- Live ZIPs only.
- Facebook/Nextdoor **ads to homeowners** (SHOWUP books the job). Path A from original strategy.
- Crew supply: overflow to onboarded kits only.
- Support: Felix + `/ops`. SLA: 15 min on live jobs.
- Success: 20 completed jobs, <10% cancel, 4.6+ rating.

### Days 46–90 — “repeatable city”

- ShowPass on.
- Charlotte or Irmo/Lexington expansion only if Columbia jobs/week ≥ 40.
- PR waitlist stays waitlist until WhatsApp + ATH Móvil scoped (separate epic).
- Native apps: only if ≥30% of sessions are “add to home screen” pain.

### Kill criteria

- Cannot get 3 insured crews to finish Checkr, or
- Homeowners will not pay deposit, or
- Average job needs 3+ manual price fights.

Then fall back to Site Ready (storefronts) rather than a hollow marketplace.

---

## 9. Org / agents (how we work)

Treat Grok as the engineering org until you hire:

| Agent | Job |
|---|---|
| **CTO (this chat)** | Architecture, stack freeze, no-rebuild of spec engine |
| **Spec agent** | New services as `SPECS` objects + quote tests |
| **Payments agent** | Stripe Connect only |
| **Trust agent** | Checkr webhooks, no SSN schema |
| **Vision agent** | Grok 4.6 assist, override UI |
| **Ops** | Felix: call crews, ride-alongs, quality |

No Facebook login to an agent. Outreach is a script + you tap Call.

---

## 10. Compliance (non-negotiable)

- **TCPA:** no marketing SMS without written consent. Job updates are transactional after booking.
- **FCRA:** Checkr is the CRA. We don’t run DIY criminal search.
- **Stripe:** we are a marketplace; Connect, not “collect on Felix’s personal card.”
- **1099:** crews independent; COI before live jobs.
- **Photos:** customer grants license to share with assigned crew only.
- **Trademarks:** never use DoorDash/Uber marks in UI.

---

## 11. First developer ticket (copy/paste)

```
Title: A1 — Neon + Drizzle, persist bookings

Replace localStorage jobs/answers/photos with Postgres.
Keep src/lib/spec.ts and quote-engine.ts as the source of price.
Upload photos to R2; store keys.
GET/POST /api/bookings, GET /api/jobs/:id for track page.
Acceptance: two browsers, same job id, same state machine.
Do not add a second quote implementation.
```
