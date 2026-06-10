import { createFileRoute, Link, notFound, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Lightbulb,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import {
  PlayActions,
  PlayGlassCard,
  PlayIntroHero,
  PlayLinkBtn,
  PlayMobileShell,
  PlayPrimaryBtn,
  PlaySecondaryBtn,
  PlayActiveSession,
  PlaySectionHeader,
  PlayStartCard,
  PlayTabBar,
} from "@/components/play/PlayMobileUi";
import { getOrderByAccessToken, saveHuntProgress } from "@/server/checkout";
import { stepFieldParagraphs, stepAcceptsAnswer } from "@/lib/hunt-utils";

export const Route = createFileRoute("/play/$token")({
  loader: ({ params }) => getOrderByAccessToken({ data: params.token }),
  staleTime: 0,
  component: PlayPage,
});

const COMPLETE_HASH = "complete";

function huntIsFinished(
  stepCount: number,
  stepIndex: number,
  completedIds: string[],
  progress: { currentStepIndex: number; completedStepIds: string[] },
): boolean {
  if (stepCount === 0) return true;
  return (
    stepIndex >= stepCount ||
    progress.currentStepIndex >= stepCount ||
    completedIds.length >= stepCount ||
    progress.completedStepIds.length >= stepCount
  );
}

function readCompleteFromSession(accessToken: string): boolean {
  try {
    return sessionStorage.getItem(`play-complete:${accessToken}`) === "1";
  } catch {
    return false;
  }
}

function markCompleteInSession(accessToken: string) {
  try {
    sessionStorage.setItem(`play-complete:${accessToken}`, "1");
  } catch {
    // ignore private mode / quota errors
  }
}

function resolveInitialStepIndex(
  stepCount: number,
  progress: { currentStepIndex: number; completedStepIds: string[] },
  accessToken: string,
): number {
  if (stepCount === 0) return 0;
  if (typeof window !== "undefined") {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash === COMPLETE_HASH || readCompleteFromSession(accessToken)) return stepCount;
  }
  if (progress.currentStepIndex >= stepCount) return progress.currentStepIndex;
  if (progress.completedStepIds.length >= stepCount) return stepCount;
  return progress.currentStepIndex;
}

function initialPhase(
  progress: {
    currentStepIndex: number;
    completedStepIds: string[];
    introCompleted?: boolean;
  },
  stepCount: number,
  accessToken: string,
): "before" | "guidelines" | "playing" {
  if (huntIsFinished(stepCount, progress.currentStepIndex, progress.completedStepIds, progress)) {
    return "playing";
  }
  if (typeof window !== "undefined") {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash === COMPLETE_HASH || readCompleteFromSession(accessToken)) return "playing";
  }
  if (
    progress.introCompleted ||
    progress.currentStepIndex > 0 ||
    progress.completedStepIds.length > 0
  ) {
    return "playing";
  }
  return "before";
}

const HUNT_IMAGE_FALLBACK = "/assets/branding/split-hunt-image.svg";

type PlayTab = "guide" | "story" | "clue";

const TAB_CONFIG: { key: PlayTab; label: string }[] = [
  { key: "guide", label: "Guide" },
  { key: "story", label: "Story" },
  { key: "clue", label: "Clue" },
];

function StepBody({ paragraphs, italic }: { paragraphs: string[]; italic?: boolean }) {
  if (paragraphs.length === 0) {
    return (
      <p className="text-left text-[0.85rem] leading-relaxed text-foreground/80">
        No content for this section yet.
      </p>
    );
  }
  return (
    <div className="space-y-2 text-left">
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className={`text-[0.82rem] leading-[1.55] text-foreground/85 text-pretty ${
            italic ? "font-display italic" : ""
          }`}
        >
          {p}
        </p>
      ))}
    </div>
  );
}

const TAB_KEYS = TAB_CONFIG.map((t) => t.key);

