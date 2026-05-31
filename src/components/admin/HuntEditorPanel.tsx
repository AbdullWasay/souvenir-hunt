import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Save,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Lightbulb,
  GripVertical,
  Loader2,
} from "lucide-react";
import type { HuntDoc, HuntStatus, Hint, Step } from "@/lib/types";
import { newStep } from "@/lib/hunt-utils";
import { huntStatusLabel } from "@/lib/types";

export type AdminHunt = Omit<HuntDoc, "_id"> & { id: string };

type HuntEditorPanelProps = {
  hunt: AdminHunt;
  onSave: (hunt: AdminHunt) => Promise<void>;
  onDelete: () => Promise<void>;
};

function normalizeHunt(hunt: AdminHunt): AdminHunt {
  const stepsRaw = Array.isArray(hunt.steps) ? hunt.steps : [];
  const steps = stepsRaw.map((s) => ({
    ...s,
    hints: Array.isArray(s.hints) ? s.hints : [],
  }));
  return {
    ...hunt,
    steps,
    priceCents: hunt.priceCents ?? 0,
    currency: hunt.currency || "eur",
    durationLabel: hunt.durationLabel || "1.5–2 hrs",
    playersLabel: hunt.playersLabel || "1–6 players",
    locationLabel: hunt.locationLabel || "",
    description: hunt.description || "",
    country: hunt.country || "",
    city: hunt.city || "",
    name: hunt.name || "Untitled Hunt",
    slug: hunt.slug || "",
    status: hunt.status || "coming_soon",
    published: hunt.published ?? false,
  };
}

