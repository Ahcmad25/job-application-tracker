import { apiRequest } from "@/lib/api-client";
import type {
  ApplicationFilters,
  ApplicationStatistics,
  JobApplication,
} from "@/types/application";

export function getApplications(
  filters: ApplicationFilters = {},
): Promise<JobApplication[]> {
  const searchParams = new URLSearchParams();

  if (filters.status) {
    searchParams.set("status", filters.status);
  }

  if (filters.search?.trim()) {
    searchParams.set("search", filters.search.trim());
  }

  const query = searchParams.toString();
  const endpoint = query
    ? `/applications?${query}`
    : "/applications";

  return apiRequest<JobApplication[]>(endpoint, {
    method: "GET",
    authenticated: true,
  });
}

export function getApplicationStatistics():
  Promise<ApplicationStatistics> {
  return apiRequest<ApplicationStatistics>(
    "/applications/statistics",
    {
      method: "GET",
      authenticated: true,
    },
  );
}