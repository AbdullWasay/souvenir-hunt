import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { getAdminSession } from "@/server/auth";
import { AdminLogin } from "@/components/admin/AdminLogin";

function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6f9] px-6">
      <div className="max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Something went wrong</h1>
        <p className="mt-2 text-sm text-slate-600">{error.message || "The dashboard hit an error."}</p>
        <button
          type="button"
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Souvenir Hunt" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  loader: () => getAdminSession(),
  component: AdminLayout,
  errorComponent: AdminError,
});

function AdminLayout() {
  const session = Route.useLoaderData();
  const [authed, setAuthed] = useState(session.authenticated);

  return (
    <>
      <Toaster position="top-right" richColors />
      {authed ? <Outlet /> : <AdminLogin onSuccess={() => setAuthed(true)} />}
    </>
  );
}
