import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, MapPin, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { HuntEditorPanel, type AdminHunt } from "@/components/admin/HuntEditorPanel";
import { getAdminSession, adminLogout } from "@/server/auth";
import { listAdminHunts, saveAdminHunt, deleteAdminHunt } from "@/server/hunts";
import { newHuntTemplate } from "@/lib/hunt-utils";
import { huntStatusLabel } from "@/lib/types";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const [hunts, setHunts] = useState<AdminHunt[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const loadHunts = useCallback(async () => {
    const data = await listAdminHunts();
    const huntsList = Array.isArray(data) ? (data as AdminHunt[]) : [];
    setHunts(huntsList);
    return huntsList;
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const session = await getAdminSession();
        setEmail(session.email);
        const data = await loadHunts();
        if (data.length) setSelectedId(data[0].id);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load hunts");
      } finally {
        setLoading(false);
      }
    })();
  }, [loadHunts]);

  const selected = useMemo(
    () => hunts.find((h) => h.id === selectedId) ?? null,
    [hunts, selectedId],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return hunts;
    return hunts.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q) ||
        h.slug.toLowerCase().includes(q),
    );
  }, [hunts, query]);

  async function handleCreateHunt() {
    setCreating(true);
    try {
      const template = newHuntTemplate();
      const { id } = await saveAdminHunt({ data: template });
      const data = await loadHunts();
      setSelectedId(id);
      toast.success("New hunt created");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Could not create hunt");
    } finally {
      setCreating(false);
    }
  }

  async function handleSave(hunt: AdminHunt) {
    try {
      const { id } = await saveAdminHunt({
        data: {
          ...hunt,
          id: hunt.id,
          updatedAt: Date.now(),
        },
      });
      const data = await loadHunts();
      setSelectedId(id);
      toast.success("Hunt saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
      throw err;
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAdminHunt({ data: id });
      const data = await loadHunts();
      setSelectedId(data[0]?.id ?? null);
      toast.success("Hunt deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
      throw err;
    }
  }

  async function handleLogout() {
    try {
      await adminLogout();
      window.location.href = "/admin";
    } catch {
      toast.error("Logout failed");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6f9]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AdminShell
      email={email}
      onLogout={() => void handleLogout()}
      onNewHunt={() => void handleCreateHunt()}
      creating={creating}
    >
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Hunts</h1>
          <p className="text-xs text-slate-500">{hunts.length} total · manage routes & clues</p>
        </div>
      </header>

      <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
        <div className="w-[300px] shrink-0 border-r border-slate-200 bg-white p-4 flex flex-col">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search hunts…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-2 py-8 text-center text-sm text-slate-500">
                {hunts.length === 0 ? "No hunts yet. Click New hunt." : "No matches."}
              </p>
            ) : (
              filtered.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setSelectedId(h.id)}
                  className={`w-full rounded-lg border p-3 text-left transition-all ${
                    h.id === selectedId
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  <p className="font-medium text-sm text-slate-900 truncate">{h.name || "Untitled"}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">
                      {h.city || "No city"}
                      {h.country ? `, ${h.country}` : ""}
                    </span>
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <StatusPill status={h.status} />
                    {h.published ? (
                      <span className="text-[10px] font-medium text-emerald-600">Live</span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400">Draft</span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-8">
          {!selected ? (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-center">
              <p className="text-slate-600 font-medium">Select a hunt to edit</p>
              <p className="mt-2 text-sm text-slate-500 max-w-sm">
                Choose a hunt from the list, or create a new one using the button in the sidebar.
              </p>
              <button
                type="button"
                onClick={() => void handleCreateHunt()}
                disabled={creating}
                className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
              >
                {creating ? "Creating…" : "Create new hunt"}
              </button>
            </div>
          ) : (
            <HuntEditorPanel
              key={selected.id}
              hunt={selected}
              onSave={handleSave}
              onDelete={() => handleDelete(selected.id)}
            />
          )}
        </main>
      </div>
    </AdminShell>
  );
}

function StatusPill({ status }: { status: AdminHunt["status"] }) {
  const colors: Record<AdminHunt["status"], string> = {
    live: "bg-emerald-100 text-emerald-700",
    coming_soon: "bg-amber-100 text-amber-800",
    in_design: "bg-blue-100 text-blue-700",
    scouting: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${colors[status]}`}>
      {huntStatusLabel(status)}
    </span>
  );
}
