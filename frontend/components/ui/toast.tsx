"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

type ToastInput = Omit<ToastItem, "id">;

interface ToastStore {
  toasts: ToastItem[];
  addToast: (toast: ToastInput) => string;
  removeToast: (id: string) => void;
}

// Minimal pub-sub toast store for zero-dependency universal reactivity
const listeners = new Set<() => void>();
let memoryToasts: ToastItem[] = [];

function notify() {
  listeners.forEach((listener) => listener());
}

export const toastStore: ToastStore = {
  toasts: memoryToasts,
  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2, 9);
    const item: ToastItem = { id, ...toast };
    memoryToasts = [...memoryToasts, item];
    toastStore.toasts = memoryToasts;
    notify();

    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        toastStore.removeToast(id);
      }, duration);
    }
    return id;
  },
  removeToast: (id) => {
    memoryToasts = memoryToasts.filter((t) => t.id !== id);
    toastStore.toasts = memoryToasts;
    notify();
  },
};

export function useToast() {
  const toast = React.useCallback(
    (input: ToastInput) => toastStore.addToast(input),
    []
  );

  const dismiss = React.useCallback(
    (id: string) => toastStore.removeToast(id),
    []
  );

  return {
    toast,
    dismiss,
    success: (title: string, description?: string, duration?: number) =>
      toast({ title, description, type: "success", duration }),
    error: (title: string, description?: string, duration?: number) =>
      toast({ title, description, type: "error", duration }),
    warning: (title: string, description?: string, duration?: number) =>
      toast({ title, description, type: "warning", duration }),
    info: (title: string, description?: string, duration?: number) =>
      toast({ title, description, type: "info", duration }),
  };
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const handleUpdate = () => {
      setToasts([...toastStore.toasts]);
    };
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  if (!mounted || toasts.length === 0) return null;

  const icons: Record<ToastType, React.ReactNode> = {
    success: (
      <svg className="h-5 w-5 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5 text-danger shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5 text-warning shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5 text-info shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return createPortal(
    <div
      role="region"
      aria-label="Notifications"
      className="fixed top-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 pointer-events-none"
    >
      {toasts.map((item) => {
        const type = item.type || "info";
        return (
          <div
            key={item.id}
            role={type === "error" ? "alert" : "status"}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-md transition-all duration-200",
              "animate-in slide-in-from-top-2 fade-in",
              type === "success" && "border-success/30",
              type === "error" && "border-danger/30",
              type === "warning" && "border-warning/30",
              type === "info" && "border-info/30"
            )}
          >
            {icons[type]}
            <div className="flex-1 space-y-0.5 text-left">
              {item.title && (
                <p className="text-body-sm font-semibold text-foreground">
                  {item.title}
                </p>
              )}
              {item.description && (
                <p className="text-caption text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => toastStore.removeToast(item.id)}
              aria-label="Dismiss notification"
              className="rounded p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
