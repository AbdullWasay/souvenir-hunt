import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Clock, Users, MapPin, Sparkles, KeyRound, Mail } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { getHuntBySlug } from "@/server/hunts";
import { findResumeForHunt } from "@/server/checkout";
import { huntStatusLabel, isHuntBookable } from "@/lib/types";

const HUNT_IMAGE_FALLBACK = "/assets/branding/split-hunt-image.svg";

export const Route = createFileRoute("/hunts/$slug")({
  loader: async ({ params }) => {
    try {
      return await getHuntBySlug({ data: params.slug });
    } catch (error) {
      console.error("Failed to load hunt:", error);
      return null;
    }
  },
  component: HuntDetailPage,
});

function HuntDetailPage() {
  const hunt = Route.useLoaderData();
  if (!hunt) throw notFound();

  const bookable = isHuntBookable(hunt.status) || hunt.slug === "emperors-secret";
  const [showResume, setShowResume] = useState(false);
  const [email, setEmail] = useState("");
  const [imageError, setImageError] = useState(false);
  const [resume, setResume] = useState<{ playUrl: string; accessToken: string } | null>(null);
  const [resumeChecked, setResumeChecked] = useState(false);
  const [checking, setChecking] = useState(false);

  const heroSrc = imageError
    ? HUNT_IMAGE_FALLBACK
    : hunt.heroImageUrl || HUNT_IMAGE_FALLBACK;

  const metaItems = [
    { icon: Clock, label: hunt.durationLabel },
    { icon: Users, label: hunt.playersLabel },
    { icon: MapPin, label: hunt.locationLabel },
    { icon: Sparkles, label: `EUR ${(hunt.priceCents / 100).toFixed(0)}` },
  ];

  async function checkResume() {
    if (!email.trim()) return;
    setChecking(true);
    try {
      const result = await findResumeForHunt({ data: { huntSlug: hunt.slug, email } });
      setResume(result);
      setResumeChecked(true);
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:max-w-2xl sm:px-6 lg:max-w-7xl lg:pb-16">
      <Reveal>
        <Link
          to="/hunts"
          className="inline-block py-2 text-sm text-muted-foreground hover:text-ink sm:text-left"
        >
          ← All hunts
        </Link>
      </Reveal>

      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-10 xl:gap-14">
        <div className="text-center sm:text-left">
          <Reveal delay={0.04}>
            <div className="relative mx-auto mt-2 aspect-[16/10] w-full max-w-[400px] overflow-hidden rounded-2xl border border-border/80 bg-muted shadow-paper sm:mx-0 sm:mt-4 sm:max-w-none">
              <img
                src={heroSrc}
                alt={`${hunt.city}, ${hunt.country}`}
                onError={() => setImageError(true)}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 stamp border-white/40 bg-white/90 text-[10px] text-ink">
                <MapPin className="h-3 w-3" /> {hunt.city}, {hunt.country}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-4 sm:mt-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
                  {bookable ? "Live hunt" : huntStatusLabel(hunt.status)}
                </p>
                {!bookable && (
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {hunt.country}
                  </span>
                )}
              </div>
              <h1 className="mt-2 font-display text-[clamp(1.65rem,6vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.02em] text-ink">
                {hunt.name}
              </h1>
              <p className="mt-2.5 text-[0.88rem] leading-relaxed text-foreground/70 sm:text-sm">
                {hunt.description}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <ul className="mx-auto mt-4 grid w-full max-w-[340px] grid-cols-2 gap-2.5 sm:mx-0 sm:mt-5 sm:max-w-none sm:gap-2.5">
              {metaItems.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-white/60 px-3 py-3 text-[11px] font-medium text-ink backdrop-blur-sm sm:justify-start sm:bg-muted/50 sm:text-xs"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.75} />
                  <span className="leading-tight text-left">{label}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {bookable ? (
            <Reveal delay={0.16}>
              <div className="mx-auto mt-5 flex w-full max-w-[320px] flex-col items-center gap-2.5 sm:mx-0 sm:items-stretch sm:mt-5 sm:max-w-md">
                <Link
                  to="/checkout/$slug"
                  params={{ slug: hunt.slug }}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-medium text-parchment transition-colors hover:bg-primary"
                >
                  Pay &amp; Start Hunt
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </Link>
                <button
                  type="button"
                  onClick={() => setShowResume((v) => !v)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-white px-5 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-muted"
                >
                  Resume Existing Hunt
                </button>
              </div>
            </Reveal>
          ) : (
            <Reveal delay={0.16}>
              <div className="mx-auto mt-6 max-w-[320px] rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-center sm:mx-0 sm:mt-5">
                <p className="font-display text-lg text-ink">{huntStatusLabel(hunt.status)}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  This route is not open for booking yet.
                </p>
                <Link to="/" hash="contact" className="mt-4 inline-flex text-sm font-medium text-primary">
                  Get notified →
                </Link>
              </div>
            </Reveal>
          )}

          {bookable && showResume && (
            <Reveal delay={0.2}>
              <div className="mx-auto mt-4 max-w-[320px] rounded-2xl border border-border bg-card p-4 text-left sm:mx-0 sm:max-w-none sm:p-5">
                <div className="mb-3 flex items-center gap-2 text-ink">
                  <KeyRound className="h-4 w-4 text-primary" />
                  <span className="font-mono text-[10px] uppercase tracking-widest">Already purchased?</span>
                </div>
                <p className="mb-3 text-xs text-muted-foreground">
                  Enter the email you used at checkout to resume this hunt.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setResume(null);
                        setResumeChecked(false);
                      }}
                      placeholder="you@email.com"
                      className="w-full rounded-xl border border-border py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={checkResume}
                    disabled={checking || !email.trim()}
                    className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
                  >
                    {checking ? "Checking…" : "Find my hunt"}
                  </button>
                </div>
                {resume && (
                  <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
                    <p className="text-sm text-foreground/80">We found an active hunt for this email.</p>
                    <Link
                      to="/play/$token"
                      params={{ token: resume.accessToken }}
                      className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary"
                    >
                      Resume hunt <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
                {resumeChecked && !resume && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    No paid hunt found for this email on this route yet.
                  </p>
                )}
              </div>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.14} className="hidden lg:block lg:mt-4">
          <div className="rounded-2xl border border-border bg-card p-6 xl:p-8">
            <h2 className="font-display text-2xl text-ink">What this hunt is</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/75">
              A self-guided mobile clue hunt through {hunt.city} with short story chapters, location-based
              answers, and a physical souvenir reward at the finish.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              One booking covers {hunt.playersLabel.toLowerCase()}. Price: EUR {(hunt.priceCents / 100).toFixed(0)}.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
