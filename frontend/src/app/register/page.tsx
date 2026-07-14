"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { useAuth } from "@/contexts/auth-context";
import { ApiClientError } from "@/lib/api-client";
import {
  registerSchema,
  type RegisterFormData,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function RegisterPage(): React.ReactElement {
  const router = useRouter();
  const {
    register: createAccount,
    isAuthenticated,
    isInitializing,
  } = useAuth();

  const [submitError, setSubmitError] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isInitializing, router]);

  async function onSubmit(
    data: RegisterFormData,
  ): Promise<void> {
    setSubmitError(null);

    try {
      await createAccount({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      router.replace("/dashboard");
    } catch (error) {
      if (error instanceof ApiClientError) {
        setSubmitError(error.message);
        return;
      }

      setSubmitError(
        "Unable to connect to the server. Please try again.",
      );
    }
  }

  const firstNameField = register("firstName");
  const lastNameField = register("lastName");
  const emailField = register("email");
  const passwordField = register("password");
  const confirmPasswordField = register("confirmPassword");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mb-3 text-3xl font-bold text-blue-600">
            JobTrack
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Start organizing your job search.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {submitError ? (
            <Alert message={submitError} />
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              {...firstNameField}
              inputRef={firstNameField.ref}
              label="First name"
              autoComplete="given-name"
              placeholder="Ahcmad"
              error={errors.firstName?.message}
            />

            <InputField
              {...lastNameField}
              inputRef={lastNameField.ref}
              label="Last name"
              autoComplete="family-name"
              placeholder="Angagao"
              error={errors.lastName?.message}
            />
          </div>

          <InputField
            {...emailField}
            inputRef={emailField.ref}
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
          />

          <InputField
            {...passwordField}
            inputRef={passwordField.ref}
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            error={errors.password?.message}
          />

          <InputField
            {...confirmPasswordField}
            inputRef={confirmPasswordField.ref}
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter your password again"
            error={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}