export function HuntEditorPanel({ hunt, onSave, onDelete }: HuntEditorPanelProps) {
  const [draft, setDraft] = useState(() => normalizeHunt(hunt));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(normalizeHunt(hunt));

  useEffect(() => {
    setDraft(normalizeHunt(hunt));
  }, [hunt.id]);

  function patch(p: Partial<AdminHunt>) {
    setDraft((d) => ({ ...d, ...p, updatedAt: Date.now() }));
  }

  function updateStep(stepId: string, p: Partial<Step>) {
    setDraft((d) => ({
      ...d,
      steps: d.steps.map((s) => (s.id === stepId ? { ...s, ...p } : s)),
    }));
  }

  function addHint(stepId: string) {
    const step = draft.steps.find((s) => s.id === stepId);
    if (!step) return;
    updateStep(stepId, {
      hints: [...step.hints, { id: crypto.randomUUID().slice(0, 8), text: "", cost: 1 }],
    });
  }

  function updateHint(stepId: string, hintId: string, p: Partial<Hint>) {
    const step = draft.steps.find((s) => s.id === stepId);
    if (!step) return;
    updateStep(stepId, {
      hints: step.hints.map((h) => (h.id === hintId ? { ...h, ...p } : h)),
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const slug =
        draft.slug.trim() ||
        draft.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") ||
        `hunt-${Date.now()}`;
      await onSave({ ...draft, slug });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${draft.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await onDelete();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{draft.name || "Untitled hunt"}</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            /{draft.slug || "—"} · {huntStatusLabel(draft.status)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {draft.slug && draft.published && (
            <Link
              to="/hunts/$slug"
              params={{ slug: draft.slug }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
            >
              View on site
            </Link>
          )}
          <button
            type="button"
            onClick={() => patch({ published: !draft.published })}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
          >
            {draft.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {draft.published ? "Published" : "Draft"}
          </button>
          <button
            type="button"
            onClick={() => void handleDelete()}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving || !dirty}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-5">
          Hunt details
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Name">
            <input
              value={draft.name}
              onChange={(e) => patch({ name: e.target.value })}
              className="admin-input"
            />
          </AdminField>
          <AdminField label="URL slug">
            <input
              value={draft.slug}
              onChange={(e) => patch({ slug: e.target.value })}
              placeholder="emperors-secret"
              className="admin-input font-mono text-sm"
            />
          </AdminField>
          <AdminField label="Country">
            <input
              value={draft.country}
              onChange={(e) => patch({ country: e.target.value })}
              className="admin-input"
            />
          </AdminField>
          <AdminField label="City">
            <input
              value={draft.city}
              onChange={(e) => patch({ city: e.target.value })}
              className="admin-input"
            />
          </AdminField>
          <AdminField label="Status">
            <select
              value={draft.status}
              onChange={(e) => patch({ status: e.target.value as HuntStatus })}
              className="admin-input"
            >
              <option value="live">Live</option>
              <option value="coming_soon">Coming soon</option>
              <option value="in_design">In design</option>
              <option value="scouting">Scouting</option>
            </select>
          </AdminField>
          <AdminField label="Price (EUR cents)">
            <input
              type="number"
              min={0}
              value={draft.priceCents}
              onChange={(e) => patch({ priceCents: Number(e.target.value) || 0 })}
              className="admin-input"
            />
          </AdminField>
          <AdminField label="Duration label">
            <input
              value={draft.durationLabel}
              onChange={(e) => patch({ durationLabel: e.target.value })}
              className="admin-input"
            />
          </AdminField>
          <AdminField label="Players label">
            <input
              value={draft.playersLabel}
              onChange={(e) => patch({ playersLabel: e.target.value })}
              className="admin-input"
            />
          </AdminField>
          <AdminField label="Location label" className="sm:col-span-2">
            <input
              value={draft.locationLabel}
              onChange={(e) => patch({ locationLabel: e.target.value })}
              className="admin-input"
            />
          </AdminField>
          <AdminField label="Description" className="sm:col-span-2">
            <textarea
              rows={4}
              value={draft.description}
              onChange={(e) => patch({ description: e.target.value })}
              className="admin-input resize-none"
            />
          </AdminField>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Steps ({draft.steps.length})
          </h3>
          <button
            type="button"
            onClick={() => patch({ steps: [...draft.steps, newStep()] })}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <Plus className="h-4 w-4" /> Add step
          </button>
        </div>

        {draft.steps.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500">
            No steps yet. Add the first clue to build this hunt.
          </div>
        ) : (
          <div className="space-y-4">
            {draft.steps.map((step, i) => (
              <div key={step.id} className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-center gap-2 mb-4 text-slate-500">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Step {i + 1}
                  </span>
                </div>
                <div className="grid gap-3">
                  <input
                    value={step.title}
                    onChange={(e) => updateStep(step.id, { title: e.target.value })}
                    placeholder="Step title"
                    className="admin-input"
                  />
                  <input
                    value={step.location ?? ""}
                    onChange={(e) => updateStep(step.id, { location: e.target.value })}
                    placeholder="Location"
                    className="admin-input"
                  />
                  <textarea
                    value={step.clue}
                    onChange={(e) => updateStep(step.id, { clue: e.target.value })}
                    placeholder="Clue text"
                    rows={2}
                    className="admin-input resize-none"
                  />
                  <input
                    value={step.answer}
                    onChange={(e) => updateStep(step.id, { answer: e.target.value })}
                    placeholder="Correct answer"
                    className="admin-input font-mono"
                  />
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Lightbulb className="h-3.5 w-3.5" /> Hints
                    </span>
                    <button
                      type="button"
                      onClick={() => addHint(step.id)}
                      className="text-xs text-primary font-medium"
                    >
                      + Add hint
                    </button>
                  </div>
                  {(step.hints ?? []).map((h) => (
                    <div key={h.id} className="flex gap-2 mt-2">
                      <input
                        value={h.text}
                        onChange={(e) => updateHint(step.id, h.id, { text: e.target.value })}
                        placeholder="Hint text"
                        className="admin-input flex-1"
                      />
                      <input
                        type="number"
                        min={0}
                        value={h.cost}
                        onChange={(e) =>
                          updateHint(step.id, h.id, { cost: Number(e.target.value) || 0 })
                        }
                        className="admin-input w-20"
                        title="Cost"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    patch({ steps: draft.steps.filter((s) => s.id !== step.id) })
                  }
                  className="mt-3 text-xs text-red-600 hover:underline"
                >
                  Remove step
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AdminField({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}