function PlayPage() {
  const data = Route.useLoaderData();
  if (!data) throw notFound();

  const { hunt, progress, order } = data;
  const steps = hunt.steps ?? [];
  const hash = useRouterState({ select: (s) => s.location.hash.replace(/^#/, "") });
  const isCompleteHash = hash === COMPLETE_HASH;
  const [stepIndex, setStepIndex] = useState(() =>
    resolveInitialStepIndex(steps.length, progress, order.accessToken),
  );
  const [viewIndex, setViewIndex] = useState(() =>
    resolveInitialStepIndex(steps.length, progress, order.accessToken),
  );
  const [completed, setCompleted] = useState<string[]>(progress.completedStepIds);
  const [activeTab, setActiveTab] = useState<PlayTab>("guide");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [closed, setClosed] = useState(Boolean(progress.closedAt));
  const [phase, setPhase] = useState<"before" | "guidelines" | "playing">(() =>
    initialPhase(progress, steps.length, order.accessToken),
  );
  const [revealedHints, setRevealedHints] = useState(progress.revealedHints ?? 0);
  const [saving, setSaving] = useState(false);

  const step = steps[viewIndex];
  const activeStep = steps[stepIndex];
  const finished =
    huntIsFinished(steps.length, stepIndex, completed, progress) ||
    isCompleteHash ||
    readCompleteFromSession(order.accessToken);
  const hints = activeStep?.hints ?? [];
  const gameId = order.accessToken.slice(5, 13).toUpperCase();
  const progressPct =
    steps.length > 0 ? Math.round((completed.length / steps.length) * 100) : 0;
  const isCurrentStep = viewIndex === stepIndex;

  const tabParagraphs = stepFieldParagraphs(step, activeTab);
  const clueParts = stepFieldParagraphs(step, "clue");
  const clueInstruction =
    clueParts.find((p) => p.startsWith("Read the location carefully")) ?? clueParts[0] ?? "";
  const clueQuestionParts = clueParts.filter((p) => p !== clueInstruction);
  const activeTabIndex = TAB_KEYS.indexOf(activeTab);
  const stepImage = hunt.heroImageUrl || HUNT_IMAGE_FALLBACK;
  const staffCloseUrl = data.staffCloseUrl;

  useEffect(() => {
    setViewIndex(stepIndex);
  }, [stepIndex]);

  useEffect(() => {
    if (!finished || closed) return;
    const timer = window.setInterval(async () => {
      try {
        const fresh = await getOrderByAccessToken({ data: order.accessToken });
        if (fresh?.progress.closedAt) setClosed(true);
      } catch {
        // ignore polling errors
      }
    }, 3000);
    return () => window.clearInterval(timer);
  }, [finished, closed, order.accessToken]);

  useEffect(() => {
    if (!finished && !closed) return;
    const url = `${window.location.pathname}${window.location.search}#complete`;
    if (window.location.hash !== "#complete") {
      window.history.replaceState(null, "", url);
    }
  }, [finished, closed]);

  function goToStep(index: number) {
    if (index < 0 || index > stepIndex || index >= steps.length) return;
    setViewIndex(index);
    setActiveTab("guide");
    setMessage(null);
  }

  function goToPrevStep() {
    goToStep(viewIndex - 1);
  }

  function goToNextStep() {
    goToStep(viewIndex + 1);
  }

  const canPrevStep = viewIndex > 0;
  const canNextStep = viewIndex < stepIndex && viewIndex < steps.length - 1;

  function goPrevTab() {
    if (activeTabIndex <= 0) return;
    const prev = TAB_KEYS[activeTabIndex - 1]!;
    setActiveTab(prev);
    if (prev !== "clue") setMessage(null);
  }

  function goNextTab() {
    if (activeTabIndex >= TAB_KEYS.length - 1) return;
    setActiveTab(TAB_KEYS[activeTabIndex + 1]!);
  }

  async function persist(
    nextIndex: number,
    nextCompleted: string[],
    extras?: { introCompleted?: boolean; revealedHints?: number },
  ) {
    setSaving(true);
    try {
      await saveHuntProgress({
        data: {
          accessToken: order.accessToken,
          currentStepIndex: nextIndex,
          completedStepIds: nextCompleted,
          introCompleted: extras?.introCompleted,
          revealedHints: extras?.revealedHints,
        },
      });
    } catch {
      setMessage("Could not save progress. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  function startGame() {
    setPhase("playing");
    void persist(stepIndex, completed, { introCompleted: true, revealedHints: revealedHints });
  }

  async function submitAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!activeStep || !isCurrentStep) return;
    if (stepAcceptsAnswer(activeStep, answer)) {
      const nextCompleted = [...completed, activeStep.id];
      const nextIndex = stepIndex + 1;
      if (nextIndex >= steps.length) {
        markCompleteInSession(order.accessToken);
      }
      setCompleted(nextCompleted);
      setStepIndex(nextIndex);
      setViewIndex(nextIndex);
      setAnswer("");
      setMessage(nextIndex >= steps.length ? "Hunt complete!" : "Correct. Next clue unlocked.");
      setRevealedHints(0);
      setActiveTab("guide");
      setPhase("playing");
      await persist(nextIndex, nextCompleted, { introCompleted: true, revealedHints: 0 });
    } else {
      setMessage("Not quite — try again or tap Get hint.");
    }
  }

  function handleRevealHint() {
    if (hints.length === 0) return;
    if (revealedHints >= hints.length) return;
    const next = Math.min(hints.length, revealedHints + 1);
    setRevealedHints(next);
    setMessage(null);
    void persist(stepIndex, completed, { introCompleted: true, revealedHints: next });
  }

  if (finished || steps.length === 0) {
    const qrUrl = staffCloseUrl
      ? `https://quickchart.io/qr?size=280&text=${encodeURIComponent(staffCloseUrl)}`
      : null;

    return (
      <PlayMobileShell>
        <div className="flex flex-col items-center gap-4 py-4">
        <Reveal>
          <PlaySectionHeader
            label={closed ? "All done" : "Treasure"}
            title={closed ? "Hunt closed" : "Hunt complete!"}
            subtitle={
              closed
                ? "Staff confirmed your souvenir pickup. Thanks for playing."
                : "Show this QR code to staff to collect your souvenir."
            }
          />
        </Reveal>

        {!closed && qrUrl && (
          <Reveal delay={0.08}>
            <PlayGlassCard className="mt-8 mx-auto w-full max-w-[300px]">
              <div className="rounded-xl bg-white p-3 border border-border/60">
                <img src={qrUrl} alt="Staff QR code" className="w-full aspect-square rounded-lg" />
              </div>
              <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Game ID · {gameId}
              </p>
              <p className="mt-1.5 text-center text-[11px] text-muted-foreground">Waiting for staff…</p>
            </PlayGlassCard>
          </Reveal>
        )}

        {closed && (
          <Reveal delay={0.08}>
            <PlayGlassCard className="mt-8 text-center">
              <p className="text-[0.9rem] text-foreground/80 leading-relaxed">
                Your hunt is officially complete. We hope you enjoyed exploring {hunt.city}.
              </p>
            </PlayGlassCard>
          </Reveal>
        )}

        <Reveal delay={0.12}>
          <PlayActions>
            <Link
              to="/"
              className="btn-shine inline-flex items-center justify-center rounded-full bg-primary text-white px-8 py-3.5 text-sm font-medium shadow-paper min-w-[11.5rem]"
            >
              Back home
            </Link>
          </PlayActions>
        </Reveal>
        </div>
      </PlayMobileShell>
    );
  }

  if (phase === "before") {
    const startLocation = steps[0]?.location ?? hunt.locationLabel ?? `${hunt.city}, ${hunt.country}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(startLocation)}`;

    return (
      <PlayMobileShell>
        <Reveal>
          <PlayStartCard
            imageUrl={stepImage}
            label="Before you start"
            title="Go to the start"
            hint="Walk to the starting point first. When you arrive, begin the run on location."
            locationLabel={hunt.locationLabel}
            cityCountry={`${hunt.city}, ${hunt.country}`}
          >
            <PlayLinkBtn href={mapsUrl} target="_blank" rel="noreferrer">
              Open in Maps
            </PlayLinkBtn>
            <PlaySecondaryBtn type="button" onClick={() => setPhase("guidelines")}>
              I&apos;m on start location
            </PlaySecondaryBtn>
          </PlayStartCard>
        </Reveal>
      </PlayMobileShell>
    );
  }

  if (phase === "guidelines") {
    return (
      <PlayMobileShell>
        <Reveal>
        <PlayIntroHero
          imageUrl={stepImage}
          label={`Game · ${gameId}`}
          title={hunt.name}
          hint="Guide, story & clue on each stop."
        />
        </Reveal>

        <Reveal delay={0.06}>
        <div className="space-y-2.5">
            {[
              { title: "Guide", body: "How to observe the space calmly." },
              { title: "Story", body: "Mood and mystery at each stop." },
              { title: "Clue", body: "What to find and the riddle to solve." },
            ].map((item, index) => (
              <div
                key={item.title}
                className="glass flex items-center gap-3 rounded-2xl border border-white/80 px-4 py-3"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">{item.title}</p>
                  <p className="mt-0.5 text-[0.8rem] leading-snug text-foreground/75">{item.body}</p>
                </div>
              </div>
            ))}
        </div>
        </Reveal>

        <Reveal delay={0.12}>
        <PlayActions>
          <PlayPrimaryBtn type="button" onClick={startGame}>
            Start game
          </PlayPrimaryBtn>
        </PlayActions>
        </Reveal>
      </PlayMobileShell>
    );
  }

  const activeTabLabel = TAB_CONFIG.find((t) => t.key === activeTab)?.label ?? activeTab;

  return (
    <PlayMobileShell>
      <Reveal>
      <PlayActiveSession
        gameId={gameId}
        huntName={hunt.name}
        stepNumber={viewIndex + 1}
        stepTotal={steps.length}
        stepTitle={step?.title ?? `Stop ${viewIndex + 1}`}
        location={step?.location}
        progressPct={progressPct}
        canPrevStep={canPrevStep}
        canNextStep={canNextStep}
        onPrevStep={goToPrevStep}
        onNextStep={goToNextStep}
        heroImage={stepImage}
        heroLabel={activeTabLabel}
      >
          <PlayTabBar
            tabs={TAB_CONFIG}
            active={activeTab}
            onChange={(key) => {
              setActiveTab(key as PlayTab);
              if (key !== "clue") setMessage(null);
            }}
          />

          <div className="mt-2 space-y-2.5">
            {activeTab === "clue" ? (
              <div className="space-y-3">
                {clueInstruction && (
                  <p className="text-[0.88rem] italic text-foreground/80 leading-relaxed text-left text-pretty">
                    {clueInstruction}
                  </p>
                )}
                {clueQuestionParts.map((p, i) => (
                  <p key={i} className="text-[0.9rem] font-medium text-ink leading-relaxed text-left text-pretty">
                    {p}
                  </p>
                ))}

                {isCurrentStep ? (
                  <>
                    {revealedHints > 0 && (
                      <div className="rounded-xl bg-amber-50/95 border border-amber-200/70 p-3.5">
                        <div className="flex items-center justify-center gap-2 text-amber-900 text-sm font-medium">
                          <Lightbulb className="w-4 h-4 shrink-0" />
                          Hint {revealedHints}
                        </div>
                        <p className="mt-2 text-center text-[0.85rem] italic leading-relaxed text-amber-950/90">
                          {hints[revealedHints - 1]?.text}
                        </p>
                      </div>
                    )}

                    <form onSubmit={submitAnswer} className="space-y-2.5 pt-0.5">
                      <input
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="w-full rounded-xl border border-border bg-white/95 px-4 py-2.5 text-base font-mono text-center outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                        placeholder="Your answer"
                        autoComplete="off"
                        autoCapitalize="off"
                        enterKeyHint="done"
                      />
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="submit"
                          disabled={saving || !answer.trim()}
                          className="flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-primary text-sm font-semibold text-white shadow-sm transition-opacity disabled:opacity-50 touch-manipulation"
                        >
                          <Check className="h-4 w-4 shrink-0" />
                          Submit
                        </button>
                        <button
                          type="button"
                          onClick={handleRevealHint}
                          disabled={hints.length === 0 || revealedHints >= hints.length}
                          className="flex h-11 w-full items-center justify-center gap-1.5 rounded-full border border-primary/25 bg-white text-sm font-semibold text-primary transition-opacity disabled:opacity-40 touch-manipulation"
                        >
                          <Sparkles className="h-3.5 w-3.5 shrink-0" />
                          Hint
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <p className="text-[0.82rem] text-muted-foreground italic text-left">
                    Step completed — review or continue on your current stop.
                  </p>
                )}
              </div>
            ) : (
              <StepBody paragraphs={tabParagraphs} italic={activeTab === "story"} />
            )}
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={goPrevTab}
              disabled={activeTabIndex <= 0}
              className="flex h-10 w-full items-center justify-center gap-1 rounded-full border border-border bg-white text-sm font-medium disabled:opacity-40 touch-manipulation"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              Back
            </button>
            <button
              type="button"
              onClick={goNextTab}
              disabled={activeTabIndex >= TAB_KEYS.length - 1}
              className="flex h-10 w-full items-center justify-center gap-1 rounded-full bg-primary text-sm font-medium text-white shadow-sm disabled:opacity-40 touch-manipulation"
            >
              Next
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
          </div>

          {message && (
            <p
              className={`mt-2.5 text-center text-[0.82rem] ${
                message.startsWith("Correct") || message.startsWith("Hunt complete")
                  ? "text-moss font-medium"
                  : message.startsWith("Could not")
                    ? "text-red-600"
                    : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          {!isCurrentStep && !message && (
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Viewing stop {viewIndex + 1} · current is {stepIndex + 1}
            </p>
          )}
      </PlayActiveSession>
      </Reveal>
    </PlayMobileShell>
  );
}
