import type { ServiceId } from "./types";

export type QuestionType =
  | "visual_scale"
  | "slider"
  | "choice"
  | "multi_select"
  | "toggle_list"
  | "photo_upload"
  | "features";

export type SpecOption = {
  id: string;
  label: string;
  blurb?: string;
  priceModifier?: number;
  minutesModifier?: number;
  manualReview?: boolean;
  needs?: string[];
};

export type Question = {
  id: string;
  title: string;
  help?: string;
  type: QuestionType;
  required?: boolean;
  minPhotos?: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: SpecOption[];
};

export type ServiceDefinition = {
  id: ServiceId;
  name: string;
  category: string;
  from: number;
  photo: string;
  base: number;
  baseMinutes: number;
  questions: Question[];
  aliases?: string[];
};

export const SPECS: ServiceDefinition[] = [
  {
    id: "lawn",
    name: "Lawn mowing",
    category: "Lawn & yard",
    from: 35,
    photo: "/photos/lawn.jpg",
    base: 35,
    baseMinutes: 50,
    questions: [
      {
        id: "lot_size",
        title: "About how big is the lawn?",
        type: "choice",
        required: true,
        options: [
          { id: "under_3k", label: "Small · under 3,000 sq ft", priceModifier: 0, minutesModifier: 0 },
          { id: "3k_6k", label: "~3,000–6,000 sq ft", priceModifier: 10, minutesModifier: 15 },
          { id: "6k_10k", label: "~6,000–10,000 sq ft", priceModifier: 15, minutesModifier: 25 },
          { id: "10k_20k", label: "~10,000–20,000 sq ft", priceModifier: 35, minutesModifier: 40, needs: ["riding"] },
          { id: "acre", label: "Half acre+", priceModifier: 70, minutesModifier: 70, needs: ["zero_turn"] },
        ],
      },
      {
        id: "current_grass_height",
        title: "How tall is the grass right now?",
        help: "This is the difference between a $35 cut and a brush hog.",
        type: "visual_scale",
        required: true,
        options: [
          { id: "0_4", label: "Normal", blurb: "0–4 in", priceModifier: 0 },
          { id: "4_8", label: "Tall", blurb: "4–8 in", priceModifier: 10, minutesModifier: 10 },
          { id: "8_12", label: "Very tall", blurb: "8–12 in", priceModifier: 20, minutesModifier: 20 },
          { id: "12_18", label: "Overgrown", blurb: "12–18 in", priceModifier: 40, minutesModifier: 35, needs: ["riding"] },
          { id: "18_plus", label: "Seriously overgrown", blurb: "18+ in", priceModifier: 80, minutesModifier: 55, manualReview: true, needs: ["zero_turn"] },
        ],
      },
      {
        id: "desired_grass_height",
        title: "How short do you want it?",
        type: "slider",
        min: 2,
        max: 4.5,
        step: 0.5,
        unit: "in",
        required: true,
      },
      {
        id: "clippings",
        title: "What should happen to the clippings?",
        type: "choice",
        required: true,
        options: [
          { id: "mulch", label: "Mulch them", priceModifier: 0 },
          { id: "side", label: "Side discharge", priceModifier: 0 },
          { id: "bag", label: "Bag them (leave bags)", priceModifier: 10, minutesModifier: 10 },
          { id: "bag_haul", label: "Bag + haul away", priceModifier: 15, minutesModifier: 15, needs: ["truck"] },
        ],
      },
      {
        id: "zones",
        title: "What are we mowing?",
        type: "multi_select",
        options: [
          { id: "front", label: "Front yard", priceModifier: 0 },
          { id: "back", label: "Backyard", priceModifier: 8 },
          { id: "side", label: "Side yards", priceModifier: 5 },
        ],
      },
      {
        id: "addons",
        title: "Add-ons",
        type: "toggle_list",
        options: [
          { id: "edge", label: "Edge driveway / sidewalk", priceModifier: 8, minutesModifier: 10, needs: ["edger"] },
          { id: "weed_eat", label: "Weed eat around structures", priceModifier: 10, minutesModifier: 12, needs: ["weed_eater"] },
          { id: "blow", label: "Blow off driveway", priceModifier: 6, minutesModifier: 8, needs: ["blower"] },
          { id: "fence", label: "Trim fence line", priceModifier: 8, minutesModifier: 10 },
          { id: "debris", label: "Remove debris first", priceModifier: 12, minutesModifier: 15 },
          { id: "pet", label: "Pet waste cleanup", priceModifier: 15, minutesModifier: 10 },
          { id: "leaves", label: "Leaf cleanup", priceModifier: 20, minutesModifier: 20 },
        ],
      },
      {
        id: "photos",
        title: "Show us the job",
        help: "Front, back, grass close-up. Price is an estimate until photos land — AI will assist later, not set the invoice alone.",
        type: "photo_upload",
        required: true,
        minPhotos: 2,
        options: [
          { id: "front", label: "Front yard" },
          { id: "back", label: "Backyard" },
          { id: "close", label: "Grass close-up" },
          { id: "problem", label: "Problem area (optional)" },
        ],
      },
    ],
  },
  {
    id: "wash",
    name: "Pressure washing",
    category: "Wash",
    from: 59,
    photo: "/photos/split.jpg",
    base: 59,
    baseMinutes: 45,
    aliases: ["driveway", "housewash"],
    questions: [
      {
        id: "surfaces",
        title: "What are we cleaning?",
        help: "Pick every surface. Brick and vinyl are not the same job.",
        type: "multi_select",
        required: true,
        options: [
          { id: "house", label: "House exterior", priceModifier: 80, minutesModifier: 40, needs: ["soft_wash"] },
          { id: "brick", label: "Brick", priceModifier: 40, minutesModifier: 20 },
          { id: "vinyl", label: "Vinyl siding", priceModifier: 35, minutesModifier: 20, needs: ["soft_wash"] },
          { id: "fiber", label: "Fiber-cement siding", priceModifier: 40, minutesModifier: 20, needs: ["soft_wash"] },
          { id: "wood", label: "Painted wood", priceModifier: 45, minutesModifier: 25, needs: ["soft_wash"] },
          { id: "stucco", label: "Stucco", priceModifier: 50, minutesModifier: 25, needs: ["soft_wash"] },
          { id: "driveway", label: "Driveway", priceModifier: 40, minutesModifier: 25, needs: ["surface_cleaner"] },
          { id: "sidewalk", label: "Sidewalk", priceModifier: 15, minutesModifier: 10 },
          { id: "deck", label: "Deck", priceModifier: 35, minutesModifier: 25 },
          { id: "fence", label: "Fence", priceModifier: 30, minutesModifier: 20 },
          { id: "patio", label: "Patio", priceModifier: 25, minutesModifier: 15 },
          { id: "cans", label: "Trash cans", priceModifier: 12, minutesModifier: 8 },
          { id: "garage", label: "Garage floor", priceModifier: 35, minutesModifier: 20 },
          { id: "pool", label: "Pool deck", priceModifier: 40, minutesModifier: 25 },
        ],
      },
      {
        id: "stories",
        title: "House height",
        type: "choice",
        options: [
          { id: "1", label: "1 story", priceModifier: 0 },
          { id: "2", label: "2 story", priceModifier: 40, minutesModifier: 20, needs: ["ladder"] },
          { id: "3", label: "3+ story", priceModifier: 90, minutesModifier: 40, needs: ["ladder"], manualReview: true },
        ],
      },
      {
        id: "condition",
        title: "How dirty is it?",
        type: "visual_scale",
        required: true,
        options: [
          { id: "light", label: "Light dirt", blurb: "Dust / pollen", priceModifier: 0 },
          { id: "algae", label: "Green / algae", blurb: "Organic film", priceModifier: 20, minutesModifier: 15 },
          { id: "heavy", label: "Heavy buildup", blurb: "Thick organic", priceModifier: 40, minutesModifier: 25 },
          { id: "mold", label: "Mold / mildew", blurb: "Staining", priceModifier: 45, minutesModifier: 25, needs: ["soft_wash"] },
          { id: "oil", label: "Oil / grease", blurb: "Driveway spots", priceModifier: 35, minutesModifier: 20 },
          { id: "rust", label: "Rust staining", blurb: "Irrigation / metal", priceModifier: 30, minutesModifier: 15 },
        ],
      },
      {
        id: "features",
        title: "Property features",
        type: "features",
        options: [
          { id: "water", label: "Outdoor water hookup" },
          { id: "power", label: "Accessible outdoor outlet" },
          { id: "plants", label: "Plants tight against the surface", priceModifier: 10 },
          { id: "pool_near", label: "Pool nearby", priceModifier: 8 },
          { id: "pets", label: "Pets on site" },
          { id: "gate", label: "Locked gate" },
          { id: "hoa", label: "HOA rules" },
        ],
      },
      {
        id: "photos",
        title: "Show us the surfaces",
        type: "photo_upload",
        required: true,
        minPhotos: 2,
        options: [
          { id: "wide", label: "Wide shot" },
          { id: "close", label: "Close-up of the dirt" },
          { id: "extra", label: "Another angle" },
        ],
      },
    ],
  },
  {
    id: "gutters",
    name: "Gutter cleaning",
    category: "Exterior",
    from: 69,
    photo: "/photos/gutters.jpg",
    base: 69,
    baseMinutes: 40,
    questions: [
      {
        id: "stories",
        title: "Stories",
        type: "choice",
        required: true,
        options: [
          { id: "1", label: "1 story", priceModifier: 0 },
          { id: "2", label: "2 story", priceModifier: 40, needs: ["ladder"] },
          { id: "3", label: "3+", priceModifier: 80, needs: ["ladder"], manualReview: true },
        ],
      },
      {
        id: "condition",
        title: "How packed?",
        type: "visual_scale",
        options: [
          { id: "light", label: "Light", blurb: "Seasonal", priceModifier: 0 },
          { id: "full", label: "Full", blurb: "Overflowing", priceModifier: 20 },
          { id: "clogged", label: "Downspouts clogged", blurb: "Standing water", priceModifier: 35 },
        ],
      },
      {
        id: "addons",
        title: "Add-ons",
        type: "toggle_list",
        options: [
          { id: "flush", label: "Flush downspouts", priceModifier: 15 },
          { id: "guards", label: "Inspect guards", priceModifier: 10 },
        ],
      },
      {
        id: "photos",
        title: "Photos of the roofline",
        type: "photo_upload",
        minPhotos: 1,
        options: [
          { id: "front", label: "Front" },
          { id: "overflow", label: "Overflow / stain" },
        ],
      },
    ],
  },
  {
    id: "cleanup",
    name: "Yard cleanup",
    category: "Lawn & yard",
    from: 45,
    photo: "/photos/pr.jpg",
    base: 45,
    baseMinutes: 60,
    questions: [
      {
        id: "lot_size",
        title: "How much yard?",
        type: "choice",
        options: [
          { id: "small", label: "Small beds", priceModifier: 0 },
          { id: "medium", label: "Typical lot", priceModifier: 20 },
          { id: "large", label: "Big lot", priceModifier: 45, needs: ["trailer"] },
        ],
      },
      {
        id: "addons",
        title: "What’s in it?",
        type: "toggle_list",
        options: [
          { id: "limbs", label: "Fallen limbs", priceModifier: 20, needs: ["truck"] },
          { id: "leaves", label: "Leaves", priceModifier: 15 },
          { id: "haul", label: "Haul-away", priceModifier: 25, needs: ["trailer"] },
        ],
      },
      {
        id: "photos",
        title: "Show the mess",
        type: "photo_upload",
        minPhotos: 2,
        options: [
          { id: "wide", label: "Wide" },
          { id: "pile", label: "The pile" },
        ],
      },
    ],
  },
  {
    id: "leaf",
    name: "Leaf removal",
    category: "Lawn & yard",
    from: 39,
    photo: "/photos/lawn.jpg",
    base: 39,
    baseMinutes: 50,
    questions: [
      {
        id: "lot_size",
        title: "Coverage",
        type: "choice",
        options: [
          { id: "light", label: "Light scatter", priceModifier: 0 },
          { id: "covered", label: "Lawn covered", priceModifier: 20 },
          { id: "piles", label: "Piles / bags already", priceModifier: 10 },
        ],
      },
      {
        id: "clippings",
        title: "Where do leaves go?",
        type: "choice",
        options: [
          { id: "curb", label: "Curb for city pickup", priceModifier: 0 },
          { id: "haul", label: "Haul away", priceModifier: 25, needs: ["trailer"] },
        ],
      },
      {
        id: "photos",
        title: "Photos",
        type: "photo_upload",
        minPhotos: 1,
        options: [{ id: "yard", label: "Yard" }],
      },
    ],
  },
  {
    id: "hedge",
    name: "Hedge trimming",
    category: "Lawn & yard",
    from: 35,
    photo: "/photos/pr.jpg",
    base: 35,
    baseMinutes: 40,
    questions: [
      {
        id: "lot_size",
        title: "How many linear feet?",
        type: "choice",
        options: [
          { id: "s", label: "Under 40 ft", priceModifier: 0 },
          { id: "m", label: "40–100 ft", priceModifier: 25 },
          { id: "l", label: "100+ ft", priceModifier: 55 },
        ],
      },
      {
        id: "stories",
        title: "Height",
        type: "choice",
        options: [
          { id: "1", label: "Waist / chest", priceModifier: 0 },
          { id: "2", label: "Over your head", priceModifier: 20, needs: ["ladder"] },
        ],
      },
      {
        id: "photos",
        title: "Photos of the hedge",
        type: "photo_upload",
        minPhotos: 1,
        options: [{ id: "hedge", label: "Hedge" }],
      },
    ],
  },
  {
    id: "mulch",
    name: "Mulch install",
    category: "Lawn & yard",
    from: 89,
    photo: "/photos/pr.jpg",
    base: 89,
    baseMinutes: 90,
    questions: [
      {
        id: "lot_size",
        title: "Beds",
        type: "choice",
        options: [
          { id: "few", label: "A few beds", priceModifier: 0 },
          { id: "house", label: "Around the house", priceModifier: 40 },
          { id: "estate", label: "Whole property", priceModifier: 90, needs: ["truck"] },
        ],
      },
      {
        id: "photos",
        title: "Bed photos",
        type: "photo_upload",
        minPhotos: 1,
        options: [{ id: "beds", label: "Beds" }],
      },
    ],
  },
  {
    id: "junk",
    name: "Junk removal",
    category: "Haul",
    from: 79,
    photo: "/photos/street.jpg",
    base: 79,
    baseMinutes: 60,
    questions: [
      {
        id: "lot_size",
        title: "Load size",
        type: "choice",
        options: [
          { id: "pickup", label: "Pickup bed", priceModifier: 0, needs: ["truck"] },
          { id: "trailer", label: "Trailer", priceModifier: 60, needs: ["trailer"] },
          { id: "dumpster", label: "Room-full / dumpster", priceModifier: 140, needs: ["trailer"], manualReview: true },
        ],
      },
      {
        id: "photos",
        title: "Show the junk",
        type: "photo_upload",
        minPhotos: 2,
        options: [
          { id: "pile", label: "The pile" },
          { id: "access", label: "How we get to it" },
        ],
      },
    ],
  },
  {
    id: "handyman",
    name: "Handyman",
    category: "Inside",
    from: 89,
    photo: "/photos/arrive.jpg",
    base: 89,
    baseMinutes: 60,
    questions: [
      {
        id: "lot_size",
        title: "Scope",
        type: "choice",
        options: [
          { id: "one", label: "One small job", priceModifier: 0 },
          { id: "list", label: "A punch list", priceModifier: 40 },
        ],
      },
      {
        id: "photos",
        title: "Photos of the issue",
        type: "photo_upload",
        minPhotos: 1,
        options: [{ id: "issue", label: "The thing" }],
      },
    ],
  },
  {
    id: "paint",
    name: "Paint (quote)",
    category: "Inside",
    from: 0,
    photo: "/photos/arrive.jpg",
    base: 0,
    baseMinutes: 0,
    questions: [
      {
        id: "lot_size",
        title: "What are we painting?",
        type: "choice",
        options: [
          { id: "room", label: "One room" },
          { id: "multi", label: "A few rooms" },
          { id: "exterior", label: "Exterior", needs: ["ladder"] },
        ],
      },
      {
        id: "photos",
        title: "Room / elevation photos",
        type: "photo_upload",
        minPhotos: 2,
        options: [
          { id: "a", label: "Photo 1" },
          { id: "b", label: "Photo 2" },
        ],
      },
    ],
  },
];

const ALIAS: Record<string, ServiceId> = {
  driveway: "wash",
  housewash: "wash",
};

export function resolveServiceId(id: string): ServiceId {
  return (ALIAS[id] ?? id) as ServiceId;
}

export function specById(id: string) {
  const resolved = resolveServiceId(id);
  return SPECS.find((s) => s.id === resolved);
}

export function popularSpecs() {
  return SPECS.filter((s) => s.id !== "paint");
}
