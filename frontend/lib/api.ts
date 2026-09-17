export class ApiError<T = unknown> extends Error {
  public status: number;
  public statusText: string;
  public data: T;

  constructor(status: number, statusText: string, data: T, message?: string) {
    super(message || `API Error: ${status} ${statusText}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined | null>;
  token?: string | null;
  body?: unknown;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

/**
 * Token resolver hook/function. Can be customized or set dynamically.
 */
let authTokenGetter: (() => string | null | undefined) | null = null;

export function setAuthTokenGetter(getter: () => string | null | undefined) {
  authTokenGetter = getter;
}

/**
 * Generic typed fetch wrapper
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, token, body, headers: customHeaders, ...customConfig } = options;

  // Build query string if params are provided
  let url = endpoint.startsWith("http")
    ? endpoint
    : `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  // Determine auth token
  const resolvedToken =
    token ??
    (authTokenGetter ? authTokenGetter() : null) ??
    (typeof window !== "undefined" ? localStorage.getItem("token") : null);

  const headers = new Headers(customHeaders);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (resolvedToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${resolvedToken}`);
  }

  const config: RequestInit = {
    ...customConfig,
    headers,
    body: isFormData
      ? (body as FormData)
      : body !== undefined
      ? JSON.stringify(body)
      : undefined,
  };

  const response = await fetch(url, config);

  let data: any = null;
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorMessage =
      (data && typeof data === "object" && "message" in data && typeof data.message === "string")
        ? data.message
        : undefined;

    throw new ApiError(response.status, response.statusText, data, errorMessage);
  }

  return data as T;
}

export const api = {
  get: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: "GET" }),

  post: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: "POST", body }),

  put: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};
