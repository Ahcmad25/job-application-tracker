import { describe, expect, it } from "vitest";
import {
  loginSchema,
  registerSchema,
} from "./auth.schema";

describe("loginSchema", () => {
  it("accepts valid login values", () => {
    const result = loginSchema.safeParse({
      email: "ahcmad@example.com",
      password: "Password123!",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "invalid-email",
      password: "Password123!",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a short password", () => {
    const result = loginSchema.safeParse({
      email: "ahcmad@example.com",
      password: "short",
    });

    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts valid registration values", () => {
    const result = registerSchema.safeParse({
      firstName: "Ahcmad",
      lastName: "Angagao",
      email: "ahcmad@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
    });

    expect(result.success).toBe(true);
  });

  it("rejects passwords that do not match", () => {
    const result = registerSchema.safeParse({
      firstName: "Ahcmad",
      lastName: "Angagao",
      email: "ahcmad@example.com",
      password: "Password123!",
      confirmPassword: "DifferentPassword123!",
    });

    expect(result.success).toBe(false);
  });
});