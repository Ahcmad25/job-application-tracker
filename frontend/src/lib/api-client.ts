import { getAccessToken } from "@/lib/auth-storage";
import type { ApiErrorResponse } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not configured. Check frontend/.env.local.",
  );
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: ApiErrorResponse,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  authenticated?: boolean;
};

function extractErrorMessage(error: ApiErrorResponse): string {
  if (Array.isArray(error.message)) {
    return error.message.join(", ");
  }

  return error.message ?? error.error ?? "Something went wrong";
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    body,
    authenticated = false,
    headers,
    ...requestOptions
  } = options;

  const requestHeaders = new Headers(headers);

  requestHeaders.set("Accept", "application/json");

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (authenticated) {
    const accessToken = getAccessToken();

    if (accessToken) {
      requestHeaders.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...requestOptions,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorDetails: ApiErrorResponse = {};

    try {
      errorDetails = (await response.json()) as ApiErrorResponse;
    } catch {
      errorDetails = {
        message: "The server returned an unexpected response",
      };
    }

    throw new ApiClientError(
      extractErrorMessage(errorDetails),
      response.status,
      errorDetails,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}