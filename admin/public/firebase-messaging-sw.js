// Firebase Cloud Messaging Service Worker for Tech Tians Academy Admin & Teacher Panel
/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

// Initialize Firebase in the service worker with default or placeholder parameters
const defaultConfig = {
  apiKey: "AIzaSyDummyKeyForDevelopment123456789",
  authDomain: "tech-tians-academy.firebaseapp.com",
  projectId: "tech-tians-academy",
  storageBucket: "tech-tians-academy.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
};

try {
  firebase.initializeApp(defaultConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message: ", payload);

    const notificationTitle = payload.notification?.title || "Tech Tians Academy Alert";
    const notificationOptions = {
      body: payload.notification?.body || "You have a new update in your dashboard.",
      icon: payload.notification?.icon || "/favicon.ico",
      data: payload.data || {},
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (error) {
  console.warn("[firebase-messaging-sw.js] Firebase SW initialization skipped or mock mode active:", error);
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const clickAction = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(clickAction) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(clickAction);
      }
    })
  );
});
