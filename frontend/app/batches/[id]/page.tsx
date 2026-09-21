"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  User,
  Calendar,
  BookOpen,
  PlayCircle,
  Lock,
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Badge, Button, Card, CardContent } from "@/components/ui";
import {
  getBatchById,
  getCourseById,
  getBatchProgress,
  getSubjectProgress,
  isLectureCompleted,
} from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils";

export default function BatchDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const batch = getBatchById(params.id);

  if (!batch) {
    notFound();
  }

  const course = getCourseById(batch.courseId);
  const batchProgress = getBatchProgress(batch);

  // Desktop active subject state
  const [selectedSubjectId, setSelectedSubjectId] = React.useState(
    batch.subjects[0]?.id || ""
  );

  const selectedSubject =
    batch.subjects.find((s) => s.id === selectedSubjectId) || batch.subjects[0];
  const selectedSubjectProgress = selectedSubject
    ? getSubjectProgress(selectedSubject)
    : null;

  return (
    <div>
        {/* Navigation Breadcrumb Bar */}
        <div className="border-b border-border bg-card/40">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 hover:text-brand-blue"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Dashboard</span>
              </Link>
              <span>/</span>
              <span className="truncate font-medium text-foreground">
                {batch.name}
              </span>
            </div>
          </div>
        </div>

        <PageContainer className="pt-8 space-y-8">
          {/* Header Card */}
          <Card variant="default" className="border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge variant="primary" size="sm">
                    Active Cohort
                  </Badge>
                  {course && (
                    <Link
                      href={`/courses/${course.id}`}
                      className="inline-flex items-center gap-1 text-caption font-medium text-brand-blue hover:underline"
                    >
                      <span>Course: {course.title}</span>
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  )}
                </div>

                <h1 className="text-h2 font-bold tracking-tight text-foreground">
                  {batch.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-body-sm text-muted-foreground pt-1">
                  {course && (
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4 text-brand-blue" aria-hidden="true" />
                      <span className="font-medium text-foreground">{course.faculty}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-brand-cyan" aria-hidden="true" />
                    <span>Started: {batch.startDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                    <span>{batch.subjects.length} Core Subjects</span>
                  </div>
                </div>
              </div>

              {/* Overall Progress Widget */}
              <div className="w-full lg:w-72 rounded-lg border border-border bg-muted/30 p-4 space-y-2 shrink-0">
                <div className="flex items-center justify-between text-body-sm font-semibold">
                  <span className="text-foreground">Overall Batch Progress</span>
                  <span className="text-brand-blue">{batchProgress.percentage}%</span>
                </div>
                <div
                  className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-valuenow={batchProgress.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Overall progress ${batchProgress.percentage}%`}
                >
                  <div
                    className="h-full rounded-full bg-brand-blue transition-all duration-300"
                    style={{ width: `${batchProgress.percentage}%` }}
                  />
                </div>
                <p className="text-caption text-muted-foreground text-right">
                  {batchProgress.completed} of {batchProgress.total} lectures completed
                </p>
              </div>
            </div>
          </Card>

          {/* ========================================================================= */}
          {/* DESKTOP LAYOUT (2 Columns: Sidebar Subjects + Selected Subject Lectures)   */}
          {/* ========================================================================= */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            {/* Left: Subjects List Sidebar */}
            <aside className="space-y-4 lg:col-span-1" aria-label="Batch Subjects">
              <div className="flex items-center justify-between">
                <h2 className="text-body font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-brand-blue" aria-hidden="true" />
                  Subjects Curriculum
                </h2>
                <span className="text-caption text-muted-foreground font-mono">
                  {batch.subjects.length} Subjects
                </span>
              </div>

              <div className="space-y-3">
                {batch.subjects.map((subject) => {
                  const sProgress = getSubjectProgress(subject);
                  const isSelected = subject.id === selectedSubject?.id;

                  return (
                    <button
                      key={subject.id}
                      type="button"
                      onClick={() => setSelectedSubjectId(subject.id)}
                      className={cn(
                        "w-full text-left rounded-xl border p-4 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue",
                        isSelected
                          ? "border-brand-blue bg-brand-blue/5 shadow-sm ring-1 ring-brand-blue/30"
                          : "border-border bg-card hover:border-brand-blue/40 hover:bg-muted/30"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-body-sm font-bold text-foreground line-clamp-1">
                          {subject.name}
                        </h3>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 shrink-0 transition-transform text-muted-foreground",
                            isSelected && "text-brand-blue translate-x-0.5"
                          )}
                          aria-hidden="true"
                        />
                      </div>

                      {/* Subject Progress Bar */}
                      <div className="space-y-1.5 mt-3">
                        <div className="flex items-center justify-between text-caption font-medium">
                          <span className="text-muted-foreground">
                            {sProgress.completed} of {sProgress.total} lectures
                          </span>
                          <span
                            className={cn(
                              "font-semibold",
                              sProgress.percentage === 100
                                ? "text-success"
                                : "text-brand-blue"
                            )}
                          >
                            {sProgress.percentage}%
                          </span>
                        </div>
                        <div
                          className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                          role="progressbar"
                          aria-valuenow={sProgress.percentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${subject.name} progress: ${sProgress.percentage}%`}
                        >
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-300",
                              sProgress.percentage === 100 ? "bg-success" : "bg-brand-blue"
                            )}
                            style={{ width: `${sProgress.percentage}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Right: Selected Subject Chapters & Lecture Rows */}
            <section className="space-y-6 lg:col-span-2" aria-label="Subject Chapters">
              {selectedSubject && selectedSubjectProgress && (
                <div className="space-y-6">
                  {/* Selected Subject Header Banner */}
                  <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="primary" size="sm">
                        Selected Subject
                      </Badge>
                      <span className="text-caption font-medium text-muted-foreground">
                        {selectedSubject.chapters.length} Chapters • {selectedSubjectProgress.total} Lectures
                      </span>
                    </div>
                    <h2 className="text-h3 font-bold text-foreground">
                      {selectedSubject.name}
                    </h2>
                  </div>

                  {/* Chapters and Lectures */}
                  <div className="space-y-4">
                    {selectedSubject.chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
                      >
                        {/* Chapter Header */}
                        <div className="bg-muted/40 px-5 py-3.5 border-b border-border flex items-center justify-between">
                          <h3 className="text-body font-semibold text-foreground">
                            {chapter.title}
                          </h3>
                          <span className="text-caption font-medium text-muted-foreground">
                            {chapter.lectures.length} lectures
                          </span>
                        </div>

                        {/* Lecture Rows */}
                        <div className="divide-y divide-border">
                          {chapter.lectures.map((lecture) => {
                            const completed = isLectureCompleted(lecture.id);

                            return (
                              <div
                                key={lecture.id}
                                className="flex flex-col gap-3 p-4 transition hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  {/* Completion Status Indicator */}
                                  {completed ? (
                                    <div
                                      title="Lecture Completed"
                                      className="text-success shrink-0"
                                      aria-label="Completed"
                                    >
                                      <CheckCircle2 className="h-5 w-5 fill-success/10" />
                                    </div>
                                  ) : (
                                    <div
                                      title="Lecture Pending"
                                      className="text-muted-foreground/40 shrink-0"
                                      aria-label="Not completed"
                                    >
                                      <Circle className="h-5 w-5" />
                                    </div>
                                  )}

                                  <div className="min-w-0">
                                    <p
                                      className={cn(
                                        "text-body-sm font-medium line-clamp-1",
                                        completed ? "text-foreground font-semibold" : "text-foreground"
                                      )}
                                    >
                                      {lecture.title}
                                    </p>
                                    <div className="flex items-center gap-3 text-caption text-muted-foreground mt-0.5">
                                      <span className="flex items-center gap-1 font-mono">
                                        <Clock className="h-3 w-3 text-brand-blue" aria-hidden="true" />
                                        {lecture.duration}
                                      </span>
                                      {lecture.isFree && (
                                        <Badge variant="success" size="sm">
                                          Free Preview
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Action / Link to /lectures/[id] */}
                                <div className="flex shrink-0 items-center self-end sm:self-center">
                                  <Link href={`/lectures/${lecture.id}`}>
                                    <Button
                                      size="sm"
                                      variant={completed ? "outline" : "primary"}
                                      leftIcon={<PlayCircle className="h-4 w-4" aria-hidden="true" />}
                                    >
                                      {completed ? "Rewatch" : "Watch Lecture"}
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* ========================================================================= */}
          {/* MOBILE LAYOUT (Stacked Accordion for Subjects & Chapters)                  */}
          {/* ========================================================================= */}
          <div className="block lg:hidden space-y-4" aria-label="Batch Subjects Mobile Accordion">
            <h2 className="text-body font-bold text-foreground">
              Subjects Curriculum
            </h2>

            <div className="space-y-4">
              {batch.subjects.map((subject, sIdx) => {
                const sProgress = getSubjectProgress(subject);

                return (
                  <details
                    key={subject.id}
                    open={sIdx === 0}
                    className="group rounded-xl border border-border bg-card overflow-hidden transition-colors open:border-brand-blue/50"
                  >
                    <summary className="flex cursor-pointer flex-col p-4 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-body font-bold text-foreground">
                          {subject.name}
                        </h3>
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180 text-muted-foreground" />
                      </div>

                      <div className="space-y-1.5 mt-3">
                        <div className="flex items-center justify-between text-caption font-medium">
                          <span className="text-muted-foreground">
                            {sProgress.completed} of {sProgress.total} lectures completed
                          </span>
                          <span className="text-brand-blue font-semibold">
                            {sProgress.percentage}%
                          </span>
                        </div>
                        <div
                          className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                          role="progressbar"
                          aria-valuenow={sProgress.percentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="h-full rounded-full bg-brand-blue transition-all duration-300"
                            style={{ width: `${sProgress.percentage}%` }}
                          />
                        </div>
                      </div>
                    </summary>

                    {/* Chapters Inside Subject */}
                    <div className="border-t border-border p-3 space-y-4 bg-muted/10">
                      {subject.chapters.map((chapter) => (
                        <div
                          key={chapter.id}
                          className="rounded-lg border border-border bg-card overflow-hidden"
                        >
                          <div className="bg-muted/40 px-3.5 py-2 border-b border-border flex items-center justify-between">
                            <h4 className="text-body-sm font-semibold text-foreground">
                              {chapter.title}
                            </h4>
                            <span className="text-caption text-muted-foreground font-mono">
                              {chapter.lectures.length}
                            </span>
                          </div>

                          <div className="divide-y divide-border">
                            {chapter.lectures.map((lecture) => {
                              const completed = isLectureCompleted(lecture.id);

                              return (
                                <div
                                  key={lecture.id}
                                  className="flex items-center justify-between p-3 gap-2"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    {completed ? (
                                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                                    ) : (
                                      <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                                    )}
                                    <div className="min-w-0">
                                      <p className="text-caption font-medium text-foreground truncate">
                                        {lecture.title}
                                      </p>
                                      <span className="text-[11px] text-muted-foreground font-mono">
                                        {lecture.duration}
                                      </span>
                                    </div>
                                  </div>

                                  <Link href={`/lectures/${lecture.id}`} className="shrink-0">
                                    <Button size="sm" variant={completed ? "outline" : "primary"}>
                                      {completed ? "Rewatch" : "Watch"}
                                    </Button>
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </PageContainer>
    </div>
  );
}
