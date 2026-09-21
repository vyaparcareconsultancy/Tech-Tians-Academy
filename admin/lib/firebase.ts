import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";
import { notificationService } from "@/services/notification.service";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize or reuse Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firebase Auth Token Exchange flow with Backend
export const exchangeFirebaseTokenWithBackend = async (firebaseIdToken: string) => {
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";
  if (isMock) {
    console.log("[Mock Auth] Exchanged Firebase ID token with backend API");
    return {
      accessToken: "mock_jwt_access_token_exchanged",
      refreshToken: "mock_jwt_refresh_token_exchanged",
    };
  }

  const { apiClient } = await import("@/lib/api-client");
  const response = await apiClient.post("/auth/firebase-exchange", {
    idToken: firebaseIdToken,
  });
  return response.data;
};

// Google Sign-In helper
export const signInWithGoogle = async (): Promise<UserCredential> => {
  return await signInWithPopup(auth, googleProvider);
};

// Request Notification Permission & Register FCM Token
export const requestFcmNotificationPermission = async (): Promise<string | null> => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    console.warn("Browser does not support desktop notifications.");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission was denied by user.");
      return null;
    }

    // Register service worker if not already registered
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    const messaging: Messaging = getMessaging(app);

    const currentToken = await getToken(messaging, {
      serviceWorkerRegistration: registration,
      vapidKey: vapidKey && !vapidKey.includes("dummy") ? vapidKey : undefined,
    });

    if (currentToken) {
      console.log("[FCM] Received token:", currentToken);
      // Register token with backend
      await notificationService.registerToken({
        token: currentToken,
        deviceType: "web",
      });
      return currentToken;
    } else {
      console.warn("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (error) {
    console.warn("[FCM] Error obtaining messaging token (Mock/Dev fallback):", error);
    return null;
  }
};

// Foreground message listener
export const onForegroundMessage = (callback: (payload: any) => void) => {
  if (typeof window === "undefined") return () => {};

  try {
    const messaging = getMessaging(app);
    return onMessage(messaging, (payload) => {
      console.log("[FCM Foreground Message]:", payload);
      callback(payload);
    });
  } catch (error) {
    console.warn("[FCM] Foreground listener not supported in this environment:", error);
    return () => {};
  }
};
