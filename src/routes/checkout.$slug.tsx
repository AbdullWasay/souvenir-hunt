import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Clock,
  Users,
  MapPin,
  Mail,
  User,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Lock,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SiteCityscapeBg } from "@/components/site/SiteCityscapeBg";
import { getHuntBySlug } from "@/server/hunts";
import { createCheckoutSession } from "@/server/checkout";
import { isHuntBookable } from "@/lib/types";

export const Route = createFileRoute("/checkout/$slug")({
  loader: ({ params }) => getHuntBySlug({ data: params.slug }),
  component: CheckoutPage,
});

const HUNT_IMAGE_FALLBACK = "/assets/branding/split-hunt-image.svg";

function CheckoutPage() {
  const hunt = Route.useLoaderData();
  if (!hunt || !isHuntBookable(hunt.status)) throw notFound();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { url } = await createCheckoutSession({
        data: { huntSlug: hunt.slug, email, name },
      });
      if (url) window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const price = hunt.priceCents ? (hunt.priceCents / 100).toFixed(0) : "25";
  const heroImage = hunt.heroImageUrl || HUNT_IMAGE_FALLBACK;

  return (
    <div className="relative w-full pb-20">
      <SiteCityscapeBg />
      <div className="relative z-[1]">
      {/* Top banner */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/88 to-white/75" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(10,77,255,0.12),transparent_50%)]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-10 md:py-14">
          <Reveal>
            <Link
              to="/hunts/$slug"
              params={{ slug: hunt.slug }}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to hunt details
            </Link>
          </Reveal>

          <div className="mt-8 grid md:grid-cols-[1fr_auto] gap-8 items-end">
            <Reveal delay={0.05}>
              <div>
                <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary">Secure checkout</p>
                <h1 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] text-ink text-balance">
                  You&apos;re one step from <em className="italic font-light text-primary">the trail.</em>
                </h1>
                <p className="mt-4 text-foreground/75 max-w-xl leading-relaxed">
                  Pay once, get your private play link by email, and start exploring {hunt.city} on your phone —
                  no app download required.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="hidden md:flex flex-col gap-2 text-right">
                <span className="stamp text-muted-foreground self-end">
                  <MapPin className="w-3 h-3" /> {hunt.city}
                </span>
                <span className="inline-flex items-center gap-2 self-end rounded-full bg-moss/15 text-moss px-3 py-1 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-moss animate-pulse" />
                  Live hunt
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 mt-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 lg:items-stretch">
          {/* Form */}
          <Reveal className="lg:col-span-7 h-full">
            <div className="paper-card rounded-[1.5rem] overflow-hidden h-full flex flex-col">
              <div className="border-b border-border bg-gradient-to-r from-primary/5 to-transparent px-6 md:px-8 py-5">
                <div className="flex items-center gap-3">
                  <span className="grid place-items-center w-8 h-8 rounded-full bg-primary text-white text-sm font-semibold">
                    1
                  </span>
                  <div>
                    <p className="font-medium text-ink">Your details</p>
                    <p className="text-xs text-muted-foreground">We&apos;ll send your play link here</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-1 flex-col gap-6">
                <label className="block">
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    Email address
                  </span>
                  <div className="relative mt-2">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full rounded-xl border border-border bg-white pl-11 pr-4 py-3.5 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-shadow"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    Full name
                  </span>
                  <div className="relative mt-2">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-border bg-white pl-11 pr-4 py-3.5 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-shadow"
                    />
                  </div>
                </label>

                <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/8 to-blue-50/80 p-5">
                  <div className="flex gap-3">
                    <Smartphone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      After payment, your private play link is emailed instantly. It works in any mobile browser
                      and stays valid for 24 hours from first use — perfect for groups of up to six.
                    </p>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <div className="mt-auto space-y-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-shine w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-white py-4 text-sm font-medium shadow-paper hover:shadow-glow disabled:opacity-60 transition-all"
                  >
                    {loading ? "Redirecting to secure payment…" : "Continue to payment"}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> Stripe secure checkout
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Encrypted payment
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </Reveal>

          {/* Order summary */}
          <Reveal className="lg:col-span-5 h-full" delay={0.08}>
            <article className="paper-card rounded-[1.5rem] overflow-hidden h-full flex flex-col">
                <div className="relative aspect-[16/10] shrink-0 bg-ink/90">
                  <img
                    src={heroImage}
                    alt={`${hunt.city}, ${hunt.country}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/70">Your hunt</p>
                    <h2 className="mt-1 font-display text-2xl text-white">{hunt.name}</h2>
                    <p className="mt-1 text-sm text-white/80">
                      {hunt.city}, {hunt.country}
                    </p>
                  </div>
                </div>

                <div className="p-6 flex flex-1 flex-col gap-4">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: Clock, label: hunt.durationLabel },
                      { icon: Users, label: hunt.playersLabel },
                      { icon: MapPin, label: hunt.locationLabel },
                      { icon: Sparkles, label: "Souvenir reward" },
                    ].map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 rounded-xl bg-muted/70 border border-border/60 px-3 py-2.5 text-xs text-ink"
                      >
                        <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="leading-tight">{label}</span>
                      </div>
                    ))}
                  </div>

                  <p className="flex-1 text-sm text-foreground/70 leading-relaxed line-clamp-4 border-t border-border pt-4">
                    {hunt.description}
                  </p>

                  <div className="mt-auto rounded-xl bg-muted/50 border border-border p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Hunt access (1–6 players)</span>
                      <span className="font-medium text-ink">EUR {price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Digital play link</span>
                      <span className="text-moss font-medium">Included</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">24h resume window</span>
                      <span className="text-moss font-medium">Included</span>
                    </div>
                    <div className="pt-3 border-t border-border flex justify-between items-baseline">
                      <span className="font-medium text-ink">Total due today</span>
                      <span className="font-display text-3xl text-primary">EUR {price}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-border bg-white/60 px-5 py-4 text-center">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Questions before buying?{" "}
                      <Link to="/" hash="contact" className="text-primary font-medium hover:underline">
                        Contact us
                      </Link>
                    </p>
                  </div>
                </div>
            </article>
          </Reveal>
        </div>
      </div>
      </div>
    </div>
  );
}
