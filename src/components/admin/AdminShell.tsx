import { Link, Outlet } from "@tanstack/react-router";
import {
  Compass,
  LayoutDashboard,
  LogOut,
  ExternalLink,
  Plus,
} from "lucide-react";

type AdminShellProps = {
  email: string | null;
  onLogout: () => void;
  onNewHunt?: () => void;
  creating?: boolean;
  children?: React.ReactNode;
};

export function AdminShell({
  email,
  onLogout,
  onNewHunt,
  creating,
  children,
}: AdminShellProps) {
  return (
    <div className="flex min-h-screen bg-[#f4f6f9] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-slate-800/80 bg-[#0f172a] text-slate-200">
        <div className="flex h-16 items-center gap-3 border-b border-slate-700/80 px-5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-white">
            <Compass className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">Souvenir Hunt</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Studio</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Manage
          </div>
          <Link
            to="/admin"
            className="flex items-center gap-3 rounded-lg bg-slate-800/80 px-3 py-2.5 text-sm font-medium text-white"
          >
            <LayoutDashboard className="h-4 w-4 text-primary" />
            Hunts
          </Link>
        </nav>

        <div className="border-t border-slate-700/80 p-4 space-y-1">
          {onNewHunt && (
            <button
              type="button"
              onClick={onNewHunt}
              disabled={creating}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              <Plus className="h-4 w-4" />
              {creating ? "Creating…" : "New hunt"}
            </button>
          )}
          <Link
            to="/"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View website
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
          {email && (
            <p className="px-3 pt-2 text-[11px] text-slate-500 truncate" title={email}>
              {email}
            </p>
          )}
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col pl-[260px]">
        {children ?? <Outlet />}
      </div>
    </div>
  );
}
