import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Sends httpOnly cookies (for refreshToken)
});

// In-memory token store
let memoryAccessToken: string | null = null;

export const setMemoryAccessToken = (token: string | null) => {
  memoryAccessToken = token;
  if (typeof window !== "undefined") {
    // ponytail / fallback note:
    // TODO: Production uses accessToken in-memory only + refreshToken httpOnly cookie.
    // LocalStorage fallback kept for development convenience & SSR recovery.
    if (token) {
      localStorage.setItem("techtians_access_token", token);
    } else {
      localStorage.removeItem("techtians_access_token");
    }
  }
};

// Refresh token: backend expects it in the request body of /auth/refresh and /auth/logout
// (it does not set an httpOnly cookie yet), so we keep it in localStorage for now.
const REFRESH_TOKEN_KEY = "techtians_refresh_token";

export const setRefreshToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const getRefreshToken = (): string | null =>
  typeof window !== "undefined" ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;

/** Backend wraps every success response as { success: true, data, meta?, timestamp } */
const unwrapEnvelope = (body: any) =>
  body && typeof body === "object" && body.success === true && "data" in body ? body.data : body;

export const getMemoryAccessToken = (): string | null => {
  if (memoryAccessToken) return memoryAccessToken;
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("techtians_access_token");
    if (saved) {
      memoryAccessToken = saved;
      return saved;
    }
  }
  return null;
};

// Request interceptor to attach JWT Access Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getMemoryAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 & token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // Unwrap envelope so services can keep using `response.data` directly
    response.data = unwrapEnvelope(response.data);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call backend refresh endpoint
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token stored");
        }

        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const refreshed = unwrapEnvelope(response.data);
        const newAccessToken = refreshed?.accessToken;
        if (newAccessToken) {
          setMemoryAccessToken(newAccessToken);
          setRefreshToken(refreshed?.refreshToken ?? null);
          processQueue(null, newAccessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        } else {
          throw new Error("No access token returned from refresh endpoint");
        }
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        setMemoryAccessToken(null);
        setRefreshToken(null);

        if (typeof window !== "undefined") {
          // Clear session cookies and redirect to login
          document.cookie = "techtians_role=; Max-Age=0; path=/";
          document.cookie = "techtians_session=; Max-Age=0; path=/";
          window.location.href = "/login?expired=1";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
