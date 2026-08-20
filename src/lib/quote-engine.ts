import { specById, type Question, type SpecOption } from "./spec";

export type Answers = Record<string, unknown>;
export type PhotoSlot = { id: string; name: string; dataUrl: string };

export type QuoteLine = { label: string; amount: number };
export type Quote = {
  lines: QuoteLine[];
  subtotal: number;
  fee: number;
  tip: number;
  total: number;
  deposit: number;
  providerEarn: number;
  platformCut: number;
  minutes: number;
  manualReview: boolean;
  needs: string[];
};

function optsOf(q: Question) {
  return q.options ?? [];
}

function selectedOptions(q: Question, answers: Answers): SpecOption[] {
  const val = answers[q.id];
  if (q.type === "choice" || q.type === "visual_scale") {
    return optsOf(q).filter((o) => o.id === val);
  }
  if (q.type === "multi_select" || q.type === "toggle_list" || q.type === "features") {
    const ids = Array.isArray(val) ? (val as string[]) : [];
    return optsOf(q).filter((o) => ids.includes(o.id));
  }
  return [];
}

export function buildQuote(
  serviceId: string,
  answers: Answers,
  opts?: { pass?: boolean; tip?: number; promo?: string; urgency?: "asap" | "schedule" },
): Quote {
  const spec = specById(serviceId);
  const lines: QuoteLine[] = [];
  const needs = new Set<string>();
  let minutes = spec?.baseMinutes ?? 45;
  let manualReview = spec?.base === 0;
  const base = spec?.base ?? 0;
  if (spec) lines.push({ label: `${spec.name} base`, amount: base });

  for (const q of spec?.questions ?? []) {
    for (const o of selectedOptions(q, answers)) {
      if (o.priceModifier) {
        lines.push({ label: o.label, amount: o.priceModifier });
      }
      minutes += o.minutesModifier ?? 0;
      if (o.manualReview) manualReview = true;
      o.needs?.forEach((n) => needs.add(n));
    }
  }

  if (opts?.urgency === "asap") {
    lines.push({ label: "ASAP", amount: 8 });
    minutes = Math.max(20, minutes - 5);
  }

  const subtotal = Math.max(0, lines.reduce((s, l) => s + l.amount, 0));
  const promo = (opts?.promo ?? "").toUpperCase() === "FIRST10" ? Math.min(10, subtotal) : 0;
  if (promo) lines.push({ label: "FIRST10", amount: -promo });

  const afterPromo = subtotal - promo;
  const fee = opts?.pass || afterPromo === 0 ? 0 : Math.round(Math.max(3.99, afterPromo * 0.09) * 100) / 100;
  const tip = opts?.tip ?? 0;
  const total = Math.round((afterPromo + fee + tip) * 100) / 100;
  const platformCut = Math.round((afterPromo * 0.15 + fee) * 100) / 100;
  const providerEarn = Math.round((total - platformCut - tip) * 100) / 100 + tip;
  const deposit = afterPromo === 0 ? 0 : Math.max(25, Math.round(total * 0.2));

  return {
    lines,
    subtotal: afterPromo,
    fee,
    tip,
    total,
    deposit,
    providerEarn,
    platformCut,
    minutes,
    manualReview,
    needs: [...needs],
  };
}

export function heightLabel(inches: number) {
  if (inches <= 2) return "Short — 2.0\"";
  if (inches <= 2.5) return "Short/Medium — 2.5\"";
  if (inches <= 3) return "Standard — 3.0\"";
  if (inches <= 3.5) return "Medium/Tall — 3.5\"";
  if (inches <= 4) return "Tall — 4.0\"";
  return "Tall — 4.5\"";
}

export function photoCount(answers: Answers) {
  const p = answers.photos;
  return Array.isArray(p) ? (p as PhotoSlot[]).length : 0;
}

export function requiredPhotosMet(serviceId: string, answers: Answers) {
  const spec = specById(serviceId);
  const q = spec?.questions.find((x) => x.type === "photo_upload");
  if (!q) return true;
  const min = q.minPhotos ?? (q.required ? 1 : 0);
  return photoCount(answers) >= min;
}
