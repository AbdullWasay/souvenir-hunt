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
const EMPERORS_STEP_IMAGE = "/assets/hunts/emperors-secret";
const EMPERORS_STEPS_VERSION = 13;

/** Filenames in steps-content-and-images / public/assets/hunts/emperors-secret */
const EMPERORS_STEP_IMAGE_FILES = [
  "Step 1 .png",
  "Step 2 clue .png",
  "Step 3.png",
  "Step 4.png",
  "Step 5.png",
  "Step 6.png",
  "Step 7.png",
  "Step 8.png",
] as const;

function emperorsStepImageUrl(index: number): string {
  const file = EMPERORS_STEP_IMAGE_FILES[index];
  if (!file) throw new Error(`Missing step image for index ${index}`);
  return `${EMPERORS_STEP_IMAGE}/${encodeURIComponent(file)}`;
}

const EMPERORS_INTRO_TEXT =
  "Listen carefully traveler, because this is the story long forgotten. Within these walls, something was hidden, not for the Empire, but for those who would dare to find. Follow the clues… and uncover Diocletian's secret.";

function hint(text: string) {
  return [{ id: uid(), text, cost: 1 }];
}

function mergeEmperorSteps(existing: StepDoc[] | undefined): StepDoc[] {
  const fresh = emperorsSecretSteps();
  if (!existing?.length) return fresh;
  return fresh.map((step, i) => ({
    ...step,
    id: existing[i]?.id ?? step.id,
  }));
}

