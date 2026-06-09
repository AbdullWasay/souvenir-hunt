import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { KeyRound, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SiteCityscapeBg } from "@/components/site/SiteCityscapeBg";
import { getOrderByAccessToken } from "@/server/checkout";

export const Route = createFileRoute("/your-hunt")({
  head: () => ({
    meta: [
      { title: "Your Hunt — Resume with your access code" },
      { name: "description", content: "Return with your code and continue from where you stopped." },
    ],
  }),
  component: YourHuntPage,
});

function YourHuntPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = code.trim().toUpperCase();
      const data = await getOrderByAccessToken({ data: token });
      if (!data) {
        setError("Invalid or unpaid access code. Check your confirmation email.");
        return;
      }
      navigate({ to: "/play/$token", params: { token: data.order.accessToken } });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative isolate min-h-[70vh]">
      <SiteCityscapeBg />
      <div className="relative z-[1] mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16 md:py-20">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Your hunt</p>
      </Reveal>
      <Reveal delay={0.1}>
        <h1 className="mt-4 font-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] text-ink text-balance">
          Resume with your <em className="italic font-light">access code.</em>
        </h1>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-4 text-foreground/75 text-sm md:text-base">
          Enter the code from your purchase confirmation email to continue your hunt.
        </p>
      </Reveal>

      <Reveal delay={0.3}>
        <form
          onSubmit={handleSubmit}
          className="mt-10 paper-card rounded-2xl p-6 md:p-8 relative overflow-hidden"
        >
          <motion.div
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-amber-seal/20 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <div className="relative">
            <div className="flex items-center gap-3 mb-6 text-ink">
              <KeyRound className="w-5 h-5 text-accent" />
              <span className="font-mono text-xs tracking-widest uppercase">Resume a hunt</span>
            </div>

            <label className="block">
              <span className="text-sm text-muted-foreground">Enter access code</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="HUNT-XXXX-XXXX"
                className="mt-3 w-full rounded-xl bg-muted/60 border border-border px-5 py-4 text-xl font-mono tracking-[0.15em] text-ink outline-none focus:border-primary transition-colors uppercase placeholder:text-muted-foreground/50"
              />
            </label>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="mt-6 group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-ink text-parchment px-7 py-4 text-sm font-medium hover:bg-primary transition-colors disabled:opacity-50"
            >
              {loading ? "Checking…" : "Resume hunt"}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </form>
      </Reveal>
      </div>
    </div>
  );
}
