export type City = {
  slug: string;
  name: string;
  state: string;
  region: string;
  zips: string[];
  busy: "hot" | "busy" | "ok";
  crews: number;
  eta: number;
};

export const CITIES: City[] = [
  { slug: "atlanta", name: "Atlanta", state: "GA", region: "South", zips: ["30301", "30318"], busy: "hot", crews: 412, eta: 16 },
  { slug: "austin", name: "Austin", state: "TX", region: "South", zips: ["78701", "78704"], busy: "busy", crews: 188, eta: 19 },
  { slug: "baltimore", name: "Baltimore", state: "MD", region: "East", zips: ["21201"], busy: "ok", crews: 96, eta: 22 },
  { slug: "boston", name: "Boston", state: "MA", region: "East", zips: ["02108", "02116"], busy: "busy", crews: 210, eta: 18 },
  { slug: "charlotte", name: "Charlotte", state: "NC", region: "South", zips: ["28202", "28205"], busy: "hot", crews: 174, eta: 17 },
  { slug: "chicago", name: "Chicago", state: "IL", region: "Midwest", zips: ["60601", "60614"], busy: "hot", crews: 520, eta: 15 },
  { slug: "columbia-sc", name: "Columbia", state: "SC", region: "South", zips: ["29201", "29206", "29072"], busy: "hot", crews: 48, eta: 14 },
  { slug: "dallas", name: "Dallas", state: "TX", region: "South", zips: ["75201", "75204"], busy: "hot", crews: 390, eta: 16 },
  { slug: "denver", name: "Denver", state: "CO", region: "West", zips: ["80202"], busy: "busy", crews: 201, eta: 18 },
  { slug: "detroit", name: "Detroit", state: "MI", region: "Midwest", zips: ["48201"], busy: "ok", crews: 132, eta: 21 },
  { slug: "houston", name: "Houston", state: "TX", region: "South", zips: ["77002", "77006"], busy: "hot", crews: 448, eta: 15 },
  { slug: "jacksonville", name: "Jacksonville", state: "FL", region: "South", zips: ["32202"], busy: "ok", crews: 88, eta: 20 },
  { slug: "kansas-city", name: "Kansas City", state: "MO", region: "Midwest", zips: ["64108"], busy: "ok", crews: 77, eta: 21 },
  { slug: "las-vegas", name: "Las Vegas", state: "NV", region: "West", zips: ["89101"], busy: "busy", crews: 156, eta: 17 },
  { slug: "los-angeles", name: "Los Angeles", state: "CA", region: "West", zips: ["90001", "90012"], busy: "hot", crews: 680, eta: 14 },
  { slug: "miami", name: "Miami", state: "FL", region: "South", zips: ["33101", "33139"], busy: "hot", crews: 301, eta: 16 },
  { slug: "minneapolis", name: "Minneapolis", state: "MN", region: "Midwest", zips: ["55401"], busy: "ok", crews: 119, eta: 20 },
  { slug: "nashville", name: "Nashville", state: "TN", region: "South", zips: ["37201", "37203"], busy: "busy", crews: 164, eta: 17 },
  { slug: "new-orleans", name: "New Orleans", state: "LA", region: "South", zips: ["70112"], busy: "busy", crews: 91, eta: 19 },
  { slug: "new-york", name: "New York", state: "NY", region: "East", zips: ["10001", "11201"], busy: "hot", crews: 890, eta: 13 },
  { slug: "orlando", name: "Orlando", state: "FL", region: "South", zips: ["32801"], busy: "busy", crews: 142, eta: 18 },
  { slug: "philadelphia", name: "Philadelphia", state: "PA", region: "East", zips: ["19103"], busy: "busy", crews: 244, eta: 17 },
  { slug: "phoenix", name: "Phoenix", state: "AZ", region: "West", zips: ["85001", "85004"], busy: "hot", crews: 276, eta: 16 },
  { slug: "portland", name: "Portland", state: "OR", region: "West", zips: ["97201"], busy: "ok", crews: 128, eta: 20 },
  { slug: "raleigh", name: "Raleigh", state: "NC", region: "South", zips: ["27601"], busy: "busy", crews: 133, eta: 18 },
  { slug: "sacramento", name: "Sacramento", state: "CA", region: "West", zips: ["95814"], busy: "ok", crews: 101, eta: 21 },
  { slug: "san-antonio", name: "San Antonio", state: "TX", region: "South", zips: ["78205"], busy: "busy", crews: 167, eta: 18 },
  { slug: "san-diego", name: "San Diego", state: "CA", region: "West", zips: ["92101"], busy: "busy", crews: 198, eta: 17 },
  { slug: "san-francisco", name: "San Francisco", state: "CA", region: "West", zips: ["94102", "94110"], busy: "hot", crews: 255, eta: 16 },
  { slug: "seattle", name: "Seattle", state: "WA", region: "West", zips: ["98101"], busy: "busy", crews: 187, eta: 18 },
  { slug: "tampa", name: "Tampa", state: "FL", region: "South", zips: ["33602"], busy: "busy", crews: 151, eta: 18 },
  { slug: "washington-dc", name: "Washington", state: "DC", region: "East", zips: ["20001", "20009"], busy: "hot", crews: 268, eta: 16 },
  { slug: "san-juan", name: "San Juan", state: "PR", region: "Caribbean", zips: ["00901", "00907"], busy: "hot", crews: 86, eta: 18 },
  { slug: "bayamon", name: "Bayamón", state: "PR", region: "Caribbean", zips: ["00956"], busy: "busy", crews: 41, eta: 20 },
  { slug: "carolina-pr", name: "Carolina", state: "PR", region: "Caribbean", zips: ["00979"], busy: "ok", crews: 29, eta: 22 },
  { slug: "ponce", name: "Ponce", state: "PR", region: "Caribbean", zips: ["00716"], busy: "ok", crews: 22, eta: 24 },
  { slug: "caguas", name: "Caguas", state: "PR", region: "Caribbean", zips: ["00725"], busy: "ok", crews: 18, eta: 23 },
  { slug: "guaynabo", name: "Guaynabo", state: "PR", region: "Caribbean", zips: ["00966"], busy: "busy", crews: 33, eta: 19 },
];

export function cityBySlug(slug: string) {
  return CITIES.find((c) => c.slug === slug);
}

export function findCity(q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return undefined;
  const zip = s.replace(/\D/g, "").slice(0, 5);
  if (zip.length === 5) {
    const hit = CITIES.find((c) => c.zips.some((z) => z.startsWith(zip.slice(0, 3))));
    if (hit) return hit;
  }
  return CITIES.find(
    (c) =>
      c.slug.includes(s.replace(/\s+/g, "-")) ||
      c.name.toLowerCase().includes(s) ||
      c.state.toLowerCase() === s,
  );
}

export const VEHICLE_TYPES = [
  { id: "truck", label: "Pickup / work truck", needsMvr: true, needsIns: true },
  { id: "van", label: "Van", needsMvr: true, needsIns: true },
  { id: "trailer", label: "Truck + trailer", needsMvr: true, needsIns: true },
  { id: "car", label: "Car (small jobs / quotes)", needsMvr: true, needsIns: true },
  { id: "bike", label: "Bike / e-bike (walk-up quotes)", needsMvr: false, needsIns: false },
] as const;
