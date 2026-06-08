import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { scrollRevealBootScript } from "@/lib/scroll-reveal";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { CursorGlow } from "@/components/site/CursorGlow";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">Route 404</p>
        <h1 className="mt-4 font-display text-7xl text-ink">Off the map.</h1>
        <p className="mt-4 text-muted-foreground">This page wandered into uncharted territory.</p>
        <Link to="/" className="mt-8 inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm text-parchment hover:bg-accent transition-colors">
          Return to the trailhead
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-ink">A clue slipped through the cracks.</h1>
        <p className="mt-3 text-sm text-muted-foreground">Try again — the route is still here.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-full bg-ink text-parchment px-6 py-3 text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Souvenir Hunt — Self-guided city hunts with a keepsake" },
      { name: "description", content: "A clean self-guided city hunt with hidden stories, playful clues, and a keepsake at the end." },
      { property: "og:title", content: "Souvenir Hunt" },
      { property: "og:description", content: "Sightseeing made worth remembering." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Inter:wght@300..600&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: scrollRevealBootScript }} />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const routeMeta = useRouterState({
    select: (s) => {
      const p = s.location.pathname;
      const hideChrome = p.startsWith("/admin") || p.startsWith("/staff");
      const hideHeaderFooter =
        p.startsWith("/play/") && s.location.hash.replace(/^#/, "") === "complete";
      const isPlay = p.startsWith("/play/");
      return { hideChrome, hideHeaderFooter, isPlay };
    },
  });
  const { hideChrome, hideHeaderFooter, isPlay } = routeMeta;

  return (
    <QueryClientProvider client={queryClient}>
      {!hideChrome && <CursorGlow />}
      {!hideChrome && <ScrollProgress />}
      {!hideChrome && !hideHeaderFooter && <Header />}
      <main
        className={
          hideChrome
            ? "relative z-10 isolate min-h-screen"
            : isPlay
              ? "relative z-10 pt-[5.5rem] sm:pt-28 isolate"
              : "relative z-10 pt-28 isolate"
        }
      >
        <Outlet />
      </main>
      {!hideChrome && !hideHeaderFooter && (
        <div className="relative z-10">
          <Footer variant={isPlay ? "play" : "default"} />
        </div>
      )}
    </QueryClientProvider>
  );
}
