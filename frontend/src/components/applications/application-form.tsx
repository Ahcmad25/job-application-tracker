"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import {
  applicationSchema,
  type ApplicationFormData,
} from "@/schemas/application.schema";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/types/application";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

const statusLabels: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

type ApplicationFormProps = {
  defaultValues?: ApplicationFormData;
  submitLabel: string;
  isSubmitting: boolean;
  submitError?: string | null;
  cancelHref: string;
  onSubmit: (data: ApplicationFormData) => Promise<void>;
};

const initialValues: ApplicationFormData = {
  company: "",
  position: "",
  jobUrl: "",
  status: "APPLIED",
  appliedDate: new Date().toISOString().slice(0, 10),
  notes: "",
};

export function ApplicationForm({
  defaultValues = initialValues,
  submitLabel,
  isSubmitting,
  submitError,
  cancelHref,
  onSubmit,
}: ApplicationFormProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues,
  });

  const companyField = register("company");
  const positionField = register("position");
  const jobUrlField = register("jobUrl");
  const appliedDateField = register("appliedDate");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      {submitError ? (
        <Alert message={submitError} />
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <InputField
          name={companyField.name}
          onBlur={companyField.onBlur}
          onChange={companyField.onChange}
          inputRef={companyField.ref}
          label="Company"
          placeholder="Example Technologies"
          error={errors.company?.message}
        />

        <InputField
          name={positionField.name}
          onBlur={positionField.onBlur}
          onChange={positionField.onChange}
          inputRef={positionField.ref}
          label="Position"
          placeholder="Senior Software Engineer"
          error={errors.position?.message}
        />
      </div>

      <InputField
        name={jobUrlField.name}
        onBlur={jobUrlField.onBlur}
        onChange={jobUrlField.onChange}
        inputRef={jobUrlField.ref}
        label="Job URL"
        type="url"
        placeholder="https://example.com/jobs/123"
        error={errors.jobUrl?.message}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="status"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Status
          </label>

          <select
            {...register("status")}
            id="status"
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>

          {errors.status?.message ? (
            <p className="mt-1 text-sm text-red-600">
              {errors.status.message}
            </p>
          ) : null}
        </div>

        <InputField
          name={appliedDateField.name}
          onBlur={appliedDateField.onBlur}
          onChange={appliedDateField.onChange}
          inputRef={appliedDateField.ref}
          label="Application date"
          type="date"
          error={errors.appliedDate?.message}
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Notes
        </label>

        <textarea
          {...register("notes")}
          id="notes"
          rows={6}
          placeholder="Add interview schedules, recruiter details or other notes."
          className={`w-full rounded-lg border px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
            errors.notes
              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
          }`}
        />

        {errors.notes?.message ? (
          <p className="mt-1 text-sm text-red-600">
            {errors.notes.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <Link
          href={cancelHref}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </Link>

        <div className="sm:w-44">
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}