import type {
  Account,
  CrewSession,
  IdentityApp,
  Job,
  Lang,
  Lead,
  MerchantStore,
  Offer,
  Shop,
} from "./types";
import { SEED_LEADS } from "./catalog";

const K = {
  jobs: "showup.jobs",
  leads: "showup.leads",
  shops: "showup.shops",
  lang: "showup.lang",
  city: "showup.city",
  account: "showup.account",
  identity: "showup.identity",
  crew: "showup.crew",
  merchant: "showup.merchant",
  offers: "showup.offers",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLang(): Lang {
  return read<Lang>(K.lang, "en");
}

export function setLang(lang: Lang) {
  write(K.lang, lang);
}

export function getCitySlug() {
  return read<string>(K.city, "columbia-sc");
}

export function setCitySlug(slug: string) {
  write(K.city, slug);
}

export function getJobs(): Job[] {
  return read<Job[]>(K.jobs, []);
}

export function upsertJob(job: Job) {
  const all = getJobs().filter((j) => j.id !== job.id);
  all.unshift(job);
  write(K.jobs, all);
  return job;
}

export function getJob(id: string) {
  return getJobs().find((j) => j.id === id);
}

export function getLeads(): Lead[] {
  const existing = read<Lead[] | null>(K.leads, null);
  if (existing && existing.length) return existing;
  write(K.leads, SEED_LEADS);
  return SEED_LEADS;
}

export function upsertLead(lead: Lead) {
  const all = getLeads().filter((l) => l.id !== lead.id);
  all.unshift(lead);
  write(K.leads, all);
  return lead;
}

export function getShops(): Shop[] {
  return read<Shop[]>(K.shops, []);
}

export function upsertShop(shop: Shop) {
  const all = getShops().filter((s) => s.slug !== shop.slug);
  all.unshift(shop);
  write(K.shops, all);
  return shop;
}

export function getShop(slug: string) {
  return getShops().find((s) => s.slug === slug);
}

export function jobProgress(job: Job) {
  if (job.status === "done") return { status: "done" as const, pct: 100 };
  if (job.status === "canceled") return { status: "canceled" as const, pct: 0 };
  const elapsed = (Date.now() - job.createdAt) / 1000;
  const t = Math.min(1, elapsed / 420);
  if (t < 0.08) return { status: "booked" as const, pct: Math.max(4, t * 100) };
  if (t < 0.18) return { status: "confirmed" as const, pct: t * 100 };
  if (t < 0.55) return { status: "enroute" as const, pct: t * 100 };
  if (t < 0.92) return { status: "onsite" as const, pct: t * 100 };
  return { status: "done" as const, pct: 100 };
}

export function defaultAccount(): Account {
  return {
    name: "",
    email: "",
    phone: "",
    city: "columbia-sc",
    addresses: [{ label: "Home", line: "", zip: "" }],
    pass: false,
    passUntil: 0,
    payments: [{ brand: "Visa", last4: "4242" }],
  };
}

export function getAccount(): Account {
  return { ...defaultAccount(), ...read<Partial<Account>>(K.account, {}) };
}

export function setAccount(a: Account) {
  write(K.account, a);
}

export function emptyIdentity(): IdentityApp {
  return {
    step: 0,
    email: "",
    phone: "",
    zip: "",
    city: "",
    first: "",
    last: "",
    dob: "",
    last4: false,
    address: "",
    vehicle: "truck",
    year: "2018",
    make: "",
    model: "",
    plate: "",
    idFront: "",
    idBack: "",
    selfie: "",
    insurance: "",
    registration: "",
    fcra: false,
    mvr: false,
    quiz: 0,
    payout: "",
    bankLast4: "",
    status: "draft",
    matchScore: 0,
  };
}

export function getIdentity(): IdentityApp {
  return { ...emptyIdentity(), ...read<Partial<IdentityApp>>(K.identity, {}) };
}

export function setIdentity(a: IdentityApp) {
  write(K.identity, a);
}

export function getCrewSession(): CrewSession {
  return read<CrewSession>(K.crew, {
    online: false,
    tier: "gold",
    rating: 4.92,
    acceptance: 88,
    completion: 97,
    onTime: 96,
    today: 86.4,
    week: 412.2,
    tips: 64,
    jobs: 7,
  });
}

export function setCrewSession(s: CrewSession) {
  write(K.crew, s);
}

export function getMerchant(): MerchantStore {
  return read<MerchantStore>(K.merchant, {
    name: "Rivera Pressure + Lawn",
    open: true,
    prepMin: 25,
    hours: "7:00a – 6:00p",
    pausedUntil: 0,
  });
}

export function setMerchant(s: MerchantStore) {
  write(K.merchant, s);
}

export function seedOffers(): Offer[] {
  const now = Date.now();
  return [
    { id: "O-1", service: "Driveway wash", neighborhood: "Forest Acres", miles: 1.8, pay: 22, tip: 8, peak: 3, minutes: 12, expires: now + 28000 },
    { id: "O-2", service: "Lawn · small", neighborhood: "Irmo", miles: 4.1, pay: 14, tip: 5, peak: 0, minutes: 18, expires: now + 41000 },
    { id: "O-3", service: "Gutters 1-story", neighborhood: "Shandon", miles: 2.4, pay: 28, tip: 12, peak: 5, minutes: 9, expires: now + 19000 },
  ];
}

export function getOffers(): Offer[] {
  const existing = read<Offer[] | null>(K.offers, null);
  if (existing && existing.length) return existing;
  const s = seedOffers();
  write(K.offers, s);
  return s;
}

export function setOffers(o: Offer[]) {
  write(K.offers, o);
}
