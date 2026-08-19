import { COLUMBIA_ZIPS, serviceById } from "./catalog";

export function inColumbia(zip: string) {
  const z = zip.replace(/\D/g, "").slice(0, 5);
  return COLUMBIA_ZIPS.has(z);
}

export function quotePrice(serviceId: string, size: string) {
  const s = serviceById(serviceId);
  if (!s) return 0;
  return s.prices[size] ?? 0;
}

export function depositOf(price: number) {
  if (price <= 0) return 0;
  return Math.max(25, Math.round(price * 0.2));
}

export function jobId() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `SU-${n}`;
}

export function leadId() {
  const n = Math.floor(100 + Math.random() * 900);
  return `L-${n}`;
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}
