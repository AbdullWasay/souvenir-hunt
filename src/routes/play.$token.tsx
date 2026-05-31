import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Lightbulb,
  MapPin,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { getOrderByAccessToken, saveHuntProgress } from "@/server/checkout";
import { stepFieldParagraphs, stepAcceptsAnswer } from "@/lib/hunt-utils";

export const Route = createFileRoute("/play/$token")({
  loader: ({ params }) => getOrderByAccessToken({ data: params.token }),
  staleTime: 0,
  component: PlayPage,
});

function initialPhase(progress: {
  currentStepIndex: number;
  completedStepIds: string[];
  introCompleted?: boolean;
}): "before" | "guidelines" | "playing" {
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

const TAB_CONFIG = [
  { key: "story" as const, label: "Story" },
  { key: "history" as const, label: "History" },
  { key: "clue" as const, label: "Clue" },
  { key: "guide" as const, label: "Guide" },
];

function StepBody({ paragraphs, italic }: { paragraphs: string[]; italic?: boolean }) {
  if (paragraphs.length === 0) {
    return <p className="text-foreground/80 leading-relaxed">No content for this section yet.</p>;
  }
  return (
    <div className="space-y-5">
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className={`text-[0.98rem] sm:text-[1.05rem] text-foreground/85 leading-[1.8] ${
            italic ? "italic font-display" : ""
          }`}
        >
          {p}
        </p>
      ))}
    </div>
  );
}

const TAB_KEYS = TAB_CONFIG.map((t) => t.key);

