/**
 * Common shared TypeScript definitions
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  avatarUrl?: string;
  createdAt: string;
}
