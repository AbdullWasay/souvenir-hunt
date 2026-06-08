import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Copy, CheckCircle2, Mail } from "lucide-react";
import { useState } from "react";
import { fulfillCheckoutSession } from "@/server/checkout";
import { Reveal } from "@/components/site/Reveal";
import { SiteCityscapeBg } from "@/components/site/SiteCityscapeBg";

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
      <div className="relative isolate min-h-[70vh]">
        <SiteCityscapeBg />
        <div className="relative z-[1] mx-auto max-w-[420px] px-5 py-16 text-center sm:px-6 sm:py-20">
          <h1 className="font-display text-2xl text-ink">Payment pending</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
            We couldn&apos;t confirm your payment yet. If you completed checkout, refresh in a moment or check your email.
          </p>
          <Link to="/hunts" className="mt-8 inline-flex text-sm font-medium text-primary">
            Back to hunts
          </Link>
        </div>
      </div>
    );
  }

  async function copyLink() {
    await navigator.clipboard.writeText(result.playUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative isolate min-h-[70vh]">
      <SiteCityscapeBg />
      <div className="relative z-[1] mx-auto max-w-[420px] px-5 py-12 sm:max-w-xl sm:px-6 sm:py-16 md:py-20">
      <Reveal className="flex flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-moss/10">
          <CheckCircle2 className="h-9 w-9 text-moss" strokeWidth={1.75} />
        </span>
        <h1 className="mt-5 font-display text-[clamp(1.75rem,6vw,2.25rem)] font-semibold leading-tight text-ink">
          You&apos;re in.
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-foreground/75">
          Payment confirmed for <strong>{result.name}</strong>. We&apos;ve sent your private play link to{" "}
          <strong>{result.email}</strong>.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="paper-card mt-8 rounded-2xl p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-center gap-2 text-sm text-muted-foreground sm:justify-start">
            <Mail className="h-4 w-4 shrink-0" />
            Your access code
          </div>
          <p className="break-all text-center font-mono text-base tracking-wider text-ink sm:text-left sm:text-lg">
            {result.accessToken}
          </p>
          <Link
            to="/play/$token"
            params={{ token: result.accessToken }}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary py-3.5 text-sm font-medium text-white"
          >
            Start playing now
          </Link>
          <button
            type="button"
            onClick={copyLink}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border py-3 text-sm hover:bg-muted"
          >
            {copied ? <CheckCircle2 className="h-4 w-4 text-moss" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy play link"}
          </button>
        </div>
      </Reveal>
      </div>
    </div>
  );
}
