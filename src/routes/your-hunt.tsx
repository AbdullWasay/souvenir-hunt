import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { KeyRound, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

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
  const [code, setCode] = useState("");
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Your hunt</p>
      </Reveal>
      <Reveal delay={0.1}>
        <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-ink text-balance">
          Resume with your <em className="italic font-light">access code.</em>
        </h1>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-6 text-lg text-foreground/75">
          If the hunt is still active, return with your code and continue from where you stopped.
        </p>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="mt-12 paper-card grain rounded-3xl p-8 md:p-10 relative overflow-hidden">
          <motion.div
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-amber-seal/20 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }}
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
                className="mt-3 w-full rounded-2xl bg-muted/60 border border-border px-5 py-5 text-2xl font-mono tracking-[0.2em] text-ink outline-none focus:border-ink transition-colors uppercase placeholder:text-muted-foreground/50"
              />
            </label>

            <button className="mt-6 group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-ink text-parchment px-7 py-4 text-sm font-medium hover:bg-accent transition-colors">
              Resume hunt
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
