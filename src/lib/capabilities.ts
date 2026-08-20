import { CREWS } from "./catalog";
import type { Answers } from "./quote-engine";
import { buildQuote } from "./quote-engine";
import { resolveServiceId } from "./spec";
import type { Crew, ServiceId } from "./types";

export const EQUIPMENT = [
  { id: "push", label: "Push mower" },
  { id: "riding", label: "Riding mower" },
  { id: "zero_turn", label: "Zero turn" },
  { id: "weed_eater", label: "Weed eater" },
  { id: "edger", label: "Edger" },
  { id: "blower", label: "Blower" },
  { id: "trailer", label: "Trailer" },
  { id: "truck", label: "Pickup truck" },
  { id: "pressure", label: "Pressure washer" },
  { id: "surface_cleaner", label: "Surface cleaner" },
  { id: "soft_wash", label: "Soft-wash system" },
  { id: "ladder", label: "Ladder (extension)" },
  { id: "chainsaw", label: "Chainsaw" },
] as const;

export function crewCanTake(crew: Crew, serviceId: string, answers: Answers) {
  const sid = resolveServiceId(serviceId);
  if (!crew.trades.includes(sid as ServiceId) && !crew.trades.includes(serviceId as ServiceId)) {
    if (sid === "wash" && (crew.trades.includes("driveway") || crew.trades.includes("housewash"))) {
      // ok
    } else if (sid === "cleanup" || sid === "leaf" || sid === "hedge" || sid === "junk") {
      if (!crew.trades.includes("lawn") && !crew.trades.includes("mulch")) return false;
    } else {
      return false;
    }
  }
  const quote = buildQuote(sid, answers);
  const kit = crew.equipment ?? [];
  const missing = quote.needs.filter((n) => !kit.includes(n));
  const stories = String(answers.stories ?? "1");
  if (stories === "3" && (crew.maxStories ?? 2) < 3) return false;
  if (quote.needs.includes("zero_turn") && !kit.includes("zero_turn") && !kit.includes("riding")) return false;
  if (missing.includes("ladder") && (crew.maxStories ?? 1) < 2) return false;
  return missing.length === 0 || missing.every((m) => m === "soft_wash" && kit.includes("pressure"));
}

export function matchCrews(serviceId: string, answers: Answers, zip: string) {
  const n = zip.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0);
  const able = CREWS.filter((c) => crewCanTake(c, serviceId, answers));
  const pool = able.length ? able : CREWS;
  return pool.slice().sort((a, b) => (a.id.charCodeAt(0) + n) % 7 - ((b.id.charCodeAt(0) + n) % 7));
}
