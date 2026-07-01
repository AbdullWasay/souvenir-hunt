export type HuntStatus = "live" | "coming_soon" | "in_design" | "scouting";

export type HintDoc = {
  id: string;
  text: string;
  cost: number;
};

export type StepDoc = {
  id: string;
  title: string;
  clue: string;
  answer: string;
  location?: string;
  imageUrl?: string;
  hints: HintDoc[];
  story?: string;
  history?: string;
  guide?: string;
  /** All accepted spellings/variants for answer checking (lowercase). */
  acceptedAnswers?: string[];
  /** When set, play UI renders each entry as its own paragraph. */
  storyParts?: string[];
  historyParts?: string[];
  clueParts?: string[];
  guideParts?: string[];
};

export type HuntDoc = {
  _id?: string;
  slug: string;
  name: string;
  country: string;
  city: string;
  heroImageUrl?: string;
  description: string;
  status: HuntStatus;
  priceCents: number;
  currency: string;
  durationLabel: string;
  playersLabel: string;
  locationLabel: string;
  /** Opening narration shown before the game starts. */
  introText?: string;
  published: boolean;
  steps: StepDoc[];
  stepsContentVersion?: number;
  createdAt: number;
  updatedAt: number;
};

export type OrderDoc = {
  _id?: string;
  huntId: string;
  huntSlug: string;
  email: string;
  name: string;
  status: "pending" | "paid";
  stripeSessionId?: string;
  accessToken: string;
  paidAt?: number;
  createdAt: number;
};

export type HuntProgressDoc = {
  _id?: string;
  orderId: string;
  accessToken: string;
  huntId: string;
  currentStepIndex: number;
  completedStepIds: string[];
  /** Player finished the before/guidelines intro and started the game. */
  introCompleted?: boolean;
  /** Hints revealed on the current step (reset when advancing). */
  revealedHints?: number;
  updatedAt: number;
  closedAt?: number;
};

export function huntStatusLabel(status: HuntStatus): string {
  switch (status) {
    case "live":
      return "Live";
    case "coming_soon":
      return "Coming soon";
    case "in_design":
      return "In design";
    case "scouting":
      return "Scouting";
  }
}

export function isHuntBookable(status: HuntStatus): boolean {
  return status === "live";
}
