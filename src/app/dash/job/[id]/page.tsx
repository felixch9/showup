"use client";

import { useParams, useRouter } from "next/navigation";
import { MapLive } from "@/components/MapLive";
import { useState } from "react";

export default function DashJob() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  const steps = ["Navigate to job", "On the way", "On site · start", "Photos · complete"];

  return (
    <main className="px-4 py-5 pb-24">
      <p className="text-xs text-acid">{id}</p>
      <h1 className="text-3xl mt-1">{steps[phase]}</h1>
      <div className="mt-4">
        <MapLive label={steps[phase]} eta="Turn-by-turn (demo)" />
      </div>
      <ol className="mt-4 space-y-2 text-sm">
        {steps.map((st, i) => (
          <li key={st} className={i === phase ? "text-acid" : "opacity-40"}>
            {i + 1}. {st}
          </li>
        ))}
      </ol>
      <button
        className="btn btn-acid w-full mt-6"
        type="button"
        onClick={() => {
          if (phase >= 3) router.push("/dash/id-check");
          else setPhase(phase + 1);
        }}
      >
        {phase >= 3 ? "Finish · ID check" : "Next"}
      </button>
    </main>
  );
}
