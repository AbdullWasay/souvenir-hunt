import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";
import { closeHuntProgress, getStaffCloseContext } from "@/server/checkout";
import { SiteCityscapeBg } from "@/components/site/SiteCityscapeBg";
import { SiteLogo } from "@/components/site/SiteLogo";

export const Route = createFileRoute("/staff/close/$token")({
  loader: ({ params }) => getStaffCloseContext({ data: params.token }),
  component: StaffClosePage,
});

function StaffClosePage() {
  const data = Route.useLoaderData();
  if (!data) throw notFound();

  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [closed, setClosed] = useState(data.alreadyClosed);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await closeHuntProgress({ data: { accessToken: data.accessToken, pin } });
      setClosed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not close this hunt.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative isolate flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <SiteCityscapeBg />
      <div className="relative z-[1] flex w-full max-w-md flex-col items-center">
      <div className="mb-8 flex flex-col items-center gap-3 sm:mb-10">
        <div className="flex items-center gap-3">
          <SiteLogo className="h-10 sm:h-12 w-auto shrink-0 object-contain" alt="" />
          <span className="font-display font-bold text-[1.35rem] sm:text-[1.65rem] leading-none text-primary tracking-tight">
            Souvenir Hunt
          </span>
        </div>
      </div>

      <div className="w-full">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            Staff only
          </span>
          <h1 className="mt-4 font-display text-2xl sm:text-3xl text-ink">Close player hunt</h1>
          <p className="mt-2 text-sm text-muted-foreground">{data.huntName}</p>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-paper">
          {closed ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-14 h-14 text-moss mx-auto" />
              <h2 className="mt-4 font-display text-xl text-ink">Hunt ended</h2>
              <p className="mt-3 text-sm text-foreground/75 leading-relaxed">
                This game has ended for <strong>{data.playerName}</strong> (Game ID {data.gameId}).
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                The player&apos;s screen will update automatically.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-xl bg-muted/50 border border-border px-4 py-3 text-sm">
                <p className="text-muted-foreground">Player</p>
                <p className="font-medium text-ink">{data.playerName}</p>
                <p className="mt-2 font-mono text-xs text-muted-foreground">Game ID · {data.gameId}</p>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    <KeyRound className="w-3.5 h-3.5" />
                    Staff PIN
                  </span>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter staff PIN"
                    className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3.5 text-lg font-mono text-center tracking-widest outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    autoComplete="off"
                  />
                </label>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !pin.trim()}
                  className="w-full rounded-full bg-primary text-white py-3.5 text-sm font-semibold shadow-sm hover:shadow-md disabled:opacity-50 transition-shadow"
                >
                  {loading ? "Closing hunt…" : "Confirm & end hunt"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
