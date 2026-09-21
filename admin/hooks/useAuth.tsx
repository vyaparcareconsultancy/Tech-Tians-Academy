"use client";

import * as React from "react";
import { User, LoginCredentials, UserRole } from "@/types/auth";
import { authService } from "@/services/auth.service";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize session from cookies / service
  React.useEffect(() => {
    async function loadUser() {
      try {
        const storedRole = document.cookie
          .split("; ")
          .find((row) => row.startsWith("techtians_role="))
          ?.split("=")[1] as UserRole | undefined;

        if (storedRole) {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        }
      } catch (err) {
        console.warn("Failed to load authenticated user session:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      const authenticatedUser = response.user;
      setUser(authenticatedUser);

      // Set cookie for middleware access
      document.cookie = `techtians_session=1; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `techtians_role=${authenticatedUser.role}; path=/; max-age=604800; SameSite=Lax`;

      // Redirect according to role
      if (authenticatedUser.role === "admin") {
        router.push("/dashboard");
      } else if (authenticatedUser.role === "teacher") {
        router.push("/dashboard");
      } else {
        throw new Error("Students are not permitted in the admin or teacher panel.");
      }

      return authenticatedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      document.cookie = "techtians_session=; path=/; max-age=0";
      document.cookie = "techtians_role=; path=/; max-age=0";
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
