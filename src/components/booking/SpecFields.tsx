"use client";

import type { Answers, PhotoSlot } from "@/lib/quote-engine";
import { heightLabel } from "@/lib/quote-engine";
import type { Question } from "@/lib/spec";
import { takeNativePhoto } from "@/lib/native";

function setAns(answers: Answers, id: string, value: unknown, onChange: (a: Answers) => void) {
  onChange({ ...answers, [id]: value });
}

function asList(v: unknown) {
  return Array.isArray(v) ? (v as string[]) : [];
}

function toggle(list: string[], id: string) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

async function compress(file: File): Promise<PhotoSlot> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 520 / Math.max(img.width, img.height));
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve({
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        dataUrl: canvas.toDataURL("image/jpeg", 0.62),
      });
    };
    img.onerror = () => reject(new Error("photo"));
    img.src = url;
  });
}

export function SpecField({
  q,
  answers,
  onChange,
}: {
  q: Question;
  answers: Answers;
  onChange: (a: Answers) => void;
}) {
  const val = answers[q.id];

  if (q.type === "visual_scale" && q.options) {
    const selected = String(val ?? "");
    return (
      <fieldset>
        <legend className="text-xl font-bold">{q.title}</legend>
        {q.help ? <p className="text-sm text-[var(--muted)] mt-1 mb-3">{q.help}</p> : <div className="h-2" />}
        <div className="grass-scale">
          {q.options.map((o, i) => (
            <button
              key={o.id}
              type="button"
              className={selected === o.id ? "on" : ""}
              onClick={() => setAns(answers, q.id, o.id, onChange)}
            >
              <span className="blade" style={{ height: `${22 + i * 16}%` }} />
              <b>{o.label}</b>
              <small>{o.blurb}</small>
            </button>
          ))}
        </div>
      </fieldset>
    );
  }

  if (q.type === "slider") {
    const n = typeof val === "number" ? val : 3;
    return (
      <fieldset>
        <legend className="text-xl font-bold">{q.title}</legend>
        <p className="text-3xl mt-2">{heightLabel(n)}</p>
        <input
          type="range"
          min={q.min}
          max={q.max}
          step={q.step}
          value={n}
          onChange={(e) => setAns(answers, q.id, Number(e.target.value), onChange)}
        />
        <div className="flex justify-between text-xs text-[var(--muted)]">
          <span>{q.min}{q.unit}</span>
          <span>{q.max}{q.unit}</span>
        </div>
      </fieldset>
    );
  }

  if (q.type === "choice" && q.options) {
    return (
      <fieldset>
        <legend className="text-xl font-bold">{q.title}</legend>
        <div className="mt-3 grid gap-2">
          {q.options.map((o) => (
            <button
              key={o.id}
              type="button"
              className={`text-left rounded-2xl border p-3 ${val === o.id ? "border-ink bg-acid/40" : "border-[var(--line)] bg-white"}`}
              onClick={() => setAns(answers, q.id, o.id, onChange)}
            >
              <b>{o.label}</b>
              {o.priceModifier ? <span className="text-sm opacity-60"> +${o.priceModifier}</span> : null}
            </button>
          ))}
        </div>
      </fieldset>
    );
  }

  if ((q.type === "multi_select" || q.type === "toggle_list" || q.type === "features") && q.options) {
    const list = asList(val);
    return (
      <fieldset>
        <legend className="text-xl font-bold">{q.title}</legend>
        {q.help ? <p className="text-sm text-[var(--muted)] mt-1">{q.help}</p> : null}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {q.options.map((o) => {
            const on = list.includes(o.id);
            return (
              <button
                key={o.id}
                type="button"
                className={`text-left rounded-2xl border p-3 ${on ? "border-ink bg-acid/35" : "border-[var(--line)] bg-white"}`}
                onClick={() => setAns(answers, q.id, toggle(list, o.id), onChange)}
              >
                <b>{o.label}</b>
                {o.priceModifier ? <span className="text-sm"> +${o.priceModifier}</span> : null}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (q.type === "photo_upload") {
    const photos = (Array.isArray(answers.photos) ? answers.photos : []) as PhotoSlot[];
    return (
      <fieldset>
        <legend className="text-xl font-bold">{q.title}</legend>
        <p className="text-sm text-[var(--muted)] mt-1">{q.help ?? "Photos beat guessing. Required before we lock the price."}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {(q.options ?? [{ id: "p", label: "Photo" }]).map((slot) => {
            const existing = photos.find((p) => p.id.startsWith(slot.id) || p.name.includes(slot.id));
            return (
              <label key={slot.id} className="id-slot">
                {existing ? (
                  <img src={existing.dataUrl} alt="" className="max-h-28 rounded-lg object-cover w-full" />
                ) : (
                  <span>{slot.label}</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const slotPhoto = await compress(f);
                    slotPhoto.id = `${slot.id}-${slotPhoto.id}`;
                    const next = photos.filter((p) => !p.id.startsWith(`${slot.id}-`));
                    onChange({ ...answers, photos: [...next, slotPhoto] });
                  }}
                />
                <button
                  type="button"
                  className="text-xs underline mt-1"
                  onClick={async (e) => {
                    e.preventDefault();
                    const dataUrl = await takeNativePhoto();
                    if (!dataUrl) return;
                    const slotPhoto: PhotoSlot = { id: `${slot.id}-${Date.now()}`, name: "camera.jpg", dataUrl };
                    const next = photos.filter((p) => !p.id.startsWith(`${slot.id}-`));
                    onChange({ ...answers, photos: [...next, slotPhoto] });
                  }}
                >
                  Native camera
                </button>
              </label>
            );
          })}
        </div>
        <p className="text-xs mt-2 text-[var(--muted)]">
          {photos.length}/{q.minPhotos ?? 1} attached · kept on this phone
        </p>
      </fieldset>
    );
  }

  return null;
}
