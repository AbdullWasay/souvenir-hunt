import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Copy, CheckCircle2, Mail } from "lucide-react";
import { useState } from "react";
import { fulfillCheckoutSession } from "@/server/checkout";
import { Reveal } from "@/components/site/Reveal";

const searchSchema = z.object({
  session_id: z.string().optional(),
});

export const Route = createFileRoute("/checkout/success")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ sessionId: search.session_id }),
  loader: async ({ deps }) => {
    if (!deps.sessionId) return { paid: false as const };
    return fulfillCheckoutSession({ data: deps.sessionId });
  },
  component: CheckoutSuccessPage,
});

function CheckoutSuccessPage() {
  const result = Route.useLoaderData();
  const [copied, setCopied] = useState(false);

  if (!result.paid) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-2xl text-ink">Payment pending</h1>
        <p className="mt-3 text-muted-foreground text-sm">
          We couldn&apos;t confirm your payment yet. If you completed checkout, refresh in a moment or check your email.
        </p>
        <Link to="/hunts" className="mt-8 inline-flex text-primary text-sm font-medium">
          Back to hunts
        </Link>
      </div>
    );
  }

  async function copyLink() {
    await navigator.clipboard.writeText(result.playUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16 md:py-20">
      <Reveal>
        <CheckCircle2 className="w-12 h-12 text-moss" />
        <h1 className="mt-6 font-display text-[clamp(1.5rem,3vw,2.25rem)] text-ink">You&apos;re in.</h1>
        <p className="mt-3 text-foreground/75 text-sm leading-relaxed">
          Payment confirmed for <strong>{result.name}</strong>. We&apos;ve sent your private play link to{" "}
          <strong>{result.email}</strong>.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-8 paper-card rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Mail className="w-4 h-4" />
            Your access code
          </div>
          <p className="font-mono text-lg tracking-wider text-ink">{result.accessToken}</p>
          <Link
            to="/play/$token"
            params={{ token: result.accessToken }}
            className="mt-6 w-full inline-flex items-center justify-center rounded-full bg-primary text-white py-3.5 text-sm font-medium"
          >
            Start playing now
          </Link>
          <button
            type="button"
            onClick={copyLink}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full border border-border py-3 text-sm hover:bg-muted"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-moss" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy play link"}
          </button>
        </div>
      </Reveal>
    </div>
  );
}
