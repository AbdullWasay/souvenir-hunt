// Lightweight client-side store for the admin panel.
// Persists hunts/steps/hints to localStorage so the admin can prototype games
// without a backend. Swap to Lovable Cloud later if needed.

export type Hint = {
  id: string;
  text: string;
  /** Cost in points/seconds to reveal this hint. */
  cost: number;
};

export type Step = {
  id: string;
  title: string;
  clue: string;
  answer: string;
  location?: string;
  hints: Hint[];
};

export type Hunt = {
  id: string;
  name: string;
  city: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  durationMin: number;
  published: boolean;
  steps: Step[];
  createdAt: number;
  updatedAt: number;
};

const KEY = "souvenir-hunt:admin:v1";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function seed(): Hunt[] {
  const now = Date.now();
  return [
    {
      id: uid(),
      name: "Lisbon Tile Trail",
      city: "Lisbon",
      description: "A two-hour wander through Alfama hunting hand-painted azulejos.",
      difficulty: "easy",
      durationMin: 90,
      published: true,
      createdAt: now,
      updatedAt: now,
      steps: [
        {
          id: uid(),
          title: "The Yellow Tram",
          clue: "Find the tram older than your grandparents — count its number.",
          answer: "28",
          location: "Praça Martim Moniz",
          hints: [
            { id: uid(), text: "It runs the most photographed line in the city.", cost: 1 },
            { id: uid(), text: "A number between 20 and 30.", cost: 2 },
          ],
        },
        {
          id: uid(),
          title: "Saint of the Sailors",
          clue: "Whose statue watches the river with a stone fish at his feet?",
          answer: "Saint Anthony",
          location: "Sé de Lisboa",
          hints: [{ id: uid(), text: "Patron saint of lost things.", cost: 1 }],
        },
      ],
    },
  ];
}

export function loadHunts(): Hunt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as Hunt[];
  } catch {
    return [];
  }
}

export function saveHunts(hunts: Hunt[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(hunts));
}

export function newHunt(): Hunt {
  const now = Date.now();
  return {
    id: uid(),
    name: "Untitled Hunt",
    city: "",
    description: "",
    difficulty: "medium",
    durationMin: 60,
    published: false,
    steps: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function newStep(): Step {
  return { id: uid(), title: "New step", clue: "", answer: "", location: "", hints: [] };
}

export function newHint(): Hint {
  return { id: uid(), text: "", cost: 1 };
}