function emperorsSecretSteps(): StepDoc[] {
  return [
    {
      id: uid(),
      title: "Bronze Giant",
      location: "Statue of Grgur Ninski",
      imageUrl: emperorsStepImageUrl(0),
      guide: "Hunt starts next to the Grgur Ninski statue.",
      guideParts: ["Hunt starts next to the Grgur Ninski statue."],
      story:
        "This story begins more than 1700 years ago when Diocletian, the emperor who divided power to save Roman Empire. He saw something others refused to see, that the Empire had grown too vast for one man, yes… but also that men themselves could not be trusted with such vastness.",
      storyParts: [
        "This story begins more than 1700 years ago when Diocletian, the emperor who divided power to save Roman Empire. He saw something others refused to see, that the Empire had grown too vast for one man, yes… but also that men themselves could not be trusted with such vastness.",
      ],
      clue: "Touching it gives good luck.",
      clueParts: ["Touching it gives good luck."],
      answer: "toe",
      acceptedAnswers: ["toe", "big toe", "foot", "bit toe"],
      hints: hint("It is golden."),
    },
    {
      id: uid(),
      title: "Golden Gate",
      location: "Golden Gate",
      imageUrl: emperorsStepImageUrl(1),
      guide: "Go down stairs to the gate, enter the palace. On the left side you will see text.",
      guideParts: ["Go down stairs to the gate, enter the palace. On the left side you will see text."],
      story:
        "So what did Diocletian do? He reshaped power and territory into four equal parts. Each of four parts of Empire would have its commander and they would together rule The Roman Empire.\n\nIt was called the \"Tetrarchy\"- the rule of four. Two Cesars and two Augusti.",
      storyParts: [
        "So what did Diocletian do? He reshaped power and territory into four equal parts. Each of four parts of Empire would have its commander and they would together rule The Roman Empire.",
        "It was called the \"Tetrarchy\"- the rule of four. Two Cesars and two Augusti.",
      ],
      clue: "The stone does not give its answer in words, but in order.",
      clueParts: ["The stone does not give its answer in words, but in order."],
      answer: "human",
      acceptedAnswers: ["human", "hvman"],
      hints: hint("Count the letters from first one, P=1 O=2 R=3…"),
    },
    {
      id: uid(),
      title: "Cardo Street",
      location: "Cardo Street",
      imageUrl: emperorsStepImageUrl(2),
      guide: "Follow the street ahead till the end. Solve the clue to know which way to go next.",
      guideParts: ["Follow the street ahead till the end. Solve the clue to know which way to go next."],
      story:
        "And for a moment … it worked.\n\nBut Diocletian was not a man who believed in moments. He believed in outcomes.\n\nSo while others praised the symmetry, he watched it, quietly, carefully, like a man who has built something not to trust it, but to test it. And here, in this very palace, he waited to see what men would do when given balance… and the chance to break it.",
      storyParts: [
        "And for a moment … it worked.",
        "But Diocletian was not a man who believed in moments. He believed in outcomes.",
        "So while others praised the symmetry, he watched it, quietly, carefully, like a man who has built something not to trust it, but to test it. And here, in this very palace, he waited to see what men would do when given balance… and the chance to break it.",
      ],
      clue: "X will show you the next location. Solve anagram to get answer for right word.",
      clueParts: ["X will show you the next location. Solve anagram to get answer for right word."],
      answer: "dextra",
      acceptedAnswers: ["dextra"],
      hints: hint("Look at the roman numbers above letters. Find the X on the image."),
    },
    {
      id: uid(),
      title: "Iron Gate",
      location: "Iron Gate",
      imageUrl: emperorsStepImageUrl(3),
      guide:
        "At the end of Cardo street you can see main square called Peristyle but you are not going there you are turning right. Go to the western enter to the palace called The Iron Gate. Look up.",
      guideParts: [
        "At the end of Cardo street you can see main square called Peristyle but you are not going there you are turning right. Go to the western enter to the palace called The Iron Gate. Look up.",
      ],
      story:
        "At first, nothing seemed wrong. That's how these things begin, not with war, not with betrayal, but with small shifts. The kind you wouldn't notice unless you were looking for them. And Diocletian was always looking. One ruler began to gather more soldiers than he needed. Another delayed decisions, not out of caution, but calculation. Letters between them became… colder. More careful. Words chosen not for truth, but for advantage.\n\nNo one spoke of it openly. They still called each other allies. They still honored the system.\n\nBut something had already changed.",
      storyParts: [
        "At first, nothing seemed wrong. That's how these things begin, not with war, not with betrayal, but with small shifts. The kind you wouldn't notice unless you were looking for them. And Diocletian was always looking. One ruler began to gather more soldiers than he needed. Another delayed decisions, not out of caution, but calculation. Letters between them became… colder. More careful. Words chosen not for truth, but for advantage.",
        "No one spoke of it openly. They still called each other allies. They still honored the system.",
        "But something had already changed.",
      ],
      clue: "What they held is long gone, whose they were was never known.\n\nWhat are they?",
      clueParts: [
        "What they held is long gone, whose they were was never known.",
        "What are they?",
      ],
      answer: "hands",
      acceptedAnswers: ["hands", "arms"],
      hints: hint("They are holding something."),
    },
    {
      id: uid(),
      title: "Peristyle",
      location: "Peristyle",
      imageUrl: emperorsStepImageUrl(4),
      guide:
        "Legend says statue of hands was built as a warning to those who enter palace from The Iron gates that they need to offer a gift to a guardian. Go back to the main square Peristyle.",
      guideParts: [
        "Legend says statue of hands was built as a warning to those who enter palace from The Iron gates that they need to offer a gift to a guardian. Go back to the main square Peristyle.",
      ],
      story:
        "You see, dividing power does not remove ambition. It gives it space. Instead of one man reaching upward, now there were four, each measuring himself against the others. Each wondering, quietly, why he should not be more. Diocletian understood this before they did. Above ground, everything appears ordered. Structured. Controlled.\n\nBut below… beneath the stone… things twist. They shift. They don't follow straight lines.\n\nJust like men.",
      storyParts: [
        "You see, dividing power does not remove ambition. It gives it space. Instead of one man reaching upward, now there were four, each measuring himself against the others. Each wondering, quietly, why he should not be more. Diocletian understood this before they did. Above ground, everything appears ordered. Structured. Controlled.",
        "But below… beneath the stone… things twist. They shift. They don't follow straight lines.",
        "Just like men.",
      ],
      clue: "Find the guardian. What creature is it?",
      clueParts: ["Find the guardian. What creature is it?"],
      answer: "sphinx",
      acceptedAnswers: ["sphinx", "lion"],
      hints: hint("It came from land of the Pharaohs and Pyramids. S****x"),
    },
    {
      id: uid(),
      title: "Cellars",
      location: "Palace cellars",
      imageUrl: emperorsStepImageUrl(5),
      guide: "From Peristyle enter cellars and find a mozaic. First exit on left.",
      guideParts: ["From Peristyle enter cellars and find a mozaic. First exit on left."],
      story:
        "Now here is the part that should trouble you.\n\nDiocletian did something no emperor had done before, he gave up power. Walked away from it. Voluntarily. They say he was tired. That he wanted peace. A quiet life among gardens and stone.\n\nThat is what they say. But ask yourself this, does a man capable of reshaping an empire simply walk away from it?\n\nOr does he step back… to see what happens next?",
      storyParts: [
        "Now here is the part that should trouble you.",
        "Diocletian did something no emperor had done before, he gave up power. Walked away from it. Voluntarily. They say he was tired. That he wanted peace. A quiet life among gardens and stone.",
        "That is what they say. But ask yourself this, does a man capable of reshaping an empire simply walk away from it?",
        "Or does he step back… to see what happens next?",
      ],
      clue: "Decrypt the code to find your answer.",
      clueParts: ["Decrypt the code to find your answer."],
      answer: "white palace",
      acceptedAnswers: ["white palace"],
      hints: hint("W**** P*****"),
    },
    {
      id: uid(),
      title: "Riva",
      location: "Riva promenade",
      imageUrl: emperorsStepImageUrl(6),
      guide:
        "Go back in the cellars and continue to the exit closer to the sea. You will find yourself on Riva promenade where 3D map is located. Find it and use it to find location of the secret.",
      guideParts: [
        "Go back in the cellars and continue to the exit closer to the sea. You will find yourself on Riva promenade where 3D map is located. Find it and use it to find location of the secret.",
      ],
      story:
        "From this palace, he watched. Messengers came and went. Reports arrived, carefully written, carefully read. And what they revealed was exactly what he had been waiting for. Tension.\n\nNot open conflict yet, but pressure building beneath the surface. The Caesars no longer content to serve. The Augusti no longer certain of their equals. Authority, once shared, becoming something to compete for. They even asked Diocletian to return. To fix it. He refused.\n\nBecause to interfere… would be to ruin the truth. And Diocletian, above all else, wanted the truth.",
      storyParts: [
        "From this palace, he watched. Messengers came and went. Reports arrived, carefully written, carefully read. And what they revealed was exactly what he had been waiting for. Tension.",
        "Not open conflict yet, but pressure building beneath the surface. The Caesars no longer content to serve. The Augusti no longer certain of their equals. Authority, once shared, becoming something to compete for. They even asked Diocletian to return. To fix it. He refused.",
        "Because to interfere… would be to ruin the truth. And Diocletian, above all else, wanted the truth.",
      ],
      clue:
        "Go to the location of the Old Market, along the way or when you get there ask locals for the name of the Old Market (Local name for the Old Market)",
      clueParts: [
        "Go to the location of the Old Market, along the way or when you get there ask locals for the name of the Old Market (Local name for the Old Market)",
      ],
      answer: "pazar",
      acceptedAnswers: ["pazar"],
      hints: hint("Starts with letter P"),
    },
    {
      id: uid(),
      title: "Old Town Market (Pazar)",
      location: "Pazar",
      imageUrl: emperorsStepImageUrl(7),
      guide:
        "You discovered that secret is somewhere on the local market called \"Pazar\". Walk along the area of the market. Keep your eyes open.",
      guideParts: [
        "You discovered that secret is somewhere on the local market called \"Pazar\". Walk along the area of the market. Keep your eyes open.",
      ],
      story:
        "System started to crumble but it didn't collapse all at once. That's the thing about systems, they don't shatter, they unravel. Slowly, the balance shifted. Then tilted. Then gave way. The rulers no longer saw themselves as parts of a whole. Each began to believe he was the whole. Armies moved, not to defend Rome, but to challenge one another. Titles were no longer shared, they were claimed.\n\nThe four became rivals.",
      storyParts: [
        "System started to crumble but it didn't collapse all at once. That's the thing about systems, they don't shatter, they unravel. Slowly, the balance shifted. Then tilted. Then gave way. The rulers no longer saw themselves as parts of a whole. Each began to believe he was the whole. Armies moved, not to defend Rome, but to challenge one another. Titles were no longer shared, they were claimed.",
        "The four became rivals.",
      ],
      clue: "Secret has _ _ _ _ _ above entrance. What object is above entrance?",
      clueParts: ["Secret has _ _ _ _ _ above entrance. What object is above entrance?"],
      answer: "crown",
      acceptedAnswers: ["crown"],
      hints: hint("Close to the eastern wall of the palace."),
    },
  ];
}

