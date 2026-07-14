"use client";

import { ApplicationForm } from "@/components/applications/application-form";
import { StatusBadge } from "@/components/applications/status-badge";
import { Alert } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ApiClientError } from "@/lib/api-client";
import {
  deleteApplication,
  getApplication,
  updateApplication,
} from "@/lib/applications-api";
import type { ApplicationFormData } from "@/schemas/application.schema";
import type {
  JobApplication,
  UpdateApplicationRequest,
} from "@/types/application";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Link from "next/link";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { useState } from "react";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

function getDateInputValue(value: string): string {
  return new Date(value).toISOString().slice(0, 10);
}

function getErrorMessage(error: Error): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  return "Unable to load the application.";
}

export default function ApplicationDetailsPage():
  React.ReactElement {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [submitError, setSubmitError] =
    useState<string | null>(null);
  const [deleteError, setDeleteError] =
    useState<string | null>(null);

  const id = Number(params.id);
  const hasValidId = Number.isInteger(id) && id > 0;

  const {
    data: application,
    isLoading,
    isError,
    error,
  } = useQuery<JobApplication, Error>({
    queryKey: ["application", id],
    queryFn: () => getApplication(id),
    enabled: hasValidId,
  });

  const updateMutation = useMutation({
    mutationFn: (
      request: UpdateApplicationRequest,
    ) => updateApplication(id, request),

    onSuccess: async (updatedApplication) => {
      queryClient.setQueryData(
        ["application", id],
        updatedApplication,
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["applications"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["application-statistics"],
        }),
      ]);

      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteApplication(id),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["applications"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["application-statistics"],
        }),
      ]);

      queryClient.removeQueries({
        queryKey: ["application", id],
      });

      router.replace("/applications");
    },
  });

  async function handleUpdate(
    data: ApplicationFormData,
  ): Promise<void> {
    setSubmitError(null);

    const request: UpdateApplicationRequest = {
      company: data.company.trim(),
      position: data.position.trim(),
      status: data.status,
      appliedDate: data.appliedDate,
      jobUrl: data.jobUrl.trim(),
      notes: data.notes.trim(),
    };

    try {
      await updateMutation.mutateAsync(request);
    } catch (mutationError) {
      if (mutationError instanceof ApiClientError) {
        setSubmitError(mutationError.message);
        return;
      }

      setSubmitError(
        "Unable to update the application. Please try again.",
      );
    }
  }

  async function handleDelete(): Promise<void> {
    const confirmed = window.confirm(
      `Delete the application for ${application?.position ?? "this position"}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeleteError(null);

    try {
      await deleteMutation.mutateAsync();
    } catch (mutationError) {
      if (mutationError instanceof ApiClientError) {
        setDeleteError(mutationError.message);
        return;
      }

      setDeleteError(
        "Unable to delete the application. Please try again.",
      );
    }
  }

  if (!hasValidId) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Alert message="The application ID is invalid." />

        <Link
          href="/applications"
          className="mt-5 inline-flex font-semibold text-blue-600"
        >
          Back to applications
        </Link>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="rounded-xl bg-white">
          <LoadingSpinner label="Loading application..." />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Alert message={getErrorMessage(error)} />

        <Link
          href="/applications"
          className="mt-5 inline-flex font-semibold text-blue-600"
        >
          Back to applications
        </Link>
      </main>
    );
  }

  if (!application) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Alert message="Application not found." />
      </main>
    );
  }

  const defaultValues: ApplicationFormData = {
    company: application.company,
    position: application.position,
    jobUrl: application.jobUrl ?? "",
    status: application.status,
    appliedDate: getDateInputValue(
      application.appliedDate,
    ),
    notes: application.notes ?? "",
  };

  if (isEditing) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Edit application
          </h1>

          <p className="mt-2 text-slate-600">
            Update the application details and status.
          </p>
        </div>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <ApplicationForm
            defaultValues={defaultValues}
            submitLabel="Save changes"
            isSubmitting={updateMutation.isPending}
            submitError={submitError}
            cancelHref={`/applications/${id}`}
            onSubmit={handleUpdate}
          />

          <button
            type="button"
            onClick={() => {
              setSubmitError(null);
              setIsEditing(false);
            }}
            className="mt-4 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            Return without saving
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <Link
            href="/applications"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to applications
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            {application.position}
          </h1>

          <p className="mt-2 text-lg text-slate-600">
            {application.company}
          </p>
        </div>

        <StatusBadge status={application.status} />
      </div>

      {deleteError ? (
        <div className="mt-6">
          <Alert message={deleteError} />
        </div>
      ) : null}

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-500">
              Company
            </dt>

            <dd className="mt-1 font-semibold text-slate-900">
              {application.company}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-slate-500">
              Position
            </dt>

            <dd className="mt-1 font-semibold text-slate-900">
              {application.position}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-slate-500">
              Application date
            </dt>

            <dd className="mt-1 text-slate-900">
              {formatDate(application.appliedDate)}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-slate-500">
              Last updated
            </dt>

            <dd className="mt-1 text-slate-900">
              {formatDate(application.updatedAt)}
            </dd>
          </div>
        </dl>

        <div className="mt-6 border-t border-slate-200 pt-6">
          <h2 className="text-sm font-medium text-slate-500">
            Job posting
          </h2>

          {application.jobUrl ? (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex break-all font-semibold text-blue-600 hover:text-blue-700"
            >
              {application.jobUrl}
            </a>
          ) : (
            <p className="mt-2 text-slate-600">
              No job URL provided.
            </p>
          )}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-6">
          <h2 className="text-sm font-medium text-slate-500">
            Notes
          </h2>

          <p className="mt-2 whitespace-pre-wrap text-slate-700">
            {application.notes || "No notes provided."}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-red-300 px-5 py-2.5 font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteMutation.isPending
              ? "Deleting..."
              : "Delete"}
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Edit application
          </button>
        </div>
      </section>
    </main>
  );
}