import type { MachineState } from "./job-machine";

export type Lang = "en" | "es";
export type Market = string;
export type JobStatus = MachineState;
export type LeadStatus =
  | "new"
  | "mocked"
  | "scripted"
  | "called"
  | "joined"
  | "rejected";

export type ServiceId =
  | "lawn"
  | "driveway"
  | "housewash"
  | "wash"
  | "gutters"
  | "mulch"
  | "paint"
  | "handyman"
  | "hedge"
  | "leaf"
  | "junk"
  | "cleanup";

export type Service = {
  id: ServiceId;
  minutes: number;
  photo: string;
  prices: Record<string, number>;
};

export type Crew = {
  id: string;
  name: string;
  slug: string;
  trade: string;
  trades: ServiceId[];
  market: Market;
  areas: string[];
  rating: number;
  jobs: number;
  etaMin: number;
  photo: string;
  bio: string;
  bioEs: string;
  bilingual: boolean;
  tier?: "silver" | "gold" | "platinum";
  equipment?: string[];
  maxStories?: number;
};

export type Job = {
  id: string;
  createdAt: number;
  service: ServiceId;
  size: string;
  address: string;
  zip: string;
  when: string;
  name: string;
  phone: string;
  notes: string;
  price: number;
  deposit: number;
  fee: number;
  tip: number;
  promo: string;
  crewId: string;
  status: JobStatus;
  lang: Lang;
  market: Market;
  scheduled: boolean;
  contactless: boolean;
  answers?: Record<string, unknown>;
  quoteLines?: { label: string; amount: number }[];
  minutes?: number;
  providerEarn?: number;
  platformCut?: number;
  machine?: import("./job-machine").MachineState;
  needs?: string[];
};

export type Lead = {
  id: string;
  createdAt: number;
  name: string;
  trade: string;
  city: string;
  market: Market;
  phone: string;
  website: string;
  source: string;
  notes: string;
  status: LeadStatus;
  script: string;
  demoSlug: string;
};

export type Shop = {
  slug: string;
  name: string;
  trade: string;
  city: string;
  phone: string;
  headline: string;
  lede: string;
  services: { name: string; price: string }[];
  about: string;
  cta: string;
  lang: Lang;
};

export type Account = {
  name: string;
  email: string;
  phone: string;
  city: string;
  addresses: { label: string; line: string; zip: string }[];
  pass: boolean;
  passUntil: number;
  payments: { brand: string; last4: string }[];
};

export type IdentityApp = {
  step: number;
  email: string;
  phone: string;
  zip: string;
  city: string;
  first: string;
  last: string;
  dob: string;
  last4: boolean;
  checkrConsent: boolean;
  stripeAccountId: string;
  backgroundStatus: "not_started" | "pending" | "cleared" | "consider";
  identityStatus: "unverified" | "verified";
  equipment: string[];
  address: string;
  vehicle: string;
  year: string;
  make: string;
  model: string;
  plate: string;
  idFront: string;
  idBack: string;
  selfie: string;
  insurance: string;
  registration: string;
  fcra: boolean;
  mvr: boolean;
  quiz: number;
  payout: "instant" | "weekly" | "";
  bankLast4: string;
  status:
    | "draft"
    | "submitted"
    | "identity"
    | "mvr"
    | "criminal"
    | "approved"
    | "needs_review";
  matchScore: number;
};

export type CrewSession = {
  online: boolean;
  tier: "none" | "silver" | "gold" | "platinum";
  rating: number;
  acceptance: number;
  completion: number;
  onTime: number;
  today: number;
  week: number;
  tips: number;
  jobs: number;
};

export type Offer = {
  id: string;
  service: string;
  serviceId?: string;
  neighborhood: string;
  miles: number;
  pay: number;
  tip: number;
  peak: number;
  minutes: number;
  expires: number;
  customerPays?: number;
  platformFee?: number;
  youEarn?: number;
  bullets?: string[];
  jobId?: string;
};

export type MerchantStore = {
  name: string;
  open: boolean;
  prepMin: number;
  hours: string;
  pausedUntil: number;
};
