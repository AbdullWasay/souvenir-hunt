import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Trash2, Save, ArrowLeft, Eye, EyeOff, MapPin, Lightbulb,
  Compass, Map, Sparkles, Search, ChevronRight,
} from "lucide-react";
import {
  type Hunt, type Step, type Hint,
  loadHunts, saveHunts, newHunt, newStep, newHint,
} from "@/lib/admin-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Souvenir Hunt" },
      { name: "description", content: "Author hunts, steps and hints." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [hunts, setHunts] = useState<Hunt[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    const h = loadHunts();
    setHunts(h);
    if (h.length) setSelectedId(h[0].id);
  }, []);

  const selected = useMemo(
    () => hunts.find((h) => h.id === selectedId) ?? null,
    [hunts, selectedId]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return hunts;
    return hunts.filter(
      (h) => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q)
    );
  }, [hunts, query]);

  function persist(next: Hunt[]) {
    setHunts(next);
    saveHunts(next);
    setSavedAt(Date.now());
  }

  function updateSelected(patch: Partial<Hunt>) {
    if (!selected) return;
    persist(
      hunts.map((h) =>
        h.id === selected.id ? { ...h, ...patch, updatedAt: Date.now() } : h
      )
    );
  }

  function addHunt() {
    const h = newHunt();
    persist([h, ...hunts]);
    setSelectedId(h.id);
  }

  function deleteHunt(id: string) {
    const next = hunts.filter((h) => h.id !== id);
    persist(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? null);
  }

  function addStep() {
    if (!selected) return;
    updateSelected({ steps: [...selected.steps, newStep()] });
  }

  function updateStep(stepId: string, patch: Partial<Step>) {
    if (!selected) return;
    updateSelected({
      steps: selected.steps.map((s) => (s.id === stepId ? { ...s, ...patch } : s)),
    });
  }

  function deleteStep(stepId: string) {
    if (!selected) return;
    updateSelected({ steps: selected.steps.filter((s) => s.id !== stepId) });
  }

  function addHint(stepId: string) {
    if (!selected) return;
    updateStep(stepId, {
      hints: [...(selected.steps.find((s) => s.id === stepId)?.hints ?? []), newHint()],
    });
  }

  function updateHint(stepId: string, hintId: string, patch: Partial<Hint>) {
    if (!selected) return;
    const step = selected.steps.find((s) => s.id === stepId);
    if (!step) return;
    updateStep(stepId, {
      hints: step.hints.map((h) => (h.id === hintId ? { ...h, ...patch } : h)),
    });
  }

  function deleteHint(stepId: string, hintId: string) {
    if (!selected) return;
    const step = selected.steps.find((s) => s.id === stepId);
    if (!step) return;
    updateStep(stepId, { hints: step.hints.filter((h) => h.id !== hintId) });
  }

  return (
    <div className="-mt-28 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/60 pt-28">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-blue-100/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="grid h-10 w-10 place-items-center rounded-full bg-ink text-parchment">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-blue-600">
                Control Room
              </div>
              <div className="font-display text-xl text-ink">Hunt Studio</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {savedAt && (
              <span className="hidden text-xs text-muted-foreground sm:inline">
                Saved {new Date(savedAt).toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={addHunt}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> New hunt
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[320px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search hunts…"
                className="w-full rounded-full border border-blue-100 bg-blue-50/50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-blue-200 bg-white/70 p-6 text-center text-sm text-muted-foreground">
                No hunts yet. Create your first one.
              </div>
            )}
            {filtered.map((h) => {
              const active = h.id === selectedId;
              return (
                <button
                  key={h.id}
                  onClick={() => setSelectedId(h.id)}
                  className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? "border-blue-500 bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg"
                      : "border-blue-100 bg-white hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className={`truncate font-display text-base ${active ? "text-white" : "text-ink"}`}>
                        {h.name || "Untitled"}
                      </div>
                      <div className={`mt-1 flex items-center gap-2 text-xs ${active ? "text-blue-100" : "text-muted-foreground"}`}>
                        <MapPin className="h-3 w-3" />
                        {h.city || "No city"} · {h.steps.length} steps
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                        h.published
                          ? active
                            ? "bg-white/20 text-white"
                            : "bg-emerald-100 text-emerald-700"
                          : active
                          ? "bg-white/10 text-blue-100"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {h.published ? "Live" : "Draft"}
                    </span>
                  </div>
                  <ChevronRight
                    className={`absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-transform ${
                      active ? "translate-x-1 text-white" : "text-blue-300 group-hover:translate-x-1"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </aside>

        {/* Editor */}
        <section className="space-y-6">
          {!selected ? (
            <EmptyState onCreate={addHunt} />
          ) : (
            <>
              <HuntHeader
                hunt={selected}
                onChange={updateSelected}
                onDelete={() => deleteHunt(selected.id)}
              />

              <StatsRow hunt={selected} />

              <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-blue-600" />
                    <h2 className="font-display text-2xl text-ink">Steps</h2>
                    <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {selected.steps.length}
                    </span>
                  </div>
                  <button
                    onClick={addStep}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                  >
                    <Plus className="h-4 w-4" /> Add step
                  </button>
                </div>

                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {selected.steps.map((step, i) => (
                      <motion.div
                        key={step.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                      >
                        <StepCard
                          index={i + 1}
                          step={step}
                          onChange={(p) => updateStep(step.id, p)}
                          onDelete={() => deleteStep(step.id)}
                          onAddHint={() => addHint(step.id)}
                          onUpdateHint={(hid, p) => updateHint(step.id, hid, p)}
                          onDeleteHint={(hid) => deleteHint(step.id, hid)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {selected.steps.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-10 text-center">
                      <Compass className="mx-auto h-8 w-8 text-blue-400" />
                      <p className="mt-3 text-sm text-muted-foreground">
                        No steps yet. Add the first clue to start charting the hunt.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function HuntHeader({
  hunt, onChange, onDelete,
}: {
  hunt: Hunt;
  onChange: (p: Partial<Hunt>) => void;
  onDelete: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/60 to-white shadow-sm">
      <div className="border-b border-blue-100 bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-3 text-white">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em]">
            <Sparkles className="h-3.5 w-3.5" /> Editing
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onChange({ published: !hunt.published })}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium hover:bg-white/25"
            >
              {hunt.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              {hunt.published ? "Published" : "Draft"}
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete "${hunt.name}"? This can't be undone.`)) onDelete();
              }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
        <Field label="Hunt name">
          <input
            value={hunt.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2.5 font-display text-lg text-ink outline-none focus:border-blue-400"
          />
        </Field>
        <Field label="City">
          <input
            value={hunt.city}
            onChange={(e) => onChange({ city: e.target.value })}
            placeholder="e.g. Lisbon"
            className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2.5 text-ink outline-none focus:border-blue-400"
          />
        </Field>
        <Field label="Description" className="md:col-span-2">
          <textarea
            value={hunt.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={3}
            placeholder="Tell the player what they'll discover…"
            className="w-full resize-none rounded-xl border border-blue-100 bg-white px-3 py-2.5 text-ink outline-none focus:border-blue-400"
          />
        </Field>
        <Field label="Difficulty">
          <select
            value={hunt.difficulty}
            onChange={(e) => onChange({ difficulty: e.target.value as Hunt["difficulty"] })}
            className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2.5 text-ink outline-none focus:border-blue-400"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </Field>
        <Field label="Duration (min)">
          <input
            type="number"
            min={10}
            max={600}
            value={hunt.durationMin}
            onChange={(e) => onChange({ durationMin: Number(e.target.value) || 0 })}
            className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2.5 text-ink outline-none focus:border-blue-400"
          />
        </Field>
      </div>
    </div>
  );
}

function StatsRow({ hunt }: { hunt: Hunt }) {
  const totalHints = hunt.steps.reduce((n, s) => n + s.hints.length, 0);
  const items = [
    { label: "Steps", value: hunt.steps.length },
    { label: "Hints", value: totalHints },
    { label: "Difficulty", value: hunt.difficulty },
    { label: "Duration", value: `${hunt.durationMin}m` },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-blue-100 bg-white px-4 py-3 shadow-sm"
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-blue-600">
            {s.label}
          </div>
          <div className="mt-1 font-display text-2xl text-ink capitalize">{s.value}</div>
        </div>
      ))}
    </div>
  );
}

function StepCard({
  index, step, onChange, onDelete, onAddHint, onUpdateHint, onDeleteHint,
}: {
  index: number;
  step: Step;
  onChange: (p: Partial<Step>) => void;
  onDelete: () => void;
  onAddHint: () => void;
  onUpdateHint: (hid: string, p: Partial<Hint>) => void;
  onDeleteHint: (hid: string) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/40">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-600 font-mono text-sm text-white">
            {String(index).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <div className="truncate font-display text-lg text-ink">
              {step.title || "Untitled step"}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {step.location || "No location"} · {step.hints.length} hints
            </div>
          </div>
        </div>
        <ChevronRight
          className={`h-4 w-4 text-blue-500 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-4 border-t border-blue-100 bg-white p-5 md:grid-cols-2">
              <Field label="Title">
                <input
                  value={step.title}
                  onChange={(e) => onChange({ title: e.target.value })}
                  className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-ink outline-none focus:border-blue-400"
                />
              </Field>
              <Field label="Location">
                <input
                  value={step.location ?? ""}
                  onChange={(e) => onChange({ location: e.target.value })}
                  placeholder="e.g. Praça do Comércio"
                  className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-ink outline-none focus:border-blue-400"
                />
              </Field>
              <Field label="Clue" className="md:col-span-2">
                <textarea
                  value={step.clue}
                  onChange={(e) => onChange({ clue: e.target.value })}
                  rows={3}
                  placeholder="What riddle does the player need to solve?"
                  className="w-full resize-none rounded-xl border border-blue-100 bg-white px-3 py-2 text-ink outline-none focus:border-blue-400"
                />
              </Field>
              <Field label="Answer" className="md:col-span-2">
                <input
                  value={step.answer}
                  onChange={(e) => onChange({ answer: e.target.value })}
                  placeholder="Accepted answer"
                  className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2 font-mono text-ink outline-none focus:border-blue-400"
                />
              </Field>

              {/* Hints */}
              <div className="md:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-ink">
                    <Lightbulb className="h-4 w-4 text-amber-500" /> Hints
                  </div>
                  <button
                    onClick={onAddHint}
                    className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                  >
                    <Plus className="h-3 w-3" /> Hint
                  </button>
                </div>

                <div className="space-y-2">
                  {step.hints.map((h, i) => (
                    <div
                      key={h.id}
                      className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/40 p-2"
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white font-mono text-xs text-blue-700">
                        {i + 1}
                      </span>
                      <input
                        value={h.text}
                        onChange={(e) => onUpdateHint(h.id, { text: e.target.value })}
                        placeholder="Hint text"
                        className="flex-1 rounded-lg border border-transparent bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-300"
                      />
                      <input
                        type="number"
                        min={0}
                        value={h.cost}
                        onChange={(e) => onUpdateHint(h.id, { cost: Number(e.target.value) || 0 })}
                        className="w-16 rounded-lg border border-transparent bg-white px-2 py-1.5 text-center text-sm outline-none focus:border-blue-300"
                        title="Cost"
                      />
                      <button
                        onClick={() => onDeleteHint(h.id)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {step.hints.length === 0 && (
                    <p className="rounded-xl border border-dashed border-blue-200 bg-white px-4 py-3 text-center text-xs text-muted-foreground">
                      No hints yet — players will fly blind.
                    </p>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 flex items-center justify-between border-t border-blue-100 pt-4">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Save className="h-3 w-3" /> Changes save automatically
                </span>
                <button
                  onClick={() => {
                    if (confirm("Delete this step?")) onDelete();
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" /> Remove step
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label, children, className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-blue-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-blue-200 bg-white/70 p-16 text-center">
      <Compass className="mx-auto h-10 w-10 text-blue-400" />
      <h2 className="mt-4 font-display text-3xl text-ink">No hunt selected</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick one from the left or start a fresh adventure.
      </p>
      <button
        onClick={onCreate}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        <Plus className="h-4 w-4" /> Create hunt
      </button>
    </div>
  );
}
