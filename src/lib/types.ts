export type Lang = "en" | "es";
export type Market = "columbia" | "puerto-rico";
export type JobStatus = "booked" | "enroute" | "onsite" | "done" | "canceled";
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
  | "gutters"
  | "mulch"
  | "paint";

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
  crewId: string;
  status: JobStatus;
  lang: Lang;
  market: Market;
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
