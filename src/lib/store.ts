import type { Job, Lang, Lead, Shop } from "./types";
import { SEED_LEADS } from "./catalog";

const K = {
  jobs: "showup.jobs",
  leads: "showup.leads",
  shops: "showup.shops",
  lang: "showup.lang",
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
  if (t < 0.12) return { status: "booked" as const, pct: Math.max(4, t * 100) };
  if (t < 0.55) return { status: "enroute" as const, pct: t * 100 };
  if (t < 0.92) return { status: "onsite" as const, pct: t * 100 };
  return { status: "done" as const, pct: 100 };
}
