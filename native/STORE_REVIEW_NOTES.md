# SHOWUP — App Store / Play review notes

SHOWUP is a **three-sided home-services marketplace** (customer, crew, merchant), not a website wrapper. The native shell uses Capacitor against https://showup-wheat.vercel.app **plus** these native plugins:

| Plugin | Why it is not Safari |
|---|---|
| `@capacitor/camera` | Lawn job photos and crew ID selfie from the device camera |
| `@capacitor/geolocation` | Match nearby Columbia, SC crews |
| `@capacitor/push-notifications` | Job offers and “crew on the way” (wired; server push keys follow) |
| `@capacitor/preferences` | Persist session on device |
| Splash screen + status bar | Standalone branded launch |

**Demo vs live:** Banner on every screen until `NEXT_PUBLIC_SHOWUP_LIVE=true` and Stripe keys are set. Reviewers can complete a booking without a real card.

**Account:** Test customer: use any email on `/auth` in demo. Crew apply: `/dash/apply` — any 6-digit SMS code.

**Privacy:** https://showup-wheat.vercel.app/privacy  
**Terms:** https://showup-wheat.vercel.app/terms  
**Support:** https://showup-wheat.vercel.app/support  
**Delete data:** https://showup-wheat.vercel.app/account/delete

**Background checks:** Not live. UI is sandbox. Production will use Checkr hosted; SHOWUP will not store SSNs.

**Payments:** Stripe Checkout + Connect. Test mode until live flag.

**Age:** 16+ (crews 18+).

**First market:** Columbia, SC.
