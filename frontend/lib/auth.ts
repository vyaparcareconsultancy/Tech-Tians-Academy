import type { UserProfile } from "@/types";

/** Tokens returned by POST /auth/login and POST /auth/register */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

/** User object as returned by the backend (login / register / me) */
export interface BackendUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  roles?: string[];
  createdAt?: string;
}

export interface LoginResponse {
  user: BackendUser;
  tokens: AuthTokens;
}

export interface RegisterResponse {
  message: string;
  user: BackendUser;
  tokens: AuthTokens;
}

/** Convert backend user (roles: ["STUDENT"]) to the frontend UserProfile shape */
export function toUserProfile(user: BackendUser): UserProfile {
  const roles = user.roles ?? [];
  const role: UserProfile["role"] = roles.includes("ADMIN") || roles.includes("SUPER_ADMIN")
    ? "admin"
    : roles.includes("TEACHER")
    ? "instructor"
    : "student";

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role,
    createdAt: user.createdAt ?? new Date().toISOString(),
  };
}
