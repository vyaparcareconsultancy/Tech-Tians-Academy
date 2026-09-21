import * as React from "react";

export type NotificationType =
  | "doubt-answered"
  | "test-result"
  | "new-lecture"
  | "batch-announcement"
  | "payment";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  relativeTime: string;
  group: "Today" | "Earlier";
  link: string;
  isRead: boolean;
}

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    type: "doubt-answered",
    title: "Instructor Answered Your Doubt",
    body: "Karan Singhania posted a detailed explanation for 'Streaming with Suspense in Next.js 14 layout flash'.",
    relativeTime: "10m ago",
    group: "Today",
    link: "/doubts",
    isRead: false,
  },
  {
    id: "notif-2",
    type: "test-result",
    title: "Diagnostic Test Results Ready",
    body: "Your submission for Next.js 14 App Router Diagnostic is scored: 22/40 marks (Cohort Rank #237).",
    relativeTime: "45m ago",
    group: "Today",
    link: "/tests/test-1/result",
    isRead: false,
  },
  {
    id: "notif-3",
    type: "new-lecture",
    title: "New Lecture Released",
    body: "'Nested Error Handling & Route-Level Recovery' is now available in Titan Cohort 1 curriculum.",
    relativeTime: "2h ago",
    group: "Today",
    link: "/courses",
    isRead: false,
  },
  {
    id: "notif-4",
    type: "batch-announcement",
    title: "Live Q&A Session Scheduled",
    body: "Weekly fullstack architecture review with Karan Singhania starts today at 7:00 PM IST.",
    relativeTime: "4h ago",
    group: "Today",
    link: "/dashboard",
    isRead: false,
  },
  {
    id: "notif-5",
    type: "payment",
    title: "Order Payment Verified",
    body: "Payment receipt for Order #ORD-7821 confirmed. PDF invoice can be downloaded from your Profile.",
    relativeTime: "6h ago",
    group: "Today",
    link: "/profile",
    isRead: true,
  },
  {
    id: "notif-6",
    type: "doubt-answered",
    title: "Faculty Clarification Posted",
    body: "Dr. Sunita Rao answered your algorithmic question on 'Red-Black tree double black deletion'.",
    relativeTime: "Yesterday",
    group: "Earlier",
    link: "/doubts",
    isRead: true,
  },
  {
    id: "notif-7",
    type: "new-lecture",
    title: "New Lecture Released",
    body: "'Polymorphic Button & Accessible Badges' added to the Design Systems & Token Architecture module.",
    relativeTime: "2 days ago",
    group: "Earlier",
    link: "/courses",
    isRead: true,
  },
  {
    id: "notif-8",
    type: "batch-announcement",
    title: "Cohort Milestone 2 Live",
    body: "Fullstack E-Commerce Edge Caching challenge is now open for code review submissions.",
    relativeTime: "3 days ago",
    group: "Earlier",
    link: "/dashboard",
    isRead: false,
  },
  {
    id: "notif-9",
    type: "test-result",
    title: "Chapter Assessment Evaluated",
    body: "Binary Trees & BSTs Sprint diagnostic evaluated: 35/40 marks (Cohort Percentile: 94.2%).",
    relativeTime: "4 days ago",
    group: "Earlier",
    link: "/tests",
    isRead: true,
  },
  {
    id: "notif-10",
    type: "payment",
    title: "Enrollment Invoice Generated",
    body: "Enrollment invoice #INV-2026-042 for Distributed Systems Workshop is available.",
    relativeTime: "Sep 12, 2026",
    group: "Earlier",
    link: "/profile",
    isRead: true,
  },
  {
    id: "notif-11",
    type: "doubt-answered",
    title: "Instructor Replied to Query",
    body: "Priya Sharma clarified design token mapping and dynamic CSS variable bindings.",
    relativeTime: "Sep 10, 2026",
    group: "Earlier",
    link: "/doubts",
    isRead: true,
  },
];

// -------------------------------------------------------------
// Module-level Store with useSyncExternalStore
// -------------------------------------------------------------
let notificationsState: AppNotification[] = [...INITIAL_NOTIFICATIONS];
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function getNotificationsSnapshot(): AppNotification[] {
  return notificationsState;
}

export function subscribeNotifications(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function markAsRead(id: string): void {
  notificationsState = notificationsState.map((n) =>
    n.id === id ? { ...n, isRead: true } : n
  );
  emitChange();
}

export function toggleRead(id: string): void {
  notificationsState = notificationsState.map((n) =>
    n.id === id ? { ...n, isRead: !n.isRead } : n
  );
  emitChange();
}

export function markAllAsRead(): void {
  notificationsState = notificationsState.map((n) => ({ ...n, isRead: true }));
  emitChange();
}

export function useNotificationsStore() {
  const notifications = React.useSyncExternalStore(
    subscribeNotifications,
    getNotificationsSnapshot,
    getNotificationsSnapshot
  );

  const unreadCount = React.useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  return {
    notifications,
    unreadCount,
    markAsRead,
    toggleRead,
    markAllAsRead,
  };
}
