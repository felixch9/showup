export const JOB_STATES = [
  "draft",
  "priced",
  "authorized",
  "searching",
  "offered",
  "accepted",
  "preparing",
  "enroute",
  "arrived",
  "before_photos",
  "in_progress",
  "after_photos",
  "completed",
  "confirmed",
  "paid",
  "rated",
  "canceled",
] as const;

export type MachineState = (typeof JOB_STATES)[number];

const CUSTOMER: Record<MachineState, string> = {
  draft: "Draft",
  priced: "Price locked",
  authorized: "Payment authorized",
  searching: "Finding a crew…",
  offered: "Finding a crew…",
  accepted: "accepted your job",
  preparing: "is preparing",
  enroute: "is on the way",
  arrived: "has arrived",
  before_photos: "is photographing before",
  in_progress: "Your service is underway",
  after_photos: "is photographing after",
  completed: "Job complete",
  confirmed: "You confirmed",
  paid: "Payout released",
  rated: "Rated",
  canceled: "Canceled",
};

export function customerLabel(state: MachineState, crewName?: string) {
  const raw = CUSTOMER[state];
  if (state === "accepted" || state === "preparing" || state === "enroute" || state === "arrived" || state === "before_photos" || state === "after_photos") {
    return `${crewName ?? "Your crew"} ${raw}`;
  }
  return raw;
}

/** Demo clock: walk the live states after booking. */
export function stateFromElapsed(ms: number, started: MachineState = "searching"): MachineState {
  if (started === "canceled") return "canceled";
  if (started === "rated" || started === "paid") return started;
  const t = ms / 1000;
  if (t < 8) return "searching";
  if (t < 16) return "offered";
  if (t < 28) return "accepted";
  if (t < 45) return "preparing";
  if (t < 90) return "enroute";
  if (t < 110) return "arrived";
  if (t < 130) return "before_photos";
  if (t < 200) return "in_progress";
  if (t < 230) return "after_photos";
  if (t < 250) return "completed";
  if (t < 270) return "confirmed";
  if (t < 290) return "paid";
  return "rated";
}

export function progressPct(state: MachineState) {
  const i = JOB_STATES.indexOf(state);
  const live = JOB_STATES.indexOf("searching");
  const end = JOB_STATES.indexOf("rated");
  if (i < live) return 4;
  return Math.round(((i - live) / (end - live)) * 100);
}
