"use client";

import { useParams, useRouter } from "next/navigation";
import { MapLive } from "@/components/MapLive";
import { useState } from "react";
import { getJob, upsertJob } from "@/lib/store";
import type { MachineState } from "@/lib/job-machine";

const STEPS: { label: string; state: MachineState }[] = [
  { label: "Accepted · navigate", state: "accepted" },
  { label: "Preparing", state: "preparing" },
  { label: "En route", state: "enroute" },
  { label: "Arrived", state: "arrived" },
  { label: "Before photos", state: "before_photos" },
  { label: "In progress", state: "in_progress" },
  { label: "After photos", state: "after_photos" },
  { label: "Complete", state: "completed" },
];

export default function DashJob() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [phase, setPhase] = useState(0);

  function next() {
    const st = STEPS[Math.min(phase + 1, STEPS.length - 1)];
    const job = getJob(id) ?? getJob(id.replace(/^O-/, ""));
    if (job) upsertJob({ ...job, status: st.state, machine: st.state });
    if (phase >= STEPS.length - 1) router.push("/dash/id-check");
    else setPhase(phase + 1);
  }

  return (
    <main className="px-4 py-5 pb-24">
      <p className="text-xs text-acid">{id}</p>
      <h1 className="text-3xl mt-1">{STEPS[phase].label}</h1>
      <div className="mt-4">
        <MapLive label={STEPS[phase].label} eta="Turn-by-turn (demo)" />
      </div>
      <ol className="mt-4 space-y-2 text-sm">
        {STEPS.map((st, i) => (
          <li key={st.state} className={i === phase ? "text-acid" : "opacity-40"}>
            {i + 1}. {st.label}
          </li>
        ))}
      </ol>
      <button className="btn btn-acid w-full mt-6" type="button" onClick={next}>
        {phase >= STEPS.length - 1 ? "Finish · ID check" : "Next"}
      </button>
    </main>
  );
}