function emperorHuntBase(now: number): Omit<HuntDoc, "_id"> {
  return {
    slug: "emperors-secret",
    name: "The Emperor's Secret",
    country: "Croatia",
    city: "Split",
    heroImageUrl: SPLIT_HUNT_IMAGE_URL,
    description:
      "A premium self-guided clue hunt through Split inspired by Diocletian, hidden symbols, and a real souvenir treasure at the end.",
    introText: EMPERORS_INTRO_TEXT,
    status: "live",
    priceCents: 3900,
    currency: "eur",
    durationLabel: "1.5–2.5 hrs",
    playersLabel: "1–6 players",
    locationLabel: "Statue of Grgur Ninski",
    published: true,
    steps: emperorsSecretSteps(),
    stepsContentVersion: EMPERORS_STEPS_VERSION,
    createdAt: now,
    updatedAt: now,
  };
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
      await hunts.insertOne(emperorHuntBase(now));
      return;
    }

    const stepsVersion = emperor.stepsContentVersion ?? 1;
    const needsStepsUpgrade =
      stepsVersion < EMPERORS_STEPS_VERSION ||
      !Array.isArray(emperor.steps) ||
      emperor.steps.length < 8;

    await hunts.updateOne(
      { _id: emperor._id },
      {
        $set: {
          name: "The Emperor's Secret",
          country: "Croatia",
          city: "Split",
          heroImageUrl: SPLIT_HUNT_IMAGE_URL,
          description:
            "A premium self-guided clue hunt through Split inspired by Diocletian, hidden symbols, and a real souvenir treasure at the end.",
          introText: EMPERORS_INTRO_TEXT,
          priceCents: 3900,
          currency: "eur",
          durationLabel: "1.5–2.5 hrs",
          playersLabel: "1–6 players",
          published: true,
          status: "live",
          locationLabel: "Statue of Grgur Ninski",
          ...(needsStepsUpgrade
            ? {
                steps: mergeEmperorSteps(emperor.steps),
                stepsContentVersion: EMPERORS_STEPS_VERSION,
              }
            : {}),
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

    await hunts.updateMany(
      { country: { $nin: ["Croatia", "Greece", "Italy", "Spain"] } },
      { $set: { published: false, updatedAt: now } },
    );
    return;
  }

  const seed: HuntDoc[] = [emperorHuntBase(now), ...comingSoonSeed(now)];
  await hunts.insertMany(seed);
}
