"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { useAuth } from "@/contexts/auth-context";
import { ApiClientError } from "@/lib/api-client";
import {
  loginSchema,
  type LoginFormData,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginPage(): React.ReactElement {
  const router = useRouter();

  const {
    login,
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
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const emailField = register("email");
  const passwordField = register("password");

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isInitializing, router]);

  async function onSubmit(
    data: LoginFormData,
  ): Promise<void> {
    setSubmitError(null);

    try {
      await login(data);
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mb-3 text-3xl font-bold text-blue-600">
            JobTrack
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Sign in to manage your job applications.
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
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password?.message}
          />

          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}