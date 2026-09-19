import { apiClient } from "@/lib/api-client";
import { AdminDashboardData, TeacherDashboardData } from "@/types/dashboard";
import { MOCK_ADMIN_DASHBOARD, MOCK_TEACHER_DASHBOARD } from "./mock-data";

const isMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const dashboardService = {
  async getAdminDashboard(): Promise<AdminDashboardData> {
    if (isMock) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_ADMIN_DASHBOARD;
    }

    const response = await apiClient.get<AdminDashboardData>("/dashboard/admin");
    return response.data;
  },

  async getTeacherDashboard(): Promise<TeacherDashboardData> {
    if (isMock) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_TEACHER_DASHBOARD;
    }

    const response = await apiClient.get<TeacherDashboardData>("/dashboard/teacher");
    return response.data;
  },
};
