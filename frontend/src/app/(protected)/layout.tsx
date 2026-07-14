"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppNavigation } from "@/components/layout/app-navigation";
import type { ReactNode } from "react";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default function ProtectedLayout({
  children,
}: ProtectedLayoutProps): React.ReactElement {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-100 md:flex">
        <AppNavigation />

        <div className="min-w-0 flex-1">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}