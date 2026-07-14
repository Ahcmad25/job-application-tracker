import {
  APPLICATION_STATUSES,
} from "@/types/application";
import { z } from "zod";

export const applicationSchema = z.object({
  company: z
    .string()
    .trim()
    .min(1, "Company is required")
    .max(150, "Company cannot exceed 150 characters"),

  position: z
    .string()
    .trim()
    .min(1, "Position is required")
    .max(150, "Position cannot exceed 150 characters"),

  jobUrl: z
    .string()
    .trim()
    .max(500, "Job URL cannot exceed 500 characters")
    .refine(
      (value) => {
        if (!value) {
          return true;
        }

        try {
          const url = new URL(value);

          return (
            url.protocol === "http:" ||
            url.protocol === "https:"
          );
        } catch {
          return false;
        }
      },
      {
        message:
          "Enter a valid URL beginning with http:// or https://",
      },
    ),

  status: z.enum(APPLICATION_STATUSES),

  appliedDate: z
    .string()
    .min(1, "Application date is required"),

  notes: z
    .string()
    .trim()
    .max(2000, "Notes cannot exceed 2,000 characters"),
});

export type ApplicationFormData = z.infer<
  typeof applicationSchema
>;