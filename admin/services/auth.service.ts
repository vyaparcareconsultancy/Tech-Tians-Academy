import { apiClient, setMemoryAccessToken } from "@/lib/api-client";
import { LoginCredentials, LoginResponse, User } from "@/types/auth";
import {
  MOCK_ADMIN_LOGIN_RESPONSE,
  MOCK_TEACHER_LOGIN_RESPONSE,
  MOCK_ADMIN_USER,
  MOCK_TEACHER_USER,
} from "./mock-data";

const isMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    if (isMock) {
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 600));

      const email = credentials.email.toLowerCase().trim();
      if (email.includes("teacher")) {
        setMemoryAccessToken(MOCK_TEACHER_LOGIN_RESPONSE.tokens.accessToken);
        return MOCK_TEACHER_LOGIN_RESPONSE;
      }

      // Default to admin mock
      setMemoryAccessToken(MOCK_ADMIN_LOGIN_RESPONSE.tokens.accessToken);
      return MOCK_ADMIN_LOGIN_RESPONSE;
    }

    const response = await apiClient.post<LoginResponse>("/auth/login", credentials);
    if (response.data?.tokens?.accessToken) {
      setMemoryAccessToken(response.data.tokens.accessToken);
    }
    return response.data;
  },

  async logout(): Promise<void> {
    if (isMock) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setMemoryAccessToken(null);
      return;
    }

    try {
      await apiClient.post("/auth/logout");
    } finally {
      setMemoryAccessToken(null);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (isMock) {
      if (typeof window !== "undefined") {
        const role = document.cookie
          .split("; ")
          .find((row) => row.startsWith("techtians_role="))
          ?.split("=")[1];

        if (role === "teacher") return MOCK_TEACHER_USER;
        if (role === "admin") return MOCK_ADMIN_USER;
      }
      return MOCK_ADMIN_USER;
    }

    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },
};
