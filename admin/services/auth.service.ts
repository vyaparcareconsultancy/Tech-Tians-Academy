import {
  apiClient,
  getRefreshToken,
  setMemoryAccessToken,
  setRefreshToken,
} from "@/lib/api-client";
import { LoginCredentials, LoginResponse, User, UserRole } from "@/types/auth";
import {
  MOCK_ADMIN_LOGIN_RESPONSE,
  MOCK_TEACHER_LOGIN_RESPONSE,
  MOCK_ADMIN_USER,
  MOCK_TEACHER_USER,
} from "./mock-data";

const isMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

/** User shape returned by the backend: roles is an uppercase array, e.g. ["ADMIN"] */
interface BackendUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  roles?: string[];
}

interface BackendLoginResponse {
  user: BackendUser;
  tokens: { accessToken: string; refreshToken: string; expiresIn: string };
}

/** Map backend roles array to the single lowercase role the panel uses */
function toPanelUser(user: BackendUser): User {
  const roles = user.roles ?? [];
  const role: UserRole =
    roles.includes("ADMIN") || roles.includes("SUPER_ADMIN")
      ? "admin"
      : roles.includes("TEACHER")
      ? "teacher"
      : "student";

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone ?? undefined,
    role,
  };
}

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

    // Backend expects { identifier, password }; identifier can be email or phone
    const response = await apiClient.post<BackendLoginResponse>("/auth/login", {
      identifier: credentials.email,
      password: credentials.password,
    });
    const { user, tokens } = response.data;
    setMemoryAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);

    return {
      user: toPanelUser(user),
      tokens: { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken },
    };
  },

  async logout(): Promise<void> {
    if (isMock) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setMemoryAccessToken(null);
      return;
    }

    try {
      const refreshToken = getRefreshToken();
      await apiClient.post("/auth/logout", refreshToken ? { refreshToken } : {});
    } finally {
      setMemoryAccessToken(null);
      setRefreshToken(null);
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

    const response = await apiClient.get<BackendUser>("/auth/me");
    return response.data ? toPanelUser(response.data) : null;
  },
};
