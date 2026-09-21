import { create } from "zustand";
import { UserProfile } from "@/types";

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: { accessToken: string; refreshToken?: string; user?: UserProfile }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: ({ accessToken, refreshToken, user }) => {
    try {
      localStorage.setItem("token", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    } catch {
      // Ignore localStorage failure
    }
    set({
      token: accessToken,
      user: user || {
        id: "student-1",
        name: "Student",
        email: "student@tians.academy",
        role: "student",
        createdAt: new Date().toISOString(),
      },
      isAuthenticated: true,
    });
  },

  logout: () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    } catch {
      // Ignore localStorage failure
    }
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
