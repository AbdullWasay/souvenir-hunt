import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { adminLogin } from "@/server/auth";

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await adminLogin({ data: { email, password } });
      if (result.ok) onSuccess();
      else setError(result.error);
    } catch {
      setError("Login failed. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-white">
            <Compass className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-white">Souvenir Hunt Studio</h1>
            <p className="text-xs text-slate-400">Admin sign in</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-slate-400">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-400">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-primary"
            />
          </label>
          {error && (
            <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <Link to="/" className="mt-6 block text-center text-xs text-slate-500 hover:text-slate-300">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
