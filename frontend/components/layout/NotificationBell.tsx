"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  ChevronRight,
  MessageSquareQuote,
  Award,
  PlayCircle,
  Megaphone,
  CreditCard,
} from "lucide-react";
import {
  useNotificationsStore,
  NotificationType,
  AppNotification,
} from "@/lib/mock/notifications";

export function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "doubt-answered":
      return <MessageSquareQuote className="h-4 w-4 text-brand-blue" />;
    case "test-result":
      return <Award className="h-4 w-4 text-purple-400" />;
    case "new-lecture":
      return <PlayCircle className="h-4 w-4 text-brand-cyan" />;
    case "batch-announcement":
      return <Megaphone className="h-4 w-4 text-warning" />;
    case "payment":
      return <CreditCard className="h-4 w-4 text-success" />;
  }
}

export function NotificationBell() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotificationsStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click and Escape key
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const recentNotifications = notifications.slice(0, 5);

  const handleItemClick = (notification: AppNotification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
    router.push(notification.link);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Notifications (${unreadCount} unread)`}
        aria-expanded={isOpen}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-blue px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-background animate-in fade-in zoom-in duration-200">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-border bg-card shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 text-left"
          role="region"
          aria-label="Recent notifications"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-body-sm font-bold text-foreground">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-brand-blue/15 px-2 py-0.5 text-[11px] font-semibold text-brand-blue">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[12px] font-medium text-brand-blue hover:text-brand-blue-light transition-colors flex items-center gap-1"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* List of last 5 notifications */}
          <div className="max-h-[380px] divide-y divide-border/60 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="py-8 text-center text-body-sm text-muted-foreground">
                No notifications yet
              </div>
            ) : (
              recentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`group flex items-start gap-3 p-3.5 transition-colors cursor-pointer ${
                    !notif.isRead
                      ? "bg-brand-blue/5 hover:bg-brand-blue/10 border-l-2 border-brand-blue"
                      : "hover:bg-muted/50 border-l-2 border-transparent"
                  }`}
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/80 border border-border/70">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-1.5">
                      <p
                        className={`text-body-xs font-semibold truncate ${
                          !notif.isRead
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {notif.relativeTime}
                      </span>
                    </div>

                    <p className="text-[12px] text-muted-foreground truncate leading-relaxed">
                      {notif.body}
                    </p>
                  </div>

                  {!notif.isRead && (
                    <span
                      className="mt-1.5 h-2 w-2 rounded-full bg-brand-blue shrink-0"
                      title="Unread"
                    />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Bottom Bar: Mark all read & View all */}
          <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-2.5">
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="text-[12px] font-medium text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Mark all as read
            </button>

            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand-blue hover:text-brand-blue-light transition-colors"
            >
              <span>View all</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
