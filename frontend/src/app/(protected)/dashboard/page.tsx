"use client";

import { Alert } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/auth-context";
import { ApiClientError } from "@/lib/api-client";
import { getApplicationStatistics } from "@/lib/applications-api";
import type { ApplicationStatistics } from "@/types/application";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

type StatisticCardProps = {
  label: string;
  value: number;
  description: string;
};

function StatisticCard({
  label,
  value,
  description,
}: StatisticCardProps): React.ReactElement {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">
        {description}
      </p>
    </article>
  );
}

function getErrorMessage(error: Error): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  return "Unable to load dashboard statistics.";
}

export default function DashboardPage(): React.ReactElement {
  const { user } = useAuth();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<ApplicationStatistics, Error>({
    queryKey: ["application-statistics"],
    queryFn: getApplicationStatistics,
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome, {user?.firstName}
          </h1>

          <p className="mt-2 text-slate-600">
            Here is an overview of your job search.
          </p>
        </div>

        <Link
          href="/applications/new"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Add application
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-8 rounded-xl bg-white">
          <LoadingSpinner label="Loading dashboard..." />
        </div>
      ) : null}

      {isError ? (
        <div className="mt-8">
          <Alert message={getErrorMessage(error)} />
        </div>
      ) : null}

      {data ? (
        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatisticCard
            label="Total applications"
            value={data.total}
            description="All tracked applications"
          />

          <StatisticCard
            label="Applied"
            value={data.applied}
            description="Awaiting a response"
          />

          <StatisticCard
            label="Interviews"
            value={data.interview}
            description="Applications in interview stage"
          />

          <StatisticCard
            label="Offers"
            value={data.offer}
            description="Offers received"
          />

          <StatisticCard
            label="Rejected"
            value={data.rejected}
            description="Applications not selected"
          />

          <StatisticCard
            label="Withdrawn"
            value={data.withdrawn}
            description="Applications you withdrew"
          />
        </section>
      ) : null}

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Manage your applications
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          View, search and update all your job applications.
        </p>

        <Link
          href="/applications"
          className="mt-4 inline-flex font-semibold text-blue-600 hover:text-blue-700"
        >
          View all applications →
        </Link>
      </section>
    </main>
  );
}