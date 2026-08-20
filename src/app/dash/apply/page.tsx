"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VEHICLE_TYPES, findCity } from "@/lib/cities";
import { emptyIdentity, getIdentity, setIdentity } from "@/lib/store";
import type { IdentityApp } from "@/lib/types";

const STEPS = [
  "Account",
  "You",
  "Vehicle",
  "Identity",
  "Background",
  "Tax + pay",
  "Safety",
  "Review",
];

const QUIZ = [
  {
    q: "A dog is loose in the yard. You…",
    a: ["Walk in anyway", "Text the customer and wait", "Pepper spray"],
    ok: 1,
  },
  {
    q: "Before you leave a wash job you…",
    a: ["Just invoice", "Send before/after photos in the app", "Post on Facebook"],
    ok: 1,
  },
  {
    q: "Customer asks you to add a second-story roof. Quote was driveway only. You…",
    a: ["Do it cash", "Add it in-app so the price is locked", "Say no forever"],
    ok: 1,
  },
];

export default function Apply() {
  const router = useRouter();
  const [app, setApp] = useState<IdentityApp>(emptyIdentity());
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const existing = getIdentity();
    setApp(existing);
    if (existing.status === "approved") router.replace("/dash");
  }, [router]);

  function save(patch: Partial<IdentityApp>) {
    const next = { ...app, ...patch };
    setApp(next);
    setIdentity(next);
  }

  function fileName(e: React.ChangeEvent<HTMLInputElement>, key: keyof IdentityApp) {
    const f = e.target.files?.[0];
    save({ [key]: f ? `sandbox:${f.name}` : "" } as Partial<IdentityApp>);
  }

  function next() {
    save({ step: Math.min(STEPS.length - 1, app.step + 1) });
  }

  function submit() {
    setBusy(true);
    save({ status: "submitted", matchScore: 97 });
    const stages: IdentityApp["status"][] = ["identity", "mvr", "criminal", "approved"];
    stages.forEach((st, i) => {
      setTimeout(() => {
        const cur = { ...getIdentity(), status: st };
        setIdentity(cur);
        setApp(cur);
        if (st === "approved") {
          setBusy(false);
          router.push("/dash");
        }
      }, 900 * (i + 1));
    });
  }

  const s = app.step;

  return (
    <main className="max-w-lg mx-auto px-4 py-8 pb-16">
      <p className="text-acid text-xs font-bold uppercase tracking-widest">Sandbox identity · no real SSN leaves this phone</p>
      <h1 className="text-4xl mt-2">Drive with ShowUp</h1>
      <p className="mt-2 text-white/60 text-sm">
        Same checklist Dashers and Uber couriers hit: 18+, government ID, selfie match, FCRA background, MVR if you drive, insurance, W-9, payout. Patterned on public DoorDash / Uber signup docs — not their software.
      </p>
      <div className="stepper mt-6">
        {STEPS.map((_, i) => (
          <i key={i} className={i <= s ? "on" : ""} />
        ))}
      </div>
      <p className="mt-2 text-xs opacity-50">
        {s + 1}/{STEPS.length} · {STEPS[s]}
      </p>

      {s === 0 ? (
        <div className="mt-6 grid gap-3">
          <label>
            Email
            <input className="!text-ink" value={app.email} onChange={(e) => save({ email: e.target.value })} />
          </label>
          <label>
            Mobile
            <input className="!text-ink" value={app.phone} onChange={(e) => save({ phone: e.target.value })} />
          </label>
          <label>
            Home ZIP
            <input
              className="!text-ink"
              value={app.zip}
              onChange={(e) => {
                const zip = e.target.value;
                save({ zip, city: findCity(zip)?.name ?? "" });
              }}
            />
          </label>
          {app.city ? <p className="text-sm text-acid">Market: {app.city}</p> : null}
          <label>
            6-digit SMS code (demo: any 6 digits)
            <input className="!text-ink" value={code} onChange={(e) => setCode(e.target.value)} />
          </label>
          <button className="btn btn-acid" disabled={code.length < 6 || !app.email} onClick={next} type="button">
            Verify & continue
          </button>
        </div>
      ) : null}

      {s === 1 ? (
        <div className="mt-6 grid gap-3">
          <label>
            Legal first name
            <input className="!text-ink" value={app.first} onChange={(e) => save({ first: e.target.value })} />
          </label>
          <label>
            Legal last name
            <input className="!text-ink" value={app.last} onChange={(e) => save({ last: e.target.value })} />
          </label>
          <label>
            Date of birth (must be 18+)
            <input className="!text-ink" type="date" value={app.dob} onChange={(e) => save({ dob: e.target.value })} />
          </label>
          <label>
            Street address
            <input className="!text-ink" value={app.address} onChange={(e) => save({ address: e.target.value })} />
          </label>
          <label className="!flex gap-2 items-start text-sm font-normal">
            <input
              type="checkbox"
              className="!w-auto mt-1"
              checked={app.last4}
              onChange={(e) => save({ last4: e.target.checked })}
            />
            I confirm I have a US SSN or ITIN. ShowUp will collect last-4 only through a licensed screening vendor in production. This demo stores a yes/no flag — never a number.
          </label>
          <button className="btn btn-acid" disabled={!app.first || !app.last4} onClick={next} type="button">
            Continue
          </button>
        </div>
      ) : null}

      {s === 2 ? (
        <div className="mt-6 grid gap-3">
          <label>
            Vehicle
            <select className="!text-ink" value={app.vehicle} onChange={(e) => save({ vehicle: e.target.value })}>
              {VEHICLE_TYPES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <label>
              Year
              <input className="!text-ink" value={app.year} onChange={(e) => save({ year: e.target.value })} />
            </label>
            <label>
              Make
              <input className="!text-ink" value={app.make} onChange={(e) => save({ make: e.target.value })} />
            </label>
            <label>
              Model
              <input className="!text-ink" value={app.model} onChange={(e) => save({ model: e.target.value })} />
            </label>
          </div>
          <label>
            Plate
            <input className="!text-ink" value={app.plate} onChange={(e) => save({ plate: e.target.value })} />
          </label>
          <label className="id-slot !text-ink">
            Insurance card photo
            <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => fileName(e, "insurance")} />
            <span className="text-xs mt-1">{app.insurance || "Tap to attach (stays on device)"}</span>
          </label>
          <label className="id-slot !text-ink">
            Registration
            <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => fileName(e, "registration")} />
            <span className="text-xs mt-1">{app.registration || "Tap to attach"}</span>
          </label>
          <button className="btn btn-acid" onClick={next} type="button">
            Continue
          </button>
        </div>
      ) : null}

      {s === 3 ? (
        <div className="mt-6 grid gap-3">
          <p className="text-sm text-white/70">
            Government photo ID + selfie. Uber and DoorDash both match these. Files are labeled sandbox and never posted.
          </p>
          <label className="id-slot !text-ink">
            ID front
            <input type="file" accept="image/*" className="hidden" onChange={(e) => fileName(e, "idFront")} />
            <span className="text-xs">{app.idFront || "Driver license / state ID / passport"}</span>
          </label>
          <label className="id-slot !text-ink">
            ID back
            <input type="file" accept="image/*" className="hidden" onChange={(e) => fileName(e, "idBack")} />
            <span className="text-xs">{app.idBack || "Optional for passport"}</span>
          </label>
          <label className="id-slot !text-ink">
            Live selfie
            <input type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => fileName(e, "selfie")} />
            <span className="text-xs">{app.selfie || "Face clearly visible, no sunglasses"}</span>
          </label>
          {app.idFront && app.selfie ? (
            <p className="text-acid text-sm">Liveness + face match (demo): 97% · pass</p>
          ) : null}
          <button className="btn btn-acid" disabled={!app.idFront || !app.selfie} onClick={next} type="button">
            Continue
          </button>
        </div>
      ) : null}

      {s === 4 ? (
        <div className="mt-6 grid gap-3 text-sm">
          <div className="card !bg-white !text-ink p-4">
            <h2 className="text-xl">FCRA disclosure (sandbox)</h2>
            <p className="mt-2 font-normal">
              ShowUp will use a consumer reporting agency (in production: a Checkr-class vendor) to obtain a consumer report that may include criminal history (typically 7 years where allowed), national sex-offender registry, SSN trace, and — if you selected a motor vehicle — a Motor Vehicle Report. You can request a copy of the report. Adverse action, if any, is mailed/emailed with the report and FCRA summary of rights. This demo does not contact a CRA and does not transmit identity data.
            </p>
          </div>
          <label className="!flex gap-2 items-start font-normal">
            <input type="checkbox" className="!w-auto mt-1" checked={app.fcra} onChange={(e) => save({ fcra: e.target.checked })} />
            I authorize the background check and certify I am 18+.
          </label>
          <label className="!flex gap-2 items-start font-normal">
            <input type="checkbox" className="!w-auto mt-1" checked={app.mvr} onChange={(e) => save({ mvr: e.target.checked })} />
            I authorize an MVR if I drive a motor vehicle.
          </label>
          <button className="btn btn-acid" disabled={!app.fcra} onClick={next} type="button">
            Authorize screening
          </button>
        </div>
      ) : null}

      {s === 5 ? (
        <div className="mt-6 grid gap-3">
          <p className="text-sm text-white/70">W-9 / 1099. Instant pay after each job (like Fast Pay / Crimson) or weekly ACH.</p>
          <label>
            Payout
            <select className="!text-ink" value={app.payout} onChange={(e) => save({ payout: e.target.value as IdentityApp["payout"] })}>
              <option value="">Choose</option>
              <option value="instant">Instant after each job</option>
              <option value="weekly">Weekly direct deposit</option>
            </select>
          </label>
          <label>
            Bank account last 4 (demo)
            <input className="!text-ink" maxLength={4} value={app.bankLast4} onChange={(e) => save({ bankLast4: e.target.value.replace(/\D/g, "") })} />
          </label>
          <p className="text-xs opacity-50">Routing/account numbers are not stored in this demo.</p>
          <button className="btn btn-acid" disabled={!app.payout} onClick={next} type="button">
            Continue
          </button>
        </div>
      ) : null}

      {s === 6 ? (
        <div className="mt-6 grid gap-4">
          {QUIZ.map((item, i) => (
            <fieldset key={item.q} className="card !bg-white !text-ink p-4">
              <legend className="font-bold">{item.q}</legend>
              {item.a.map((ans, j) => (
                <label key={ans} className="!flex gap-2 font-normal mt-2">
                  <input
                    type="radio"
                    name={`q${i}`}
                    className="!w-auto"
                    onChange={() => {
                      if (j === item.ok) save({ quiz: app.quiz | (1 << i) });
                    }}
                  />
                  {ans}
                </label>
              ))}
            </fieldset>
          ))}
          <button className="btn btn-acid" disabled={app.quiz !== 7} onClick={next} type="button">
            Pass quiz
          </button>
        </div>
      ) : null}

      {s === 7 ? (
        <div className="mt-6 grid gap-3 text-sm">
          <ul className="card !bg-white !text-ink p-4 space-y-2">
            <li>{app.first} {app.last} · {app.email}</li>
            <li>{app.vehicle} {app.year} {app.make} {app.model} · {app.plate || "no plate"}</li>
            <li>ID {app.idFront ? "on device" : "missing"} · selfie {app.selfie ? "on device" : "missing"}</li>
            <li>FCRA {app.fcra ? "authorized" : "no"} · payout {app.payout}</li>
          </ul>
          <button className="btn btn-acid" disabled={busy} onClick={submit} type="button">
            {busy ? `Screening · ${app.status}` : "Submit application"}
          </button>
          {busy ? (
            <ol className="text-white/70 space-y-1">
              <li>Identity vendor (sandbox)</li>
              <li>MVR if vehicle</li>
              <li>Criminal + registry</li>
              <li>Approve → Crew app</li>
            </ol>
          ) : null}
        </div>
      ) : null}

      {s > 0 && s < 7 ? (
        <button className="mt-4 text-xs underline opacity-60" type="button" onClick={() => save({ step: s - 1 })}>
          Back
        </button>
      ) : null}
    </main>
  );
}
