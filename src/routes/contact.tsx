import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Create something worth discovering" },
      { name: "description", content: "Partner, create, or launch a hunt with Souvenir Hunt." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <header className="grid md:grid-cols-12 gap-12 mb-20">
        <Reveal className="md:col-span-4">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Contact</p>
        </Reveal>
        <Reveal className="md:col-span-8" delay={0.1}>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] text-ink text-balance">
            Create something <em className="italic font-light">worth discovering.</em>
          </h1>
          <p className="mt-8 text-lg text-foreground/75 max-w-2xl">
            Want to partner, create, or launch a hunt? Bring your city, your artwork, or your venue into the experience. We're building premium clue hunts shaped by local people. Let's build something people will remember.
          </p>
        </Reveal>
      </header>

      <div className="grid md:grid-cols-12 gap-6">
        <Reveal className="md:col-span-7">
          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="paper-card grain rounded-3xl p-8 md:p-10 space-y-5"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Name" placeholder="Your name" />
              <Field label="Email" type="email" placeholder="you@city.com" />
            </div>
            <Field label="City / Venue" placeholder="Where would you bring a hunt?" />
            <label className="block">
              <span className="text-xs font-mono tracking-widest uppercase text-muted-foreground">Message</span>
              <textarea
                rows={5}
                placeholder="Tell us about your idea…"
                className="mt-2 w-full rounded-2xl bg-muted/60 border border-border px-5 py-4 text-ink outline-none focus:border-ink transition-colors resize-none"
              />
            </label>
            <button
              type="submit"
              className="group inline-flex items-center gap-3 rounded-full bg-ink text-parchment px-7 py-4 text-sm font-medium hover:bg-accent transition-colors"
            >
              {sent ? "Sent — we'll be in touch" : "Send message"}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </Reveal>

        <Reveal className="md:col-span-5" delay={0.1}>
          <div className="paper-card rounded-3xl p-8 h-full flex flex-col">
            <Mail className="w-6 h-6 text-accent mb-6" />
            <p className="font-display text-2xl text-ink leading-snug">
              Or write directly — we read every note.
            </p>
            <a href="mailto:hello@souvenirhunt.co" className="mt-6 ink-underline text-ink font-medium">
              hello@souvenirhunt.co
            </a>
            <div className="mt-auto pt-12 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Based</p>
                <p className="mt-1 text-ink">Split · Croatia</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Reply in</p>
                <p className="mt-1 text-ink">~48 hours</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function Field({ label, type = "text", placeholder }: { label: string; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-mono tracking-widest uppercase text-muted-foreground">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl bg-muted/60 border border-border px-5 py-4 text-ink outline-none focus:border-ink transition-colors"
      />
    </label>
  );
}
