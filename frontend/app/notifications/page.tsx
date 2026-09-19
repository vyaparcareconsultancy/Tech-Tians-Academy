"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Mail,
  MailOpen,
  ArrowRight,
  Inbox,
} from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import {
  useNotificationsStore,
  AppNotification,
  NotificationType,
} from "@/lib/mock/notifications";
import { getNotificationIcon } from "@/components/layout/NotificationBell";

function getTypeBadge(type: NotificationType) {
  switch (type) {
    case "doubt-answered":
      return <Badge variant="primary" size="sm">Doubt Q&A</Badge>;
    case "test-result":
      return <Badge variant="outline" size="sm" className="border-purple-500/30 text-purple-400">Test Result</Badge>;
    case "new-lecture":
      return <Badge variant="outline" size="sm" className="border-brand-cyan/30 text-brand-cyan">New Lecture</Badge>;
    case "batch-announcement":
      return <Badge variant="warning" size="sm">Cohort Update</Badge>;
    case "payment":
      return <Badge variant="success" size="sm">Billing</Badge>;
  }
}

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, toggleRead, markAllAsRead } =
    useNotificationsStore();
  const [filter, setFilter] = React.useState<"All" | "Unread">("All");

  const filtered = React.useMemo(() => {
    if (filter === "Unread") {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, filter]);

  const todayList = React.useMemo(
    () => filtered.filter((n) => n.group === "Today"),
    [filtered]
  );

  const earlierList = React.useMemo(
    () => filtered.filter((n) => n.group === "Earlier"),
    [filtered]
  );

  return (
    <PageContainer className="max-w-4xl space-y-8 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-h2 font-bold tracking-tight text-foreground sm:text-3xl">
              Notifications
            </h1>
            <p className="text-caption text-muted-foreground mt-0.5">
              Stay updated on instructor answers, assessment scores, and lecture releases
            </p>
          </div>
        </div>

        {/* Mark All As Read Button */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            leftIcon={<CheckCheck className="h-4 w-4 text-brand-blue" />}
          >
            Mark all as read
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1">
          <button
            type="button"
            onClick={() => setFilter("All")}
            className={`rounded-md px-3.5 py-1.5 text-body-sm font-medium transition-colors ${
              filter === "All"
                ? "bg-brand-blue text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("Unread")}
            className={`rounded-md px-3.5 py-1.5 text-body-sm font-medium transition-colors ${
              filter === "Unread"
                ? "bg-brand-blue text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        <span className="text-caption text-muted-foreground font-medium">
          {filtered.length} {filtered.length === 1 ? "notification" : "notifications"}
        </span>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <Card variant="default" className="border-border bg-card p-12 text-center space-y-3 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
            <Inbox className="h-7 w-7" />
          </div>
          <h3 className="text-body font-bold text-foreground">
            {filter === "Unread" ? "No unread notifications" : "No notifications yet"}
          </h3>
          <p className="text-caption text-muted-foreground max-w-sm mx-auto">
            {filter === "Unread"
              ? "You're all caught up! There are no unread notifications right now."
              : "When instructors answer your queries or test results are posted, they will appear here."}
          </p>
          {filter === "Unread" && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter("All")}
              >
                View all notifications
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Notification Groups */}
      <div className="space-y-8">
        {/* Today Group */}
        {todayList.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-caption font-bold uppercase tracking-wider text-brand-blue">
                Today
              </h2>
              <div className="h-px flex-1 bg-border/60" />
            </div>

            <div className="space-y-2.5">
              {todayList.map((notif) => (
                <NotificationRow
                  key={notif.id}
                  notification={notif}
                  onToggleRead={() => toggleRead(notif.id)}
                  onMarkRead={() => markAsRead(notif.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Earlier Group */}
        {earlierList.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-caption font-bold uppercase tracking-wider text-muted-foreground">
                Earlier
              </h2>
              <div className="h-px flex-1 bg-border/60" />
            </div>

            <div className="space-y-2.5">
              {earlierList.map((notif) => (
                <NotificationRow
                  key={notif.id}
                  notification={notif}
                  onToggleRead={() => toggleRead(notif.id)}
                  onMarkRead={() => markAsRead(notif.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

function NotificationRow({
  notification,
  onToggleRead,
  onMarkRead,
}: {
  notification: AppNotification;
  onToggleRead: () => void;
  onMarkRead: () => void;
}) {
  return (
    <Card
      variant="default"
      className={`border-border transition-all p-4 sm:p-5 shadow-sm ${
        !notification.isRead
          ? "bg-brand-blue/5 border-l-4 border-l-brand-blue border-border"
          : "bg-card border-l-4 border-l-transparent text-muted-foreground hover:bg-muted/30"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left icon & content */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted border border-border">
            {getNotificationIcon(notification.type)}
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              {getTypeBadge(notification.type)}
              <span className="text-[11px] text-muted-foreground">
                {notification.relativeTime}
              </span>
              {!notification.isRead && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-blue/15 px-2 py-0.5 text-[10px] font-bold text-brand-blue">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-blue animate-pulse" />
                  Unread
                </span>
              )}
            </div>

            <h3
              className={`text-body font-semibold ${
                !notification.isRead ? "text-foreground" : "text-foreground/80"
              }`}
            >
              {notification.title}
            </h3>

            <p className="text-body-sm text-foreground/80 leading-relaxed">
              {notification.body}
            </p>
          </div>
        </div>

        {/* Right actions: View link + Toggle read */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
          <button
            type="button"
            onClick={onToggleRead}
            title={notification.isRead ? "Mark as unread" : "Mark as read"}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-caption font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {notification.isRead ? (
              <>
                <Mail className="h-3.5 w-3.5 text-brand-blue" />
                <span className="hidden sm:inline">Mark unread</span>
              </>
            ) : (
              <>
                <MailOpen className="h-3.5 w-3.5 text-success" />
                <span className="hidden sm:inline">Mark read</span>
              </>
            )}
          </button>

          <Link href={notification.link} onClick={onMarkRead}>
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              View
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
