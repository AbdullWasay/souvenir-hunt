import { useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, MapPin, X, ZoomIn } from "lucide-react";
import { SiteCityscapeBg } from "@/components/site/SiteCityscapeBg";

export function PlayMobileShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`play-mobile relative w-full ${className}`}>
      <SiteCityscapeBg />
      <div className="play-mobile-inner relative z-[1] mx-auto flex w-full max-w-[420px] flex-col gap-2 px-4 py-2 sm:gap-3 sm:px-5 sm:py-4">
        {children}
      </div>
    </div>
  );
}

type PlayMediaFrameProps = {
  imageUrl: string;
  label: string;
  title?: string;
  badgeRight?: string;
  variant?: "hero" | "banner" | "step" | "scene";
  className?: string;
  zoomable?: boolean;
};

function PlayImageLightbox({
  imageUrl,
  label,
  open,
  onClose,
}: {
  imageUrl: string;
  label: string;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/92 p-4 touch-manipulation"
      role="dialog"
      aria-modal="true"
      aria-label={`Zoomed view: ${label}`}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close zoomed image"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm touch-manipulation"
      >
        <X className="h-5 w-5" />
      </button>
      <img
        src={imageUrl}
        alt={label}
        className="max-h-[92dvh] max-w-full object-contain"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}

/** Cinematic hunt imagery — consistent ratios, no crushed max-height caps. */
export function PlayMediaFrame({
  imageUrl,
  label,
  title,
  badgeRight,
  variant = "banner",
  className = "",
  zoomable = true,
}: PlayMediaFrameProps) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const ratio =
    variant === "scene"
      ? "aspect-[16/9] max-h-[132px]"
      : variant === "hero"
        ? "aspect-[16/11]"
        : variant === "step"
          ? "aspect-[16/10]"
          : "aspect-[16/11]";

  const isScene = variant === "scene";

  const frame = (
    <>
      <img
        src={imageUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
      />
      {isScene ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-[#061428]/55 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(120,180,255,0.28),transparent_50%)]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-[#061428]/90 via-[#0c2d5c]/35 to-[#1a4a8a]/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(120,180,255,0.35),transparent_55%)]" />
        </>
      )}
      <div className="absolute inset-0 ring-1 ring-inset ring-white/15" />

      {zoomable && (
        <span className="pointer-events-none absolute bottom-2.5 right-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white/90 opacity-85 backdrop-blur-md">
          <ZoomIn className="h-3.5 w-3.5" />
        </span>
      )}

      {isScene ? (
        <>
          <span className="pointer-events-none absolute left-2.5 top-2.5 inline-flex items-center rounded-full border border-white/35 bg-black/30 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white backdrop-blur-md">
            {label}
          </span>
          {badgeRight && (
            <span className="pointer-events-none absolute right-2.5 top-2.5 inline-flex items-center rounded-full border border-white/35 bg-primary/80 px-2 py-0.5 font-mono text-[9px] font-semibold tabular-nums text-white backdrop-blur-md">
              {badgeRight}
            </span>
          )}
        </>
      ) : (
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center px-5 text-center ${
            variant === "step" ? "pb-4 pt-16" : "pb-5 pt-20"
          }`}
        >
          <span className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-white/95 backdrop-blur-md">
            {label}
          </span>
          {title && (
            <h2
              className={`mt-2.5 font-display font-semibold leading-[1.08] tracking-[-0.02em] text-white text-balance ${
                variant === "hero" ? "text-[1.5rem] sm:text-[1.65rem]" : "text-[1.2rem] sm:text-[1.35rem]"
              }`}
            >
              {title}
            </h2>
          )}
        </div>
      )}
    </>
  );

  return (
    <>
      {zoomable ? (
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          aria-label={`View ${label} image full size`}
          className={`play-media-frame group relative w-full overflow-hidden bg-ink/10 text-left touch-manipulation cursor-zoom-in active:opacity-95 ${ratio} ${className}`}
        >
          {frame}
        </button>
      ) : (
        <div className={`play-media-frame relative w-full overflow-hidden bg-ink/10 ${ratio} ${className}`}>
          {frame}
        </div>
      )}
      {zoomable && (
        <PlayImageLightbox
          imageUrl={imageUrl}
          label={label}
          open={zoomOpen}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </>
  );
}

/** Unified intro card — hero + actions in one polished block */
export function PlayStartCard({
  imageUrl,
  label,
  title,
  hint,
  locationLabel,
  cityCountry,
  children,
}: {
  imageUrl: string;
  label: string;
  title: string;
  hint: string;
  locationLabel: string;
  cityCountry: string;
  children: ReactNode;
}) {
  return (
    <article className="paper-card overflow-hidden rounded-[1.75rem] border border-border/80 shadow-paper">
      <PlayMediaFrame imageUrl={imageUrl} label={label} title={title} variant="hero" />

      <div className="border-t border-border/60 bg-gradient-to-b from-white to-blue-50/50 px-5 py-5">
        <p className="text-pretty text-center text-[0.88rem] leading-relaxed text-foreground/75">{hint}</p>

        <div className="mt-5 rounded-2xl border border-primary/15 bg-white/95 px-4 py-4 shadow-sm">
          <p className="text-center font-mono text-[9px] uppercase tracking-[0.24em] text-primary">Start point</p>
          <div className="mt-2.5 flex items-start justify-center gap-2 text-center">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <h3 className="font-display text-[1.1rem] leading-snug text-ink">{locationLabel}</h3>
              <p className="mt-0.5 text-[0.8rem] text-muted-foreground">{cityCountry}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center gap-2.5">{children}</div>
        </div>
      </div>
    </article>
  );
}

export function PlayIntroHero({
  imageUrl,
  label,
  title,
  hint,
}: {
  imageUrl: string;
  label: string;
  title: string;
  hint?: string;
}) {
  return (
    <article className="paper-card overflow-hidden rounded-[1.75rem] border border-border/80 shadow-paper">
      <PlayMediaFrame imageUrl={imageUrl} label={label} title={title} variant="hero" />
      {hint && (
        <p className="border-t border-border/50 bg-gradient-to-b from-white to-blue-50/40 px-5 py-4 text-center text-[0.88rem] leading-relaxed text-foreground/75">
          {hint}
        </p>
      )}
    </article>
  );
}

export function PlaySectionHeader({
  label,
  title,
  subtitle,
  compact = false,
}: {
  label: string;
  title: string;
  subtitle?: string;
  compact?: boolean;
}) {
  return (
    <header className="text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">{label}</p>
      <h1
        className={`font-display leading-[1.12] tracking-[-0.02em] text-ink text-balance ${
          compact ? "mt-1 text-[1.15rem]" : "mt-1.5 text-[1.35rem]"
        }`}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className={`mx-auto text-pretty text-foreground/75 ${
            compact ? "mt-1.5 max-w-[34ch] text-[0.8rem] leading-snug" : "mt-2 max-w-[32ch] text-[0.85rem] leading-relaxed"
          }`}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}

export function PlayProgressBanner({
  gameId,
  huntName,
  stepTitle,
  location,
  progressPct,
  total,
  current,
  completedIds,
  stepIds,
  viewing,
  onSelect,
  embedded = false,
}: {
  gameId: string;
  huntName: string;
  stepTitle: string;
  location?: string;
  progressPct: number;
  total: number;
  current: number;
  completedIds: string[];
  stepIds: string[];
  viewing: number;
  onSelect: (i: number) => void;
  embedded?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden bg-gradient-to-br from-primary via-[#1a52e0] to-[#0b3fd4] px-3 py-2.5 text-center text-white ${
        embedded ? "border-b border-white/12" : "rounded-2xl shadow-paper"
      }`}
    >
      <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/55">
        {huntName} · {gameId}
      </p>
      <h2 className="mx-auto mt-1.5 line-clamp-2 max-w-[340px] font-display text-[1.2rem] font-semibold leading-[1.15] text-white sm:text-[1.3rem]">
        {stepTitle}
      </h2>
      {location && (
        <p className="mx-auto mt-1 flex max-w-[300px] items-center justify-center gap-1 text-[9px] text-white/65">
          <MapPin className="h-2.5 w-2.5 shrink-0" />
          <span className="truncate">{location}</span>
        </p>
      )}

      <div className="mx-auto mt-2 flex max-w-[220px] items-center gap-2">
        <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${Math.max(progressPct, 4)}%` }}
          />
        </div>
        <span className="shrink-0 font-mono text-[9px] font-semibold tabular-nums text-white/85">
          {progressPct}%
        </span>
      </div>

      <PlayStepStrip
        theme="light"
        className="mt-1.5"
        total={total}
        current={current}
        completedIds={completedIds}
        stepIds={stepIds}
        viewing={viewing}
        onSelect={onSelect}
      />
    </div>
  );
}

export function PlayGlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-2xl border border-white/90 px-4 py-4 shadow-paper ${className}`}>
      {children}
    </div>
  );
}

export function PlayActions({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-col items-center gap-2.5 ${className || "mt-4"}`}>{children}</div>;
}

export function PlayPrimaryBtn({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`btn-shine inline-flex w-full max-w-[280px] items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-white shadow-paper ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function PlaySecondaryBtn({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex w-full max-w-[280px] items-center justify-center gap-2 rounded-full border border-primary/30 bg-white px-8 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-blue-50/80 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function PlayLinkBtn({
  children,
  className = "",
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={`btn-shine inline-flex w-full max-w-[280px] items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-white shadow-paper ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

export function PlayStepNav({
  stepNumber,
  stepTotal,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  className = "",
}: {
  stepNumber: number;
  stepTotal: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoPrev}
        aria-label="Previous stop"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-white text-primary shadow-sm transition-colors disabled:opacity-35 touch-manipulation active:bg-primary/5"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
      </button>

      <div className="min-w-0 flex-1 text-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Stop</p>
        <p className="font-display text-[1.05rem] font-semibold leading-none text-ink tabular-nums">
          {stepNumber}
          <span className="text-muted-foreground/60"> / {stepTotal}</span>
        </p>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="Next stop"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-white text-primary shadow-sm transition-colors disabled:opacity-35 touch-manipulation active:bg-primary/5"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={2.25} />
      </button>
    </div>
  );
}

export function PlayTabBar({
  tabs,
  active,
  onChange,
  className = "",
}: {
  tabs: { key: string; label: string }[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}) {
  const cols = tabs.length === 3 ? "grid-cols-3" : tabs.length === 2 ? "grid-cols-2" : "grid-cols-4";

  return (
    <div className={`grid ${cols} gap-0.5 rounded-full border border-primary/15 bg-primary/8 p-0.5 ${className}`}>
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`touch-manipulation rounded-full py-1.5 text-[10px] font-semibold tracking-wide transition-colors ${
            active === key ? "bg-primary text-white shadow-sm" : "text-primary/75"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function PlayStepStrip({
  total,
  current,
  completedIds,
  stepIds,
  viewing,
  onSelect,
  theme = "default",
  className = "",
}: {
  total: number;
  current: number;
  completedIds: string[];
  stepIds: string[];
  viewing: number;
  onSelect: (i: number) => void;
  theme?: "default" | "light";
  className?: string;
}) {
  const light = theme === "light";

  return (
    <div className={`flex flex-wrap justify-center gap-1 ${className}`}>
      {Array.from({ length: total }, (_, i) => {
        const done = completedIds.includes(stepIds[i] ?? "");
        const locked = i > current;
        const active = i === viewing;
        return (
          <button
            key={i}
            type="button"
            disabled={locked}
            onClick={() => onSelect(i)}
            className={`h-1.5 touch-manipulation rounded-full transition-all ${
              active
                ? `w-5 ${light ? "bg-white" : "bg-primary"}`
                : done
                  ? `w-1.5 ${light ? "bg-white/55" : "bg-primary/50"}`
                  : locked
                    ? `w-1.5 ${light ? "bg-white/20" : "bg-muted"}`
                    : `w-1.5 ${light ? "bg-white/35" : "bg-primary/25"}`
            }`}
            aria-label={`Step ${i + 1}`}
          />
        );
      })}
    </div>
  );
}

/** @deprecated Use PlayMediaFrame — kept for import compatibility */
export function PlayStepImage({ imageUrl, label }: { imageUrl: string; label: string }) {
  return <PlayMediaFrame imageUrl={imageUrl} label={label} variant="step" className="rounded-2xl" />;
}

export function PlayGameCard({
  children,
  heroImage,
  heroLabel,
  className = "",
}: {
  children: ReactNode;
  heroImage?: string;
  heroLabel?: string;
  className?: string;
}) {
  return (
    <article
      className={`paper-card overflow-hidden rounded-[1.75rem] border border-border/80 shadow-paper ${className}`}
    >
      {heroImage && heroLabel && (
        <PlayMediaFrame imageUrl={heroImage} label={heroLabel} variant="scene" className="rounded-none" />
      )}
      <div className="p-3.5 sm:p-4">{children}</div>
    </article>
  );
}

type PlayActiveSessionProps = {
  gameId: string;
  huntName: string;
  stepNumber: number;
  stepTotal: number;
  stepTitle: string;
  location?: string;
  progressPct: number;
  total: number;
  current: number;
  completedIds: string[];
  stepIds: string[];
  viewing: number;
  onSelect: (i: number) => void;
  heroImage: string;
  heroLabel: string;
  children: ReactNode;
};

/** Unified in-game card — blue progress header, scene image, then tabs & content. */
export function PlayActiveSession({
  gameId,
  huntName,
  stepNumber,
  stepTotal,
  stepTitle,
  location,
  progressPct,
  total,
  current,
  completedIds,
  stepIds,
  viewing,
  onSelect,
  heroImage,
  heroLabel,
  children,
}: PlayActiveSessionProps) {
  return (
    <article className="paper-card overflow-hidden rounded-2xl border border-border/80 shadow-paper">
      <PlayMediaFrame
        imageUrl={heroImage}
        label={heroLabel}
        variant="scene"
        className="rounded-none"
      />
      <PlayProgressBanner
        embedded
        gameId={gameId}
        huntName={huntName}
        stepTitle={stepTitle}
        location={location}
        progressPct={progressPct}
        total={total}
        current={current}
        completedIds={completedIds}
        stepIds={stepIds}
        viewing={viewing}
        onSelect={onSelect}
      />
      <div className="bg-gradient-to-b from-white to-blue-50/25 p-3">{children}</div>
    </article>
  );
}
