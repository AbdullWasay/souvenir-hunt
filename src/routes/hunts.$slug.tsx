import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Clock, Users, MapPin, Sparkles, KeyRound, Mail } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { getHuntBySlug } from "@/server/hunts";
import { findResumeForHunt } from "@/server/checkout";
import { huntStatusLabel, isHuntBookable } from "@/lib/types";

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
    <div className="max-w-7xl mx-auto px-6 pb-20">
      <Reveal>
        <Link to="/hunts" className="text-sm text-muted-foreground hover:text-ink">
          ← All hunts
        </Link>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="stamp text-muted-foreground">{hunt.country}</span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              bookable ? "bg-moss/15 text-moss" : "bg-muted text-muted-foreground"
            }`}
          >
            {huntStatusLabel(hunt.status)}
          </span>
        </div>
        <h1 className="mt-4 font-display text-[clamp(1.75rem,4vw,3rem)] text-ink">{hunt.name}</h1>
        <p className="mt-2 text-muted-foreground">
          {hunt.city}, {hunt.country}
        </p>
        <p className="mt-6 text-foreground/75 leading-relaxed">{hunt.description}</p>
      </Reveal>

      <div className="mt-8 grid lg:grid-cols-2 gap-8 items-start">
        <Reveal delay={0.1}>
          <div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: Clock, label: hunt.durationLabel },
                { icon: MapPin, label: hunt.locationLabel },
                { icon: Users, label: hunt.playersLabel },
                { icon: Sparkles, label: "24-hour resume code included" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm">
                  <Icon className="w-4 h-4 text-primary" />
                  {label}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-border bg-card p-6">
              <h3 className="text-2xl font-display text-ink">What this hunt is</h3>
              <p className="mt-3 text-foreground/75 leading-relaxed">
                A self-guided mobile clue hunt through Split with short story chapters, location-based
                answers, and a physical souvenir reward at the finish.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="rounded-2xl overflow-hidden border border-border bg-card">
            <div className="aspect-[16/8] bg-muted overflow-hidden">
              {imageError ? (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-blue-100 to-blue-200 grid place-items-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-primary mx-auto" />
                    <p className="mt-2 text-sm text-ink">{hunt.city}, {hunt.country}</p>
                  </div>
                </div>
              ) : (
                <img
                  src={
                    hunt.heroImageUrl ||
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Split%2C_Diocletian%27s_Palace%2C_Croatia_%2829111806706%29.jpg/1280px-Split%2C_Diocletian%27s_Palace%2C_Croatia_%2829111806706%29.jpg"
                  }
                  alt={`${hunt.city} location`}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-display text-4xl text-ink mt-1">EUR {(hunt.priceCents / 100).toFixed(0)}</p>
              <p className="text-sm text-muted-foreground mt-1">One booking covers 1-6 players.</p>

              {bookable && (
                <>
                  <Link
                    to="/checkout/$slug"
                    params={{ slug: hunt.slug }}
                    className="mt-6 w-full btn-shine group inline-flex items-center justify-center gap-3 rounded-full bg-primary text-white px-7 py-4 text-sm font-medium shadow-paper hover:shadow-glow"
                  >
                    Pay & Start Hunt
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowResume((v) => !v)}
                    className="mt-4 w-full rounded-full border border-border px-6 py-3.5 text-sm font-medium text-ink hover:bg-muted transition-colors"
                  >
                    Resume Existing Hunt
                  </button>
                </>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      {bookable ? (
        showResume && (
          <Reveal delay={0.15}>
            <div className="mt-6 paper-card rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 text-ink mb-4">
                <KeyRound className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs uppercase tracking-widest">Already purchased?</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Enter the email you used at checkout to resume an existing hunt.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setResume(null);
                      setResumeChecked(false);
                    }}
                    placeholder="you@email.com"
                    className="w-full rounded-xl border border-border pl-11 pr-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={checkResume}
                  disabled={checking || !email.trim()}
                  className="rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-muted disabled:opacity-50"
                >
                  {checking ? "Checking…" : "Find my hunt"}
                </button>
              </div>
              {resume && (
                <div className="mt-4 rounded-xl bg-primary/5 border border-primary/20 p-4">
                  <p className="text-sm text-foreground/80">We found an active hunt for this email.</p>
                  <Link
                    to="/play/$token"
                    params={{ token: resume.accessToken }}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary"
                  >
                    Resume hunt <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
              {resumeChecked && !resume && (
                <p className="mt-3 text-xs text-muted-foreground">
                  No paid hunt found for this email on this route yet.
                </p>
              )}
            </div>
          </Reveal>
        )
      ) : (
        <Reveal delay={0.15}>
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-muted/50 p-8 text-center">
            <p className="font-display text-xl text-ink">{huntStatusLabel(hunt.status)}</p>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              This route is visible but not open for booking yet. Join the list on our contact page to hear when it launches.
            </p>
            <Link to="/" hash="contact" className="mt-6 inline-flex text-sm font-medium text-primary">
              Get notified →
            </Link>
          </div>
        </Reveal>
      )}
    </div>
  );
}
