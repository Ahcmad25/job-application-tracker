"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import {
  useEffect,
  type ReactNode,
} from "react";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({
  children,
}: ProtectedRouteProps): React.ReactElement {
  const router = useRouter();
  const {
    isAuthenticated,
    isInitializing,
  } = useAuth();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isInitializing, router]);

  if (isInitializing || !isAuthenticated) {
    return <LoadingSpinner label="Checking your session..." />;
  }

  return <>{children}</>;
}