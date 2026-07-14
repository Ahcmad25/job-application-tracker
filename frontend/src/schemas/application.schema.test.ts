import { describe, expect, it } from "vitest";
import { applicationSchema } from "./application.schema";

describe("applicationSchema", () => {
  const validApplication = {
    company: "Acme Technologies",
    position: "Backend Developer",
    jobUrl: "https://example.com/jobs/1",
    status: "APPLIED" as const,
    appliedDate: "2026-07-14",
    notes: "Submitted online.",
  };

  it("accepts a valid application", () => {
    const result =
      applicationSchema.safeParse(validApplication);

    expect(result.success).toBe(true);
  });

  it("allows an empty optional URL", () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      jobUrl: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid URL", () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      jobUrl: "not-a-valid-url",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty company", () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      company: "",
    });

    expect(result.success).toBe(false);
  });
});