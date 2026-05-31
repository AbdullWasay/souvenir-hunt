import { MongoClient, type Db, type Collection } from "mongodb";
import { env } from "./env";
import type { HuntDoc, HuntProgressDoc, OrderDoc, StepDoc } from "./types";

const globalForMongo = globalThis as typeof globalThis & {
  _mongoClient?: MongoClient;
  _mongoDb?: Db;
};

export async function getDb(): Promise<Db> {
  if (globalForMongo._mongoDb) return globalForMongo._mongoDb;

  const client = globalForMongo._mongoClient ?? new MongoClient(env.mongoUri);
  if (!globalForMongo._mongoClient) {
    await client.connect();
    globalForMongo._mongoClient = client;
  }
  globalForMongo._mongoDb = client.db();
  return globalForMongo._mongoDb;
}

export async function huntsCollection(): Promise<Collection<HuntDoc>> {
  const db = await getDb();
  return db.collection<HuntDoc>("hunts");
}

export async function ordersCollection(): Promise<Collection<OrderDoc>> {
  const db = await getDb();
  return db.collection<OrderDoc>("orders");
}

export async function progressCollection(): Promise<Collection<HuntProgressDoc>> {
  const db = await getDb();
  return db.collection<HuntProgressDoc>("hunt_progress");
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const SPLIT_HUNT_IMAGE_URL = "/assets/branding/split-hunt-image.svg";
const EMPERORS_STEPS_VERSION = 11;

export const STEP7_STORY_PARTS = [
  "The last answer is not hidden in architecture. It waits at the edge of the experience, where the route becomes something you can hold rather than only remember.",
  "By now the city has done its work. It has slowed you down, sharpened your eye, and turned a simple walk into a story with weight.",
  "The reward matters because it closes the loop. Memory becomes object. Discovery becomes proof.",
];

export const STEP7_HISTORY_PARTS = [
  "Souvenir culture often reduces place into something generic. This ending is meant to do the opposite and tie the object back to the journey itself.",
  "Each location in the hunt is chosen because it reveals how politics, ritual, and architecture shaped the city over time.",
];

export const STEP7_CLUE_PARTS = [
  "Read the location carefully, scan the nearby details, and enter the answer only once you are sure you have found the right symbol, word, or landmark.",
  "Enter the code word you receive when you collect the souvenir treasure.",
];

export const STEP7_GUIDE_PARTS = [
  "This final clue only resolves once pickup is complete. If you are at the end, check every detail you have collected and be ready to confirm the reward word.",
  "Slow down, scan the surroundings, and trust what feels deliberately placed. The hunt rewards careful observation more than speed.",
];

const STEP7_STORY = STEP7_STORY_PARTS.join("\n\n");
const STEP7_HISTORY = STEP7_HISTORY_PARTS.join("\n\n");
const STEP7_CLUE = STEP7_CLUE_PARTS.join("\n\n");
const STEP7_GUIDE = STEP7_GUIDE_PARTS.join("\n\n");

function step7ContentComplete(step: StepDoc | undefined): boolean {
  if (!step) return false;
  if (Array.isArray(step.historyParts) && step.historyParts.length >= 2) {
    return step.clueParts?.[1]?.includes("souvenir treasure") ?? false;
  }
  return (
    (step.history?.includes("Each location in the hunt") ?? false) &&
    (step.clue?.includes("Read the location carefully") ?? false) &&
    (step.guide?.includes("Slow down, scan the surroundings") ?? false)
  );
}

export const STEP6_STORY_PARTS = [
  "Eventually every imperial story meets the open air. Salt changes the mood of the hunt. The city loosens. What was enclosed becomes public again.",
  "Now the route widens. Cafes, palms, and voices take over. The final movement is not quieter, only broader, as if the city has decided to reveal itself at last.",
  "Some endings do not feel like conclusions. They feel like release.",
];

export const STEP6_HISTORY_PARTS = [
  "Split's waterfront became the city's outward face, reshaping how the old palace connected to trade, leisure, and everyday life.",
  "Each location in the hunt is chosen because it reveals how politics, ritual, and architecture shaped the city over time.",
];

export const STEP6_CLUE_PARTS = [
  "Read the location carefully, scan the nearby details, and enter the answer only once you are sure you have found the right symbol, word, or landmark.",
  "What waterfront promenade in Split marks the final stretch of the hunt?",
];

export const STEP6_GUIDE_PARTS = [
  "Notice the shift in atmosphere. When the city suddenly opens, the clue usually points to the place everyone recognizes by feel before name.",
  "Slow down, scan the surroundings, and trust what feels deliberately placed. The hunt rewards careful observation more than speed.",
];

const STEP6_STORY = STEP6_STORY_PARTS.join("\n\n");
const STEP6_HISTORY = STEP6_HISTORY_PARTS.join("\n\n");
const STEP6_CLUE = STEP6_CLUE_PARTS.join("\n\n");
const STEP6_GUIDE = STEP6_GUIDE_PARTS.join("\n\n");

function step6ContentComplete(step: StepDoc | undefined): boolean {
  if (!step) return false;
  if (Array.isArray(step.historyParts) && step.historyParts.length >= 2) {
    return step.clueParts?.[1]?.includes("waterfront promenade") ?? false;
  }
  return (
    (step.history?.includes("Each location in the hunt") ?? false) &&
    (step.clue?.includes("Read the location carefully") ?? false) &&
    (step.guide?.includes("Slow down, scan the surroundings") ?? false)
  );
}

export const STEP5_STORY_PARTS = [
  "Below every polished residence lies the machinery that made the surface possible. Storage, service, secrecy. The rooms beneath the palace hold the weight of everything above them.",
  "It is cooler here, more patient. Sound changes. Time feels slower. Hidden places rarely shout their purpose; they reveal it through atmosphere.",
  "By this point, the hunt should feel different from a walk. You are no longer passing through the city. You are descending into it.",
];

export const STEP5_HISTORY_PARTS = [
  "The substructures beneath Diocletian's apartments preserved the palace plan and supported life above. Today they are among the clearest surviving architectural records of the complex.",
  "Each location in the hunt is chosen because it reveals how politics, ritual, and architecture shaped the city over time.",
];

export const STEP5_CLUE_PARTS = [
  "Read the location carefully, scan the nearby details, and enter the answer only once you are sure you have found the right symbol, word, or landmark.",
  "What lies beneath the palace halls where the hunt now leads you?",
];

export const STEP5_GUIDE_PARTS = [
  "Look for what is structural rather than decorative. Underground clues often reward attention to function instead of ornament.",
  "Slow down, scan the surroundings, and trust what feels deliberately placed. The hunt rewards careful observation more than speed.",
];

const STEP5_STORY = STEP5_STORY_PARTS.join("\n\n");
const STEP5_HISTORY = STEP5_HISTORY_PARTS.join("\n\n");
const STEP5_CLUE = STEP5_CLUE_PARTS.join("\n\n");
const STEP5_GUIDE = STEP5_GUIDE_PARTS.join("\n\n");

function step5ContentComplete(step: StepDoc | undefined): boolean {
  if (!step) return false;
  if (Array.isArray(step.historyParts) && step.historyParts.length >= 2) {
    return step.clueParts?.[1]?.includes("beneath the palace halls") ?? false;
  }
  return (
    (step.history?.includes("Each location in the hunt") ?? false) &&
    (step.clue?.includes("Read the location carefully") ?? false) &&
    (step.guide?.includes("Slow down, scan the surroundings") ?? false)
  );
}

export const STEP4_STORY_PARTS = [
  "Ceremonial spaces are designed to magnify presence. Every sound feels chosen. Every stone seems placed to turn a ruler into something larger than human scale.",
  "But monuments outlive the people who commission them. What remains are the traces: columns, polished steps, and old creatures imported from older worlds.",
  "Some clues are hidden in decoration because power always liked to surround itself with symbols that seemed eternal.",
];

export const STEP4_HISTORY_PARTS = [
  "The Peristyle was the ceremonial heart of Diocletian's Palace. Imported Egyptian sphinxes connected Roman authority to even older imperial traditions.",
  "Each location in the hunt is chosen because it reveals how politics, ritual, and architecture shaped the city over time.",
];

export const STEP4_CLUE_PARTS = [
  "Read the location carefully, scan the nearby details, and enter the answer only once you are sure you have found the right symbol, word, or landmark.",
  "What ancient creature guards the Peristyle near the steps?",
];

export const STEP4_GUIDE_PARTS = [
  "Let your eyes travel upward and outward. In ceremonial areas, the answer is often visible from a distance before it feels understandable up close.",
  "Slow down, scan the surroundings, and trust what feels deliberately placed. The hunt rewards careful observation more than speed.",
];

const STEP4_STORY = STEP4_STORY_PARTS.join("\n\n");
const STEP4_HISTORY = STEP4_HISTORY_PARTS.join("\n\n");
const STEP4_CLUE = STEP4_CLUE_PARTS.join("\n\n");
const STEP4_GUIDE = STEP4_GUIDE_PARTS.join("\n\n");

function step4ContentComplete(step: StepDoc | undefined): boolean {
  if (!step) return false;
  if (Array.isArray(step.historyParts) && step.historyParts.length >= 2) {
    return step.clueParts?.[1]?.includes("Peristyle near the steps") ?? false;
  }
  return (
    (step.history?.includes("Each location in the hunt") ?? false) &&
    (step.clue?.includes("Read the location carefully") ?? false) &&
    (step.guide?.includes("Slow down, scan the surroundings") ?? false)
  );
}

export const STEP3_STORY_PARTS = [
  "A straight line through stone can feel innocent, but power loves a clear route. The Emperor's path was never only a street; it was a statement about movement, vision, and control.",
  "To walk it now is to inherit that geometry. Walls narrow your attention. Shadows guide your pace. What once directed officials and guards now directs curious players and slow-moving tourists.",
  "The clue is not only where to go next. It is how the city still teaches you to move through it.",
];

export const STEP3_HISTORY_PARTS = [
  "The cardo was a defining axis in Roman urban planning. In Split, this route still shapes how people cross the palace and understand its spatial order.",
  "Each location in the hunt is chosen because it reveals how politics, ritual, and architecture shaped the city over time.",
];

export const STEP3_CLUE_PARTS = [
  "Read the location carefully, scan the nearby details, and enter the answer only once you are sure you have found the right symbol, word, or landmark.",
  "Walk the main north-south street. What ancient urban route are you following?",
];

export const STEP3_GUIDE_PARTS = [
  "Follow the most natural north-south line and trust the structure around you. Roman planning often feels logical once you stop resisting it.",
  "Slow down, scan the surroundings, and trust what feels deliberately placed. The hunt rewards careful observation more than speed.",
];

const STEP3_STORY = STEP3_STORY_PARTS.join("\n\n");
const STEP3_HISTORY = STEP3_HISTORY_PARTS.join("\n\n");
const STEP3_CLUE = STEP3_CLUE_PARTS.join("\n\n");
const STEP3_GUIDE = STEP3_GUIDE_PARTS.join("\n\n");

function step3ContentComplete(step: StepDoc | undefined): boolean {
  if (!step) return false;
  if (Array.isArray(step.historyParts) && step.historyParts.length >= 2) {
    return step.clueParts?.[0]?.includes("Read the location carefully") ?? false;
  }
  return (
    (step.history?.includes("Each location in the hunt") ?? false) &&
    (step.clue?.includes("Read the location carefully") ?? false) &&
    (step.guide?.includes("Slow down, scan the surroundings") ?? false)
  );
}

export const STEP2_STORY_PARTS = [
  "At first, nothing seemed wrong. That is how these things begin, not with war, not with betrayal, but with small shifts. The kind you would not notice unless you were looking for them.",
  "And Diocletian was always looking. One ruler began to gather more soldiers than he needed. Another delayed decisions, not out of caution, but calculation.",
  "Letters between them became colder. More careful. Words chosen not for truth, but for advantage. Even stone gates can feel the moment when trust starts to close.",
];

export const STEP2_HISTORY_PARTS = [
  "Roman city gates were more than entries; they announced hierarchy, protection, and control. The northern gate of Diocletian's Palace framed the edge between imperial order and the outer world.",
  "Each location in the hunt is chosen because it reveals how politics, ritual, and architecture shaped the city over time.",
];

export const STEP2_CLUE_PARTS = [
  "Read the location carefully, scan the nearby details, and enter the answer only once you are sure you have found the right symbol, word, or landmark.",
  "Stand before the Golden Gate. What metal is named in the gate's title?",
];

export const STEP2_GUIDE_PARTS = [
  "Stand still for a moment and take in the full structure. Look for names, materials, and symbols that feel obvious only after you pause long enough to notice them.",
  "Slow down, scan the surroundings, and trust what feels deliberately placed. The hunt rewards careful observation more than speed.",
];

const STEP2_STORY = STEP2_STORY_PARTS.join("\n\n");
const STEP2_HISTORY = STEP2_HISTORY_PARTS.join("\n\n");
const STEP2_CLUE = STEP2_CLUE_PARTS.join("\n\n");
const STEP2_GUIDE = STEP2_GUIDE_PARTS.join("\n\n");

function step2ContentComplete(step: StepDoc | undefined): boolean {
  if (!step) return false;
  if (Array.isArray(step.historyParts) && step.historyParts.length >= 2) {
    return step.historyParts[1]?.includes("politics, ritual, and architecture") ?? false;
  }
  return (
    (step.history?.includes("Each location in the hunt") ?? false) &&
    (step.clue?.includes("Read the location carefully") ?? false) &&
    (step.guide?.includes("Slow down, scan the surroundings") ?? false)
  );
}

export const STEP1_STORY_PARTS = [
  "Every path begins with something larger than it first appears. A figure in bronze, polished by habit and hope, becomes the first sign that this city remembers more than it tells.",
  "People pass it every day, touching the same place without always knowing why. That is how memory survives here, not in museums alone, but in gestures repeated until they become tradition.",
  "Before palaces, gates, and ceremonies, there is the quiet moment of noticing. The hunt starts when you begin to look at the city the way it looks back at you.",
];

export const STEP1_HISTORY_PARTS = [
  "The opening clue introduces Split as a place where history lives in public ritual. Bronze, statues, and repeated gestures become part of how the city carries memory forward.",
  "Each location in the hunt is chosen because it reveals how politics, ritual, and architecture shaped the city over time.",
];

export const STEP1_CLUE_PARTS = [
  "Read the location carefully, scan the nearby details, and enter the answer only once you are sure you have found the right symbol, word, or landmark.",
  "Find the great statue at the edge of the old city. What is the first name of the bishop this giant represents?",
];

export const STEP1_GUIDE_PARTS = [
  "Start calmly. Read the clue once, then scan the space around you for a landmark that locals and visitors interact with instinctively.",
  "Slow down, scan the surroundings, and trust what feels deliberately placed. The hunt rewards careful observation more than speed.",
];

const STEP1_STORY = STEP1_STORY_PARTS.join("\n\n");
const STEP1_HISTORY = STEP1_HISTORY_PARTS.join("\n\n");
const STEP1_CLUE = STEP1_CLUE_PARTS.join("\n\n");
const STEP1_GUIDE = STEP1_GUIDE_PARTS.join("\n\n");

function step1ContentComplete(step: StepDoc | undefined): boolean {
  if (!step) return false;
  if (Array.isArray(step.historyParts) && step.historyParts.length >= 2) return true;
  return (
    (step.history?.includes("Each location in the hunt") ?? false) &&
    (step.clue?.includes("bishop this giant") ?? false) &&
    (step.guide?.includes("Slow down, scan the surroundings") ?? false)
  );
}

function mergeEmperorSteps(existing: StepDoc[] | undefined): StepDoc[] {
  const fresh = emperorsSecretSteps();
  if (!existing?.length) return fresh;
  return fresh.map((step, i) => ({
    ...step,
    id: existing[i]?.id ?? step.id,
  }));
}

function emperorsSecretSteps() {
  return [
    {
      id: uid(),
      title: "Step 1: Stone Giant",
      location: "Golden Gate / Gregory of Nin statue",
      story: STEP1_STORY,
      storyParts: STEP1_STORY_PARTS,
      history: STEP1_HISTORY,
      historyParts: STEP1_HISTORY_PARTS,
      guide: STEP1_GUIDE,
      guideParts: STEP1_GUIDE_PARTS,
      clue: STEP1_CLUE,
      clueParts: STEP1_CLUE_PARTS,
      answer: "grgur",
      hints: [{ id: uid(), text: "Tourists rub the big toe for good fortune.", cost: 1 }],
    },
    {
      id: uid(),
      title: "Step 2: The Northern Gate",
      location: "Golden Gate",
      story: STEP2_STORY,
      storyParts: STEP2_STORY_PARTS,
      history: STEP2_HISTORY,
      historyParts: STEP2_HISTORY_PARTS,
      guide: STEP2_GUIDE,
      guideParts: STEP2_GUIDE_PARTS,
      clue: STEP2_CLUE,
      clueParts: STEP2_CLUE_PARTS,
      answer: "gold",
      hints: [{ id: uid(), text: "It shines in the name, even if not in the stone.", cost: 1 }],
    },
    {
      id: uid(),
      title: "Step 3: The Emperor's Path",
      location: "Cardo route through the palace",
      story: STEP3_STORY,
      storyParts: STEP3_STORY_PARTS,
      history: STEP3_HISTORY,
      historyParts: STEP3_HISTORY_PARTS,
      guide: STEP3_GUIDE,
      guideParts: STEP3_GUIDE_PARTS,
      clue: STEP3_CLUE,
      clueParts: STEP3_CLUE_PARTS,
      answer: "cardo",
      hints: [{ id: uid(), text: "Roman cities often had a cardo and a decumanus.", cost: 1 }],
    },
    {
      id: uid(),
      title: "Step 4: Court of Echoes",
      location: "Peristyle / palace Egyptian relic",
      story: STEP4_STORY,
      storyParts: STEP4_STORY_PARTS,
      history: STEP4_HISTORY,
      historyParts: STEP4_HISTORY_PARTS,
      guide: STEP4_GUIDE,
      guideParts: STEP4_GUIDE_PARTS,
      clue: STEP4_CLUE,
      clueParts: STEP4_CLUE_PARTS,
      answer: "sphinx",
      hints: [{ id: uid(), text: "It came from Egypt long before tourists came to Split.", cost: 1 }],
    },
    {
      id: uid(),
      title: "Step 5: Beneath the Palace",
      location: "Substructures under Diocletian's Palace",
      story: STEP5_STORY,
      storyParts: STEP5_STORY_PARTS,
      history: STEP5_HISTORY,
      historyParts: STEP5_HISTORY_PARTS,
      guide: STEP5_GUIDE,
      guideParts: STEP5_GUIDE_PARTS,
      clue: STEP5_CLUE,
      clueParts: STEP5_CLUE_PARTS,
      answer: "cellars",
      hints: [{ id: uid(), text: "Think stone halls under the emperor's apartments.", cost: 1 }],
    },
    {
      id: uid(),
      title: "Step 6: Toward the Sea",
      location: "Waterfront promenade",
      story: STEP6_STORY,
      storyParts: STEP6_STORY_PARTS,
      history: STEP6_HISTORY,
      historyParts: STEP6_HISTORY_PARTS,
      guide: STEP6_GUIDE,
      guideParts: STEP6_GUIDE_PARTS,
      clue: STEP6_CLUE,
      clueParts: STEP6_CLUE_PARTS,
      answer: "riva",
      hints: [{ id: uid(), text: "Palms, cafes, and open sea define this place.", cost: 1 }],
    },
    {
      id: uid(),
      title: "Step 7: Final Reward",
      location: "Souvenir collection point",
      story: STEP7_STORY,
      storyParts: STEP7_STORY_PARTS,
      history: STEP7_HISTORY,
      historyParts: STEP7_HISTORY_PARTS,
      guide: STEP7_GUIDE,
      guideParts: STEP7_GUIDE_PARTS,
      clue: STEP7_CLUE,
      clueParts: STEP7_CLUE_PARTS,
      answer: "souvenir",
      hints: [{ id: uid(), text: "This final answer is confirmed when the reward is in your hands.", cost: 1 }],
    },
  ];
}

function comingSoonSeed(now: number): HuntDoc[] {
  return [
    {
      slug: "athens",
      name: "Athens",
      country: "Greece",
      city: "Athens",
      description: "New hunts coming soon.",
      status: "coming_soon",
      priceCents: 0,
      currency: "eur",
      durationLabel: "TBA",
      playersLabel: "1–6 players",
      locationLabel: "Athens",
      published: true,
      steps: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "santorini",
      name: "Santorini",
      country: "Greece",
      city: "Santorini",
      description: "New hunts coming soon.",
      status: "coming_soon",
      priceCents: 0,
      currency: "eur",
      durationLabel: "TBA",
      playersLabel: "1–6 players",
      locationLabel: "Santorini",
      published: true,
      steps: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "rome",
      name: "Rome",
      country: "Italy",
      city: "Rome",
      description: "New hunts coming soon.",
      status: "coming_soon",
      priceCents: 0,
      currency: "eur",
      durationLabel: "TBA",
      playersLabel: "1–6 players",
      locationLabel: "Rome",
      published: true,
      steps: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "florence",
      name: "Florence",
      country: "Italy",
      city: "Florence",
      description: "New hunts coming soon.",
      status: "coming_soon",
      priceCents: 0,
      currency: "eur",
      durationLabel: "TBA",
      playersLabel: "1–6 players",
      locationLabel: "Florence",
      published: true,
      steps: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "barcelona",
      name: "Barcelona",
      country: "Spain",
      city: "Barcelona",
      description: "New hunts coming soon.",
      status: "coming_soon",
      priceCents: 0,
      currency: "eur",
      durationLabel: "TBA",
      playersLabel: "1–6 players",
      locationLabel: "Barcelona",
      published: true,
      steps: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "seville",
      name: "Seville",
      country: "Spain",
      city: "Seville",
      description: "New hunts coming soon.",
      status: "coming_soon",
      priceCents: 0,
      currency: "eur",
      durationLabel: "TBA",
      playersLabel: "1–6 players",
      locationLabel: "Seville",
      published: true,
      steps: [],
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export async function ensureSeedHunts() {
  const hunts = await huntsCollection();
  const count = await hunts.countDocuments();
  const now = Date.now();

  if (count > 0) {
    const emperor = await hunts.findOne({ slug: "emperors-secret" });
    if (!emperor) {
      await hunts.insertOne({
        slug: "emperors-secret",
        name: "The Emperor's Secret",
        country: "Croatia",
        city: "Split",
        heroImageUrl: SPLIT_HUNT_IMAGE_URL,
        description:
          "A premium self-guided clue hunt through Split inspired by Diocletian, hidden symbols, and a real souvenir treasure at the end.",
        status: "live",
        priceCents: 3900,
        currency: "eur",
        durationLabel: "1.5–2.5 hrs",
        playersLabel: "1–6 players",
        locationLabel: "Old Town / Golden Gate area",
        published: true,
        steps: emperorsSecretSteps(),
        stepsContentVersion: EMPERORS_STEPS_VERSION,
        createdAt: now,
        updatedAt: now,
      });
      return;
    }

    const stepsVersion = emperor.stepsContentVersion ?? 1;
    const needsUpgrade =
      stepsVersion < EMPERORS_STEPS_VERSION ||
      !Array.isArray(emperor.steps) ||
      emperor.steps.length < 7 ||
      emperor.steps.some((s) => !s.story || !s.history || !s.guide) ||
      !step1ContentComplete(emperor.steps[0]) ||
      !step2ContentComplete(emperor.steps[1]) ||
      !step3ContentComplete(emperor.steps[2]) ||
      !step4ContentComplete(emperor.steps[3]) ||
      !step5ContentComplete(emperor.steps[4]) ||
      !step6ContentComplete(emperor.steps[5]) ||
      !step7ContentComplete(emperor.steps[6]);

    const contentPatch: Record<string, unknown> = {};
    if (!step1ContentComplete(emperor.steps?.[0])) {
      contentPatch["steps.0.story"] = STEP1_STORY;
      contentPatch["steps.0.storyParts"] = STEP1_STORY_PARTS;
      contentPatch["steps.0.history"] = STEP1_HISTORY;
      contentPatch["steps.0.historyParts"] = STEP1_HISTORY_PARTS;
      contentPatch["steps.0.clue"] = STEP1_CLUE;
      contentPatch["steps.0.clueParts"] = STEP1_CLUE_PARTS;
      contentPatch["steps.0.guide"] = STEP1_GUIDE;
      contentPatch["steps.0.guideParts"] = STEP1_GUIDE_PARTS;
    }
    if (!step2ContentComplete(emperor.steps?.[1])) {
      contentPatch["steps.1.history"] = STEP2_HISTORY;
      contentPatch["steps.1.historyParts"] = STEP2_HISTORY_PARTS;
      contentPatch["steps.1.clue"] = STEP2_CLUE;
      contentPatch["steps.1.clueParts"] = STEP2_CLUE_PARTS;
      contentPatch["steps.1.guide"] = STEP2_GUIDE;
      contentPatch["steps.1.guideParts"] = STEP2_GUIDE_PARTS;
      contentPatch["steps.1.answers"] = ["gold", "golden"];
      contentPatch["steps.1.hint"] = "It shines in the name, even if not in the stone.";
    }
    if (!step3ContentComplete(emperor.steps?.[2])) {
      contentPatch["steps.2.history"] = STEP3_HISTORY;
      contentPatch["steps.2.historyParts"] = STEP3_HISTORY_PARTS;
      contentPatch["steps.2.clue"] = STEP3_CLUE;
      contentPatch["steps.2.clueParts"] = STEP3_CLUE_PARTS;
      contentPatch["steps.2.guide"] = STEP3_GUIDE;
      contentPatch["steps.2.guideParts"] = STEP3_GUIDE_PARTS;
      contentPatch["steps.2.answers"] = ["cardo", "cardo street"];
      contentPatch["steps.2.hint"] = "Roman cities often had a cardo and a decumanus.";
    }
    if (!step4ContentComplete(emperor.steps?.[3])) {
      contentPatch["steps.3.history"] = STEP4_HISTORY;
      contentPatch["steps.3.historyParts"] = STEP4_HISTORY_PARTS;
      contentPatch["steps.3.clue"] = STEP4_CLUE;
      contentPatch["steps.3.clueParts"] = STEP4_CLUE_PARTS;
      contentPatch["steps.3.guide"] = STEP4_GUIDE;
      contentPatch["steps.3.guideParts"] = STEP4_GUIDE_PARTS;
      contentPatch["steps.3.answers"] = ["sphinx", "egyptian sphinx"];
      contentPatch["steps.3.hint"] = "It came from Egypt long before tourists came to Split.";
    }
    if (!step5ContentComplete(emperor.steps?.[4])) {
      contentPatch["steps.4.history"] = STEP5_HISTORY;
      contentPatch["steps.4.historyParts"] = STEP5_HISTORY_PARTS;
      contentPatch["steps.4.clue"] = STEP5_CLUE;
      contentPatch["steps.4.clueParts"] = STEP5_CLUE_PARTS;
      contentPatch["steps.4.guide"] = STEP5_GUIDE;
      contentPatch["steps.4.guideParts"] = STEP5_GUIDE_PARTS;
      contentPatch["steps.4.answers"] = ["cellars", "basement", "underground cellars"];
      contentPatch["steps.4.hint"] = "Think stone halls under the emperor's apartments.";
    }
    if (!step6ContentComplete(emperor.steps?.[5])) {
      contentPatch["steps.5.history"] = STEP6_HISTORY;
      contentPatch["steps.5.historyParts"] = STEP6_HISTORY_PARTS;
      contentPatch["steps.5.clue"] = STEP6_CLUE;
      contentPatch["steps.5.clueParts"] = STEP6_CLUE_PARTS;
      contentPatch["steps.5.guide"] = STEP6_GUIDE;
      contentPatch["steps.5.guideParts"] = STEP6_GUIDE_PARTS;
      contentPatch["steps.5.answers"] = ["riva", "the riva"];
      contentPatch["steps.5.hint"] = "Palms, cafes, and open sea define this place.";
    }
    if (!step7ContentComplete(emperor.steps?.[6])) {
      contentPatch["steps.6.history"] = STEP7_HISTORY;
      contentPatch["steps.6.historyParts"] = STEP7_HISTORY_PARTS;
      contentPatch["steps.6.clue"] = STEP7_CLUE;
      contentPatch["steps.6.clueParts"] = STEP7_CLUE_PARTS;
      contentPatch["steps.6.guide"] = STEP7_GUIDE;
      contentPatch["steps.6.guideParts"] = STEP7_GUIDE_PARTS;
      contentPatch["steps.6.answers"] = ["souvenir", "treasure"];
      contentPatch["steps.6.hint"] = "This final answer is confirmed when the reward is in your hands.";
    }
    if (stepsVersion < 11) {
      contentPatch["steps.1.story"] = STEP2_STORY;
      contentPatch["steps.1.storyParts"] = STEP2_STORY_PARTS;
      contentPatch["steps.2.story"] = STEP3_STORY;
      contentPatch["steps.2.storyParts"] = STEP3_STORY_PARTS;
      contentPatch["steps.3.story"] = STEP4_STORY;
      contentPatch["steps.3.storyParts"] = STEP4_STORY_PARTS;
      contentPatch["steps.4.story"] = STEP5_STORY;
      contentPatch["steps.4.storyParts"] = STEP5_STORY_PARTS;
      contentPatch["steps.5.story"] = STEP6_STORY;
      contentPatch["steps.5.storyParts"] = STEP6_STORY_PARTS;
      contentPatch["steps.6.story"] = STEP7_STORY;
      contentPatch["steps.6.storyParts"] = STEP7_STORY_PARTS;
    }
    if (Object.keys(contentPatch).length > 0) {
      contentPatch.stepsContentVersion = EMPERORS_STEPS_VERSION;
    }

    await hunts.updateOne(
      { _id: emperor._id },
      {
        $set: {
          // Keep one bookable hunt always available.
          name: "The Emperor's Secret",
          country: "Croatia",
          city: "Split",
          heroImageUrl: SPLIT_HUNT_IMAGE_URL,
          description:
            "A premium self-guided clue hunt through Split inspired by Diocletian, hidden symbols, and a real souvenir treasure at the end.",
          priceCents: 3900,
          currency: "eur",
          durationLabel: "1.5–2.5 hrs",
          playersLabel: "1–6 players",
          published: true,
          status: "live",
          locationLabel: "Old Town / Golden Gate area",
          ...(needsUpgrade && Object.keys(contentPatch).length === 0
            ? { steps: mergeEmperorSteps(emperor.steps), stepsContentVersion: EMPERORS_STEPS_VERSION }
            : {}),
          ...contentPatch,
          updatedAt: now,
        },
      },
    );
    const comingSoon = comingSoonSeed(now);
    for (const hunt of comingSoon) {
      const { createdAt, ...rest } = hunt;
      await hunts.updateOne(
        { slug: hunt.slug },
        {
          $set: {
            ...rest,
            updatedAt: now,
          },
          $setOnInsert: { createdAt: now },
        },
        { upsert: true },
      );
    }

    // Keep catalog to 4 countries for now.
    await hunts.updateMany({ country: { $nin: ["Croatia", "Greece", "Italy", "Spain"] } }, { $set: { published: false, updatedAt: now } });
    return;
  }

  const seed: HuntDoc[] = [
    {
      slug: "emperors-secret",
      name: "The Emperor's Secret",
      country: "Croatia",
      city: "Split",
      heroImageUrl: SPLIT_HUNT_IMAGE_URL,
      description:
        "A premium self-guided clue hunt through Split inspired by Diocletian, hidden symbols, and a real souvenir treasure at the end.",
      status: "live",
      priceCents: 3900,
      currency: "eur",
      durationLabel: "1.5–2.5 hrs",
      playersLabel: "1–6 players",
      locationLabel: "Old Town / Golden Gate area",
      published: true,
      steps: emperorsSecretSteps(),
      stepsContentVersion: EMPERORS_STEPS_VERSION,
      createdAt: now,
      updatedAt: now,
    },
    ...comingSoonSeed(now),
  ];

  await hunts.insertMany(seed);
}
