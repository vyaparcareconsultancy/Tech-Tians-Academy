"use client";

import * as React from "react";
import { useAuth } from "@/hooks/useAuth";
import { dashboardService } from "@/services/dashboard.service";
import {
  AdminDashboardData,
  TeacherDashboardData,
  StatCardData,
  QuickAction,
} from "@/types/dashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton, StatCardSkeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import Link from "next/link";
import {
  Users,
  BookOpen,
  IndianRupee,
  HelpCircle,
  PlusCircle,
  UserPlus,
  FileCheck,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  FolderOpen,
  Layers,
  FileText,
  Calendar,
  MessageSquare,
  Video,
} from "lucide-react";

export default function DashboardPage() {
  const { role, user } = useAuth();
  const { addToast } = useToast();

  const [adminData, setAdminData] = React.useState<AdminDashboardData | null>(null);
  const [teacherData, setTeacherData] = React.useState<TeacherDashboardData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Quick action modal state
  const [activeModal, setActiveModal] = React.useState<string | null>(null);
  const [formInput, setFormInput] = React.useState("");

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (role === "teacher") {
        const res = await dashboardService.getTeacherDashboard();
        setTeacherData(res);
      } else {
        const res = await dashboardService.getAdminDashboard();
        setAdminData(res);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard metrics");
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: "success",
      title: "Action Processed",
      message: `Successfully created: "${formInput || "New Item"}" in mock database.`,
    });
    setFormInput("");
    setActiveModal(null);
  };

  const getStatIcon = (icon: string) => {
    switch (icon) {
      case "Users":
        return <Users className="w-5 h-5 text-brand-blue" />;
      case "BookOpen":
        return <BookOpen className="w-5 h-5 text-brand-cyan-dark" />;
      case "IndianRupee":
        return <IndianRupee className="w-5 h-5 text-emerald-600" />;
      case "HelpCircle":
        return <HelpCircle className="w-5 h-5 text-amber-600" />;
      case "Layers":
        return <Layers className="w-5 h-5 text-brand-blue" />;
      case "FileText":
        return <FileText className="w-5 h-5 text-rose-500" />;
      default:
        return <TrendingUp className="w-5 h-5 text-brand-cyan-dark" />;
    }
  };

  /* ========================================================
     TEACHER DASHBOARD VIEW
  ======================================================== */
  if (role === "teacher") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Faculty Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Welcome back, {user?.name || "Teacher"}. Here is your teaching schedule and student doubts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadData} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
              Refresh
            </Button>
            <Link href="/my-batches">
              <Button variant="primary" size="sm" leftIcon={<Video className="w-3.5 h-3.5" />}>
                Go to Class
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
            : teacherData?.stats.map((stat: StatCardData) => (
                <Card key={stat.id} className="hover:border-slate-300 dark:hover:border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {stat.title}
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                      {getStatIcon(stat.icon)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {stat.change}
                    </div>
                    {stat.helperText && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                        {stat.helperText}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Active Batches & Pending Doubts Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Batches */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Live Sessions</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Your cohort schedule for today & tomorrow</p>
              </div>
              <Badge variant="cyan">Live Cohorts</Badge>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <div className="space-y-3">
                  {teacherData?.upcomingBatches.map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{b.name}</h4>
                        <p className="text-xs text-brand-blue font-medium mt-0.5">{b.schedule}</p>
                        <span className="text-[11px] text-slate-400">{b.studentsCount} Students enrolled</span>
                      </div>
                      <Link href="/my-batches">
                        <Button variant="secondary" size="sm">
                          Join Room
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Doubts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Urgent Doubts</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Students awaiting your response</p>
              </div>
              <Link href="/doubts">
                <Button variant="ghost" size="sm">
                  View All (14)
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <div className="space-y-3">
                  {teacherData?.recentDoubts.map((d) => (
                    <div
                      key={d.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {d.studentName} ({d.batchName})
                        </span>
                        <span className="text-[10px] text-slate-400">{d.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {d.question}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  /* ========================================================
     ADMIN DASHBOARD VIEW
  ======================================================== */
  return (
    <div className="space-y-6">
      {/* Header & Quick Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Admin Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time enrollment, curriculum health, revenue, and support status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveModal("qa_course")}
            leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            New Course
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center justify-between">
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
          <Button size="sm" variant="danger" onClick={loadData}>
            Retry
          </Button>
        </div>
      )}

      {/* 1. Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : adminData?.stats.map((stat: StatCardData) => (
              <Card key={stat.id} className="hover:border-slate-300 dark:hover:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {stat.title}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                    {getStatIcon(stat.icon)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    {stat.isPositive ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center font-medium">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        {stat.change}
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 flex items-center font-medium">
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        {stat.change}
                      </span>
                    )}
                  </div>
                  {stat.helperText && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                      {stat.helperText}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
      </div>

      {/* 2. Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Instant Operations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {adminData?.quickActions.map((qa: QuickAction) => (
            <div
              key={qa.id}
              onClick={() => setActiveModal(qa.id)}
              className="cursor-pointer group flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-navy hover:shadow-md hover:border-brand-blue/50 dark:hover:border-brand-blue/50 transition-all duration-150"
            >
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 group-hover:bg-brand-blue group-hover:text-white text-brand-blue transition-colors">
                {qa.id === "qa_course" && <PlusCircle className="w-5 h-5" />}
                {qa.id === "qa_teacher" && <UserPlus className="w-5 h-5" />}
                {qa.id === "qa_test" && <FileCheck className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-brand-blue transition-colors">
                  {qa.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {qa.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recent Activity Feed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live updates across students, faculty, and learning assessments
            </p>
          </div>
          <Badge variant="blue">Live Feed</Badge>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3 py-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : !adminData?.recentActivities || adminData.recentActivities.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <FolderOpen className="w-8 h-8 mx-auto text-slate-400" />
              <p className="text-sm font-medium text-slate-600">No activity recorded yet</p>
              <p className="text-xs text-slate-400">Events will show up here automatically.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {adminData.recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between py-3.5 gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 shrink-0">
                      {act.user.name.slice(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        <span className="font-semibold">{act.user.name}</span>{" "}
                        <span className="text-slate-500">{act.action}</span>{" "}
                        <span className="font-medium text-brand-blue">{act.target}</span>
                      </p>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {act.timestamp}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      act.type === "order"
                        ? "success"
                        : act.type === "doubt"
                        ? "warning"
                        : act.type === "test"
                        ? "cyan"
                        : "default"
                    }
                  >
                    {act.type}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interactive Quick Action Modal */}
      <Modal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        title={
          activeModal === "qa_course"
            ? "Create New Course"
            : activeModal === "qa_teacher"
            ? "Invite Teacher / Faculty"
            : "Schedule Assessment Test"
        }
        description="Fill out the details below to publish to the Tech Tians catalog."
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleActionSubmit}>
              Confirm & Save
            </Button>
          </div>
        }
      >
        <form onSubmit={handleActionSubmit} className="space-y-4">
          <Input
            label={
              activeModal === "qa_course"
                ? "Course Title"
                : activeModal === "qa_teacher"
                ? "Teacher Full Name & Email"
                : "Test Title"
            }
            placeholder={
              activeModal === "qa_course"
                ? "e.g. Next.js 14 Production Masterclass"
                : activeModal === "qa_teacher"
                ? "e.g. Dr. Aryan Sharma (aryan@techtians.com)"
                : "e.g. Weekly Full Stack MCQ Assessment"
            }
            value={formInput}
            onChange={(e) => setFormInput(e.target.value)}
            required
          />
          <p className="text-xs text-slate-400">
            This action creates a record in the API layer and notifies active batches via FCM.
          </p>
        </form>
      </Modal>
    </div>
  );
}
