"use client";

import { ApplicationForm } from "@/components/applications/application-form";
import { ApiClientError } from "@/lib/api-client";
import { createApplication } from "@/lib/applications-api";
import type { ApplicationFormData } from "@/schemas/application.schema";
import type { CreateApplicationRequest } from "@/types/application";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewApplicationPage():
  React.ReactElement {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [submitError, setSubmitError] =
    useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createApplication,

    onSuccess: async (application) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["applications"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["application-statistics"],
        }),
      ]);

      router.push(`/applications/${application.id}`);
    },
  });

  async function handleSubmit(
    data: ApplicationFormData,
  ): Promise<void> {
    setSubmitError(null);

    const request: CreateApplicationRequest = {
      company: data.company.trim(),
      position: data.position.trim(),
      status: data.status,
      appliedDate: data.appliedDate,
      ...(data.jobUrl.trim()
        ? {
            jobUrl: data.jobUrl.trim(),
          }
        : {}),
      ...(data.notes.trim()
        ? {
            notes: data.notes.trim(),
          }
        : {}),
    };

    try {
      await mutation.mutateAsync(request);
    } catch (error) {
      if (error instanceof ApiClientError) {
        setSubmitError(error.message);
        return;
      }

      setSubmitError(
        "Unable to create the application. Please try again.",
      );
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Add application
        </h1>

        <p className="mt-2 text-slate-600">
          Record a new job application.
        </p>
      </div>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <ApplicationForm
          submitLabel="Create application"
          isSubmitting={mutation.isPending}
          submitError={submitError}
          cancelHref="/applications"
          onSubmit={handleSubmit}
        />
      </section>
    </main>
  );
}