"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  Layers,
  Clock,
  Award,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  MOCK_STUDENT,
  MOCK_RECENT_LECTURES,
  MOCK_ENROLLED_COURSES,
  MOCK_UPCOMING_CLASSES,
} from "@/lib/mock/dashboard";
import {
  StatsCard,
  ContinueLearningCard,
  CourseCard,
  UpcomingClassItem,
  DashboardSkeleton,
  EmptyCoursesState,
} from "@/components/dashboard";
import { Badge, Button } from "@/components/ui";

export default function StudentDashboardPage() {
  // Demo state toggle for testing Normal, Skeleton Loading, and Empty State
  const [viewState, setViewState] = React.useState<"default" | "loading" | "empty">("default");

  // Format current date: e.g. "Saturday, September 19, 2026"
  const formattedDate = React.useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
  }, []);

  const courses = viewState === "empty" ? [] : MOCK_ENROLLED_COURSES;
  const recentLectures = viewState === "empty" ? [] : MOCK_RECENT_LECTURES;

  return (
    <div className="space-y-10 pb-12">
      {/* 1. Welcome Header */}
      <header className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-h2 font-bold tracking-tight text-foreground">
            Welcome back, {MOCK_STUDENT.name}!
          </h1>
          <p className="text-body-sm text-muted-foreground">
            Ready to continue your learning journey? Here is your daily study overview.
          </p>
        </div>

        {/* Date & Demo Mode Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-body-sm text-muted-foreground shadow-sm">
            <Calendar className="h-4 w-4 text-brand-blue" aria-hidden="true" />
            <span className="font-medium text-foreground">{formattedDate}</span>
          </div>

          {/* Quick Demo Switcher for Evaluation */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => setViewState("default")}
              className={`rounded-md px-2.5 py-1 text-caption font-medium transition-colors ${
                viewState === "default"
                  ? "bg-card text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Default
            </button>
            <button
              type="button"
              onClick={() => setViewState("loading")}
              className={`rounded-md px-2.5 py-1 text-caption font-medium transition-colors ${
                viewState === "loading"
                  ? "bg-card text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Skeleton
            </button>
            <button
              type="button"
              onClick={() => setViewState("empty")}
              className={`rounded-md px-2.5 py-1 text-caption font-medium transition-colors ${
                viewState === "empty"
                  ? "bg-card text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Empty State
            </button>
          </div>
        </div>
      </header>

      {viewState === "loading" ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* 2. Stats Row - 4 Compact Cards */}
          <section aria-label="Student Learning Statistics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            label="Enrolled Courses"
            value={viewState === "empty" ? 0 : MOCK_STUDENT.enrolledCoursesCount}
            icon={BookOpen}
            iconColor="text-brand-blue"
            bgColor="bg-brand-blue/10"
            subtext="Active learning paths"
          />
          <StatsCard
            label="Active Batches"
            value={viewState === "empty" ? 0 : MOCK_STUDENT.activeBatchesCount}
            icon={Layers}
            iconColor="text-indigo-600"
            bgColor="bg-indigo-600/10"
            subtext="Live cohort groups"
          />
          <StatsCard
            label="Hours Watched"
            value={viewState === "empty" ? "0h" : `${MOCK_STUDENT.hoursWatched}h`}
            icon={Clock}
            iconColor="text-emerald-600"
            bgColor="bg-emerald-600/10"
            subtext="Total video study time"
          />
          <StatsCard
            label="Overall Completion"
            value={viewState === "empty" ? "0%" : `${MOCK_STUDENT.completionPercentage}%`}
            icon={Award}
            iconColor="text-amber-600"
            bgColor="bg-amber-600/10"
            subtext="Across all enrolled tracks"
          />
        </div>
      </section>

      {/* 3. Continue Learning Row */}
      {recentLectures.length > 0 && (
        <section className="space-y-4" aria-label="Continue Learning Section">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-h3 font-bold tracking-tight text-foreground">
                Continue Learning
              </h2>
              <p className="text-caption text-muted-foreground">
                Pick up right where you left off
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentLectures.map((lecture) => (
              <ContinueLearningCard key={lecture.id} lecture={lecture} />
            ))}
          </div>
        </section>
      )}

      {/* 4 & 5. Responsive Grid: My Courses (2 Cols) + Upcoming Classes (1 Col) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* 4. My Courses Grid */}
        <section className="space-y-4 lg:col-span-2" aria-label="My Enrolled Courses">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-h3 font-bold tracking-tight text-foreground">
                My Courses
              </h2>
              <p className="text-caption text-muted-foreground">
                Manage your syllabus, view milestones, and track batch progress
              </p>
            </div>
            {courses.length > 0 && (
              <Link
                href="/courses"
                className="inline-flex items-center gap-1 text-body-sm font-medium text-brand-blue hover:underline"
              >
                <span>View all</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>

          {courses.length === 0 ? (
            <EmptyCoursesState />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </section>

        {/* 5. Upcoming Classes Vertical List */}
        <section className="space-y-4" aria-label="Upcoming Live Classes">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-h3 font-bold tracking-tight text-foreground">
                Upcoming Classes
              </h2>
              <p className="text-caption text-muted-foreground">
                Next 4 live interactive sessions
              </p>
            </div>
            <Badge variant="primary" size="sm">
              Live Portal
            </Badge>
          </div>

          <div className="space-y-3">
            {MOCK_UPCOMING_CLASSES.map((item) => (
              <UpcomingClassItem key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </>
  )}
</div>
  );
}
