"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function DashboardPage(): React.ReactElement {
  const router = useRouter();
  const {
    user,
    logout,
  } = useAuth();

  function handleLogout(): void {
    logout();
    router.replace("/login");
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-100">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="text-xl font-bold text-blue-600">
              JobTrack
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome, {user?.firstName}
          </h1>

          <p className="mt-2 text-slate-600">
            Your job application dashboard will appear here.
          </p>

          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900">
              Authentication successful
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Signed in as {user?.email}
            </p>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}