"use client";

import * as React from "react";
import { requestFcmNotificationPermission, onForegroundMessage } from "@/lib/firebase";
import { useToast } from "@/components/ui/Toast";

export function useNotifications() {
  const [fcmToken, setFcmToken] = React.useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = React.useState<NotificationPermission>("default");
  const [isRequesting, setIsRequesting] = React.useState(false);
  const { addToast } = useToast();

  React.useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionStatus(Notification.permission);
    }

    // Subscribe to foreground messages
    const unsubscribe = onForegroundMessage((payload) => {
      const title = payload.notification?.title || "New Notification";
      const message = payload.notification?.body || "You have an update.";
      addToast({
        type: "info",
        title,
        message,
      });
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [addToast]);

  const requestPermission = React.useCallback(async () => {
    setIsRequesting(true);
    try {
      const token = await requestFcmNotificationPermission();
      if (token) {
        setFcmToken(token);
        setPermissionStatus("granted");
        addToast({
          type: "success",
          title: "Push Notifications Enabled",
          message: "You will receive real-time alerts for doubts, courses & tests.",
        });
      } else {
        if (typeof window !== "undefined" && "Notification" in window) {
          setPermissionStatus(Notification.permission);
        }
      }
    } catch (err) {
      console.error("FCM Permission error:", err);
    } finally {
      setIsRequesting(false);
    }
  }, [addToast]);

  return {
    fcmToken,
    permissionStatus,
    isRequesting,
    requestPermission,
  };
}
