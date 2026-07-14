export const APPLICATION_STATUSES = [
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
] as const;

export type ApplicationStatus =
  (typeof APPLICATION_STATUSES)[number];

export type JobApplication = {
  id: number;
  company: string;
  position: string;
  jobUrl: string | null;
  status: ApplicationStatus;
  appliedDate: string;
  notes: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationStatistics = {
  total: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
  withdrawn: number;
};

export type ApplicationFilters = {
  status?: ApplicationStatus;
  search?: string;
};