function StepHeroBanner({
  imageUrl,
  label,
  splitDesktop = false,
}: {
  imageUrl: string;
  label: string;
  splitDesktop?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-muted ${
        splitDesktop
          ? "aspect-[16/10] sm:aspect-[2/1] lg:aspect-[4/3] lg:min-h-0 lg:max-h-[min(38vh,320px)]"
          : "aspect-[16/10] sm:aspect-[2/1]"
      }`}
    >
      <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
      <p className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white">
        {label}
      </p>
    </div>
  );
}

function PlayIntroLayout({
  imageUrl,
  children,
}: {
  imageUrl: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-xl md:max-w-2xl lg:max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16 pb-28">
      <div className="lg:grid lg:grid-cols-2 lg:gap-10 xl:gap-14 lg:items-center">
        <div className="hidden lg:block">
          <div className="relative overflow-hidden rounded-2xl aspect-[4/5] max-h-[min(72vh,560px)] bg-muted shadow-paper">
            <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-ink/10 to-transparent" />
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function PlayPage() {
  const data = Route.useLoaderData();
  if (!data) throw notFound();

  const navigate = useNavigate();
  const { hunt, progress, order } = data;
  const [stepIndex, setStepIndex] = useState(progress.currentStepIndex);
  const [viewIndex, setViewIndex] = useState(progress.currentStepIndex);
  const [completed, setCompleted] = useState<string[]>(progress.completedStepIds);
  const [activeTab, setActiveTab] = useState<"story" | "history" | "clue" | "guide">("story");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [closed, setClosed] = useState(Boolean(progress.closedAt));
  const [phase, setPhase] = useState<"before" | "guidelines" | "playing">(() => initialPhase(progress));
  const [revealedHints, setRevealedHints] = useState(progress.revealedHints ?? 0);
  const [saving, setSaving] = useState(false);

  const steps = hunt.steps ?? [];
  const step = steps[viewIndex];
  const activeStep = steps[stepIndex];
  const finished = stepIndex >= steps.length;
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
    if (finished || closed) {
      navigate({ hash: "complete", replace: true });
    }
  }, [finished, closed, navigate]);

  function goToStep(index: number) {
    if (index < 0 || index > stepIndex || index >= steps.length) return;
    setViewIndex(index);
    setActiveTab("story");
    setMessage(null);
  }

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

  function submitAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!activeStep || !isCurrentStep) return;
    if (stepAcceptsAnswer(activeStep, answer)) {
      const nextCompleted = [...completed, activeStep.id];
      const nextIndex = stepIndex + 1;
      setCompleted(nextCompleted);
      setStepIndex(nextIndex);
      setViewIndex(nextIndex);
      setAnswer("");
      setMessage("Correct. Next clue unlocked.");
      setRevealedHints(0);
      setActiveTab("story");
      void persist(nextIndex, nextCompleted, { introCompleted: true, revealedHints: 0 });
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

  const shellClass =
    "w-full max-w-xl md:max-w-2xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-28";

  if (phase === "before") {
    const startLocation = steps[0]?.location ?? hunt.locationLabel ?? `${hunt.city}, ${hunt.country}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(startLocation)}`;

    return (
      <PlayIntroLayout imageUrl={stepImage}>
        <Reveal>
          <p className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-primary mb-2">
            Before you start
          </p>
          <h1 className="font-display text-[1.65rem] sm:text-3xl font-semibold text-ink leading-tight">
            Go to the start location
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Head to the starting point first. Once you are there, begin the run and follow the story on location.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-6 sm:mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6 md:p-8 shadow-paper">
            <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Start point
            </p>
            <h2 className="mt-2 font-display text-lg sm:text-xl text-ink">{hunt.locationLabel}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {hunt.city}, {hunt.country}
            </p>
            <p className="mt-4 text-sm text-foreground/80 leading-relaxed">
              Open the location in Maps, walk to the start point, and when you arrive begin the run from there.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center rounded-full bg-primary text-white px-6 py-3.5 text-sm font-medium"
              >
                Get to start point
              </a>
              <button
                type="button"
                onClick={() => setPhase("guidelines")}
                className="flex-1 rounded-full border border-border px-6 py-3.5 text-sm font-medium text-ink hover:bg-muted transition-colors"
              >
                I&apos;m on start location
              </button>
            </div>
          </div>
        </Reveal>
      </PlayIntroLayout>
    );
  }

  if (phase === "guidelines") {
    return (
      <PlayIntroLayout imageUrl={stepImage}>
        <Reveal>
          <p className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-muted-foreground">
            Game ID: {gameId}
          </p>
          <h1 className="mt-1 font-display text-[1.65rem] sm:text-3xl font-semibold text-primary leading-tight">
            {hunt.name}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Learn how each part of the hunt works before you start exploring the city.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-6 sm:mt-8 grid sm:grid-cols-2 gap-3">
            {[
              {
                title: "Story",
                body: "The narrative thread — mood, stakes, and mystery behind each stop.",
              },
              {
                title: "History",
                body: "Real background of where you stand, rooted in the actual city.",
              },
              {
                title: "Clue",
                body: "What to look for and the riddle you solve on location.",
              },
              {
                title: "Guide",
                body: "How to observe the space and move through each step calmly.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card px-4 sm:px-5 py-4 text-sm shadow-paper"
              >
                <div className="h-7 w-7 shrink-0 rounded-full bg-primary text-white grid place-items-center text-xs font-semibold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold uppercase tracking-[0.16em] text-xs text-muted-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1 text-foreground/80 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <button
            type="button"
            onClick={startGame}
            className="mt-8 sm:mt-10 w-full rounded-full bg-primary text-white px-6 py-4 text-sm font-medium shadow-paper hover:shadow-glow transition-shadow"
          >
            Start game
          </button>
        </Reveal>
      </PlayIntroLayout>
    );
  }

  if (finished || steps.length === 0) {
    const qrUrl = staffCloseUrl
      ? `https://quickchart.io/qr?size=280&text=${encodeURIComponent(staffCloseUrl)}`
      : null;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-16 pb-28">
        <div className="flex flex-col items-center gap-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <img
              src="/assets/branding/logo-main.svg"
              alt=""
              aria-hidden
              className="h-10 sm:h-12 w-auto shrink-0 object-contain [filter:brightness(0)_saturate(100%)_invert(22%)_sepia(98%)_saturate(4688%)_hue-rotate(221deg)_brightness(101%)_contrast(103%)]"
            />
            <span className="font-display font-bold text-[1.35rem] sm:text-[1.65rem] leading-none text-primary tracking-tight">
              Souvenir Hunt
            </span>
          </div>
        </div>

        <div className="w-full max-w-md">
          <Reveal>
            <div className="text-center">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto">
                {closed ? <CheckCircle2 className="w-7 h-7" /> : <Trophy className="w-7 h-7" />}
              </span>
              <h1 className="mt-5 font-display text-[1.75rem] sm:text-3xl font-semibold text-ink">
                {closed ? "Hunt closed" : "Hunt complete!"}
              </h1>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                {closed
                  ? "Staff confirmed your souvenir pickup. Thanks for playing."
                  : "Show this QR code to staff to collect your souvenir treasure."}
              </p>
            </div>
          </Reveal>

          {!closed && qrUrl && (
            <Reveal delay={0.08}>
              <div className="mt-8 rounded-[1.75rem] border border-primary/20 bg-gradient-to-b from-white to-primary/[0.04] p-6 sm:p-8 shadow-[0_8px_40px_-12px_rgba(10,77,255,0.22)]">
                <div className="rounded-2xl bg-white p-4 sm:p-5 border border-border/80 shadow-sm mx-auto max-w-[280px]">
                  <img
                    src={qrUrl}
                    alt="Staff QR code"
                    className="w-full aspect-square rounded-xl"
                  />
                </div>
                <p className="mt-5 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Game ID · {gameId}
                </p>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Waiting for staff confirmation…
                </p>
              </div>
            </Reveal>
          )}

          {closed && (
            <Reveal delay={0.08}>
              <div className="mt-8 rounded-2xl border border-moss/30 bg-moss/5 px-6 py-8 text-center">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Your hunt is officially complete. We hope you enjoyed exploring Split.
                </p>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.12}>
            <div className="mt-8 text-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full bg-primary text-white px-8 py-3.5 text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
              >
                Back home
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <Reveal>
        <p className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-muted-foreground">
          Game ID: {gameId}
        </p>
        <h1 className="mt-1 font-display text-[1.65rem] sm:text-3xl font-semibold text-primary leading-tight">
          {hunt.name}
        </h1>

        {/* Progress */}
        <div className="mt-5 sm:mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Progress:</p>
          <div className="mt-2 h-3 rounded-full bg-primary/15 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${Math.max(progressPct, isCurrentStep ? 8 : 0)}%` }}
            />
          </div>
          <div className="mt-3 -mx-1 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {steps.map((s, i) => {
              const done = completed.includes(s.id);
              const current = i === stepIndex;
              const viewing = i === viewIndex;
              const locked = i > stepIndex;
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={locked}
                  onClick={() => goToStep(i)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors touch-manipulation ${
                    viewing
                      ? "bg-primary text-white shadow-sm"
                      : done
                        ? "bg-primary/15 text-primary hover:bg-primary/25"
                        : current
                          ? "bg-primary/25 text-primary ring-2 ring-primary/30"
                          : locked
                            ? "bg-muted/80 text-muted-foreground/50 cursor-not-allowed"
                            : "bg-primary/10 text-primary/80 hover:bg-primary/20"
                  }`}
                >
                  Step {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-6 rounded-[1.75rem] border border-primary/20 bg-gradient-to-b from-white via-white to-primary/[0.04] p-4 sm:p-6 shadow-[0_8px_40px_-12px_rgba(10,77,255,0.25)]">
          <h2 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wide text-primary">
            {step?.title ?? `Step ${viewIndex + 1}`}
          </h2>
          {step?.location && (
            <p className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0" /> {step.location}
            </p>
          )}

          {/* Tabs */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            {TAB_CONFIG.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveTab(key);
                  if (key !== "clue") setMessage(null);
                }}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors touch-manipulation ${
                  activeTab === key
                    ? "bg-primary text-white shadow-sm"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Content card — stacked on mobile, image left / text right on desktop */}
          <div className="mt-4 rounded-2xl border border-border/80 bg-white p-4 sm:p-5 shadow-sm">
            <div className="lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-6 lg:items-start">
              <div className="lg:sticky lg:top-28">
                <StepHeroBanner
                  imageUrl={stepImage}
                  label={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  splitDesktop
                />
              </div>

              <div className="mt-4 lg:mt-0 space-y-4 lg:max-h-[min(55vh,420px)] lg:overflow-y-auto lg:pr-1">
                {activeTab === "clue" ? (
                  <div className="space-y-4 border-t border-border/60 pt-4 lg:border-t-0 lg:pt-0">
                    {clueInstruction && (
                      <p className="text-sm sm:text-[0.95rem] italic text-foreground/80 leading-relaxed">
                        {clueInstruction}
                      </p>
                    )}

                    {clueQuestionParts.length > 0 && (
                      <div className="space-y-3 border-t border-border/60 pt-4 lg:border-t-0 lg:pt-0">
                        {clueQuestionParts.map((p, i) => (
                          <p key={i} className="text-[0.98rem] sm:text-base font-medium text-ink leading-relaxed">
                            {p}
                          </p>
                        ))}
                      </div>
                    )}

                    {isCurrentStep ? (
                      <>
                        {revealedHints > 0 && (
                          <div className="rounded-xl bg-amber-50 border border-amber-200/70 p-3.5 sm:p-4">
                            <div className="flex items-center gap-2 text-amber-900 text-sm font-medium">
                              <Lightbulb className="w-4 h-4 shrink-0" />
                              Hint {revealedHints}
                            </div>
                            <p className="mt-2 text-sm text-amber-950/90 leading-relaxed italic">
                              {hints[revealedHints - 1]?.text}
                            </p>
                          </div>
                        )}

                        <form onSubmit={submitAnswer} className="space-y-3 pt-1 border-t border-border/60 lg:border-t-0">
                          <input
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full rounded-xl border border-border bg-white px-4 py-3.5 text-base font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                            placeholder="Type your answer"
                            autoComplete="off"
                            autoCapitalize="off"
                            enterKeyHint="done"
                          />

                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="submit"
                              disabled={saving || !answer.trim()}
                              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-white text-sm font-semibold shadow-sm hover:shadow-md disabled:opacity-50 transition-shadow touch-manipulation"
                            >
                              <span className="grid place-items-center w-7 h-7 rounded-full bg-white/20">
                                <Check className="w-4 h-4" />
                              </span>
                              Submit
                            </button>
                            <button
                              type="button"
                              onClick={handleRevealHint}
                              disabled={hints.length === 0 || revealedHints >= hints.length}
                              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-primary/30 bg-white text-primary text-sm font-semibold hover:bg-primary/5 disabled:opacity-40 disabled:pointer-events-none transition-colors touch-manipulation"
                            >
                              <Sparkles className="w-4 h-4 shrink-0" />
                              {revealedHints >= hints.length && hints.length > 0
                                ? "No hints"
                                : "Get hint"}
                            </button>
                          </div>
                        </form>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground italic border-t border-border/60 pt-4 lg:border-t-0 lg:pt-0">
                        You&apos;ve already completed this step. Review the clue above or continue on your current step.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="border-t border-border/60 pt-4 lg:border-t-0 lg:pt-0">
                    <StepBody paragraphs={tabParagraphs} italic />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={goPrevTab}
              disabled={activeTabIndex <= 0}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-white text-ink text-sm font-medium hover:bg-muted/50 disabled:opacity-40 disabled:pointer-events-none transition-colors touch-manipulation"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              type="button"
              onClick={goNextTab}
              disabled={activeTabIndex >= TAB_KEYS.length - 1}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-white text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-40 disabled:pointer-events-none transition-colors touch-manipulation"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {message && (
            <p
              className={`mt-4 text-center text-sm ${
                message.startsWith("Correct")
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
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Viewing step {viewIndex + 1} · your current step is {stepIndex + 1}
            </p>
          )}
        </div>
      </Reveal>
    </div>
  );
}
