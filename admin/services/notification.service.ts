import { apiClient } from "@/lib/api-client";

const isMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export interface RegisterTokenPayload {
  token: string;
  deviceType?: string;
}

export const notificationService = {
  async registerToken(payload: RegisterTokenPayload): Promise<{ success: boolean }> {
    if (isMock) {
      console.log("[Mock NotificationService] Registered FCM token with backend:", payload.token);
      return { success: true };
    }

    const response = await apiClient.post("/notifications/register-token", payload);
    return response.data;
  },
};
