"use client";

import { StatusBadge } from "@/components/applications/status-badge";
import { Alert } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ApiClientError } from "@/lib/api-client";
import { getApplications } from "@/lib/applications-api";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
  type JobApplication,
} from "@/types/application";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

const statusLabels: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function getErrorMessage(error: Error): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  return "Unable to load your applications.";
}

export default function ApplicationsPage():
  React.ReactElement {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState<ApplicationStatus | "">("");

  const {
    data: applications = [],
    isLoading,
    isError,
    error,
  } = useQuery<JobApplication[], Error>({
    queryKey: [
      "applications",
      {
        search,
        status,
      },
    ],
    queryFn: () =>
      getApplications({
        search: search || undefined,
        status: status || undefined,
      }),
  });

  function handleSearchSubmit(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();
    setSearch(searchInput.trim());
  }

  function handleStatusChange(
    event: ChangeEvent<HTMLSelectElement>,
  ): void {
    setStatus(event.target.value as ApplicationStatus | "");
  }

  function clearFilters(): void {
    setSearchInput("");
    setSearch("");
    setStatus("");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Applications
          </h1>

          <p className="mt-2 text-slate-600">
            Review and manage your job applications.
          </p>
        </div>

        <Link
          href="/applications/new"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Add application
        </Link>
      </div>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <form
          onSubmit={handleSearchSubmit}
          className="grid gap-3 md:grid-cols-[1fr_220px_auto_auto]"
        >
          <input
            type="search"
            value={searchInput}
            onChange={(event) =>
              setSearchInput(event.target.value)
            }
            placeholder="Search company or position"
            className="min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <select
            value={status}
            onChange={handleStatusChange}
            className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All statuses</option>

            {APPLICATION_STATUSES.map(
              (applicationStatus) => (
                <option
                  key={applicationStatus}
                  value={applicationStatus}
                >
                  {statusLabels[applicationStatus]}
                </option>
              ),
            )}
          </select>

          <button
            type="submit"
            className="min-h-11 rounded-lg bg-slate-900 px-5 py-2 font-semibold text-white transition hover:bg-slate-800"
          >
            Search
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className="min-h-11 rounded-lg border border-slate-300 px-5 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Clear
          </button>
        </form>
      </section>

      {isLoading ? (
        <div className="mt-6 rounded-xl bg-white">
          <LoadingSpinner label="Loading applications..." />
        </div>
      ) : null}

      {isError ? (
        <div className="mt-6">
          <Alert message={getErrorMessage(error)} />
        </div>
      ) : null}

      {!isLoading && !isError && applications.length === 0 ? (
        <section className="mt-6 rounded-xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            No applications found
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Add an application or adjust your search filters.
          </p>

          <Link
            href="/applications/new"
            className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            Add your first application
          </Link>
        </section>
      ) : null}

      {applications.length > 0 ? (
        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Company
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Position
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Applied
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {applications.map((application) => (
                  <tr
                    key={application.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <p className="font-semibold text-slate-900">
                        {application.company}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {application.position}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusBadge
                        status={application.status}
                      />
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {formatDate(application.appliedDate)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <Link
                        href={`/applications/${application.id}`}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </main>
  );
}