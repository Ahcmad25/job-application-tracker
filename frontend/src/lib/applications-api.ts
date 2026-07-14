import { apiRequest } from "@/lib/api-client";
import type {
  ApplicationFilters,
  ApplicationStatistics,
  CreateApplicationRequest,
  JobApplication,
  UpdateApplicationRequest,
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

export function getApplication(
  id: number,
): Promise<JobApplication> {
  return apiRequest<JobApplication>(`/applications/${id}`, {
    method: "GET",
    authenticated: true,
  });
}

export function createApplication(
  data: CreateApplicationRequest,
): Promise<JobApplication> {
  return apiRequest<JobApplication>("/applications", {
    method: "POST",
    authenticated: true,
    body: data,
  });
}

export function updateApplication(
  id: number,
  data: UpdateApplicationRequest,
): Promise<JobApplication> {
  return apiRequest<JobApplication>(`/applications/${id}`, {
    method: "PATCH",
    authenticated: true,
    body: data,
  });
}

export function deleteApplication(
  id: number,
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    `/applications/${id}`,
    {
      method: "DELETE",
      authenticated: true,
    },
  );
}