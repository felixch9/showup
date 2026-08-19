"use client";

export function MapLive({
  label,
  eta,
}: {
  label: string;
  eta?: string;
}) {
  return (
    <div className="map-live">
      <div className="map-grid" />
      <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 400 280">
        <path
          d="M20 250 C 80 220, 90 180, 140 170 S 220 150, 250 120 S 320 90, 360 80"
          fill="none"
          stroke="#dffc3a"
          strokeWidth="3"
          strokeDasharray="6 8"
        />
        <path
          d="M40 40 L 40 260 M 180 20 L 180 260 M 300 30 L 300 250 M 10 90 H 390 M 10 180 H 390"
          fill="none"
          stroke="#ffffff22"
          strokeWidth="8"
        />
      </svg>
      <div className="truck-pin" />
      <div className="home-pin" />
      <div className="absolute left-4 bottom-4 right-4 flex items-end justify-between text-paper">
        <div>
          <p className="chip !bg-acid !text-ink !border-0 font-bold">{label}</p>
          {eta ? <p className="mt-2 text-sm opacity-80">{eta}</p> : null}
        </div>
        <p className="text-xs opacity-60">Live · Midlands</p>
      </div>
    </div>
  );
}
