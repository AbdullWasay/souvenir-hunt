import type { HintDoc, HuntDoc, StepDoc } from "./types";

/** Raw step shape from MongoDB (legacy admin seed + current schema). */
export type RawStepDoc = Partial<StepDoc> & {
  _id?: string | { toString(): string };
  answers?: string[];
  hint?: string;
  storyIntro?: string;
  storyBody?: string[];
  cardTitle?: string;
};

function splitParagraphs(text: string | undefined): string[] | undefined {
  if (!text?.trim()) return undefined;
  const parts = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return parts.length > 0 ? parts : undefined;
}

function textParts(raw: RawStepDoc, field: "story" | "history" | "clue" | "guide"): string[] {
  const partsKey = `${field}Parts` as const;
  const explicit = raw[partsKey];
  if (Array.isArray(explicit) && explicit.length > 0) return explicit;

  if (field === "story" && raw.storyIntro) {
    const body = Array.isArray(raw.storyBody) ? raw.storyBody : [];
    return [raw.storyIntro, ...body].filter(Boolean);
  }

  const text = raw[field];
  return splitParagraphs(text) ?? (text ? [text] : []);
}

export function normalizeStep(raw: RawStepDoc, index: number): StepDoc {
  const id =
    raw.id ??
    (typeof raw._id === "string" ? raw._id : raw._id != null ? String(raw._id) : `step-${index + 1}`);

  const answerList = [
    ...(raw.answer?.trim() ? [raw.answer.trim()] : []),
    ...(Array.isArray(raw.answers) ? raw.answers.map((a) => a.trim()).filter(Boolean) : []),
    ...(Array.isArray(raw.acceptedAnswers) ? raw.acceptedAnswers.map((a) => a.trim()).filter(Boolean) : []),
  ];
  const acceptedAnswers = [...new Set(answerList.map((a) => a.toLowerCase()))];

  let hints: HintDoc[] = Array.isArray(raw.hints) && raw.hints.length > 0 ? raw.hints : [];
  if (!hints.length && raw.hint?.trim()) {
    hints = [{ id: `${id}-hint-0`, text: raw.hint.trim(), cost: 1 }];
  }
  hints = hints.map((h, i) => ({
    id: h.id || `${id}-hint-${i}`,
    text: h.text?.trim() || "",
    cost: h.cost ?? 1,
  }));

  const storyParts = textParts(raw, "story");
  const historyParts = textParts(raw, "history");
  const clueParts = textParts(raw, "clue");
  const guideParts = textParts(raw, "guide");

  return {
    id,
    title: raw.title || raw.cardTitle || `Step ${index + 1}`,
    clue: raw.clue?.trim() || clueParts.join("\n\n"),
    answer: acceptedAnswers[0] ?? "",
    acceptedAnswers,
    location: raw.location,
    imageUrl: raw.imageUrl,
    hints,
    story: raw.story ?? (storyParts.length ? storyParts.join("\n\n") : undefined),
    history: raw.history ?? (historyParts.length ? historyParts.join("\n\n") : undefined),
    guide: raw.guide ?? (guideParts.length ? guideParts.join("\n\n") : undefined),
    clueParts: clueParts.length ? clueParts : undefined,
    storyParts: storyParts.length ? storyParts : undefined,
    historyParts: historyParts.length ? historyParts : undefined,
    guideParts: guideParts.length ? guideParts : undefined,
  };
}

export function normalizeSteps(steps: RawStepDoc[] | undefined): StepDoc[] {
  if (!Array.isArray(steps)) return [];
  return steps.map((step, index) => normalizeStep(step, index));
}

export function stepAcceptsAnswer(step: StepDoc | undefined, input: string): boolean {
  if (!step) return false;
  const normalized = input.trim().toLowerCase();
  if (!normalized) return false;
  const accepted =
    step.acceptedAnswers && step.acceptedAnswers.length > 0
      ? step.acceptedAnswers
      : step.answer
        ? [step.answer.trim().toLowerCase()]
        : [];
  return accepted.includes(normalized);
}

export function stepFieldParagraphs(
  step: StepDoc | undefined,
  field: "story" | "history" | "clue" | "guide",
): string[] {
  if (!step) return [];
  const partsKey = `${field}Parts` as const;
  const parts = step[partsKey];
  if (Array.isArray(parts) && parts.length > 0) return parts;
  const text = step[field];
  if (!text) return [];
  return text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
}

export function newStep(): StepDoc {
  return {
    id: Math.random().toString(36).slice(2, 10),
    title: "New step",
    clue: "",
    answer: "",
    location: "",
    hints: [],
  };
}

export function newHuntTemplate(): Omit<HuntDoc, "_id"> & { id?: string } {
  const now = Date.now();
  return {
    slug: `new-hunt-${now}`,
    name: "Untitled Hunt",
    country: "",
    city: "",
    description: "",
    status: "coming_soon",
    priceCents: 3900,
    currency: "eur",
    durationLabel: "1.5–2 hrs",
    playersLabel: "1–6 players",
    locationLabel: "",
    published: false,
    steps: [],
    createdAt: now,
    updatedAt: now,
  };
}
