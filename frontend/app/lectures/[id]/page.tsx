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
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  PlayCircle,
  Layers,
  BookOpen,
} from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Badge, Button, Card, CardContent } from "@/components/ui";
import { getLectureDetails, isLectureCompleted } from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils";

export default function LectureWatchPage({
  params,
}: {
  params: { id: string };
}) {
  const details = getLectureDetails(params.id);

  if (!details) {
    notFound();
  }

  const { lecture, chapter, subject, batch, course, prevLecture, nextLecture, chapterLectures } =
    details;

  // Single-source initialized completion toggle
  const [isCompleted, setIsCompleted] = React.useState<boolean>(() =>
    isLectureCompleted(lecture.id)
  );

  // Sync state if lecture ID changes
  React.useEffect(() => {
    setIsCompleted(isLectureCompleted(lecture.id));
  }, [lecture.id]);

  const handleToggleComplete = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    console.log(
      `Lecture "${lecture.title}" (${lecture.id}) completion status toggled to:`,
      nextState
    );
  };

  return (
    <div>
        {/* Breadcrumb Navigation Bar */}
        <div className="border-b border-border bg-card/40">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2 text-body-sm text-muted-foreground">
              <Link
                href={`/batches/${batch.id}`}
                className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition hover:text-brand-blue"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Back to {batch.name}</span>
              </Link>
              <span>/</span>
              <span className="truncate text-muted-foreground">{subject.name}</span>
              <span>/</span>
              <span className="truncate font-medium text-foreground">{chapter.title}</span>
            </div>
          </div>
        </div>

        <PageContainer className="pt-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* ======================================================= */}
            {/* Left: Video Player, Controls, Description, Notes        */}
            {/* ======================================================= */}
            <div className="space-y-6 lg:col-span-2">
              {/* 16:9 Responsive YouTube Embed (Plain <iframe>, no npm player package) */}
              <div className="relative w-full overflow-hidden rounded-xl bg-black shadow-lg aspect-video border border-border">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${lecture.youtubeId}?rel=0&modestbranding=1`}
                  title={lecture.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>

              {/* Lecture Title & Completion Controls */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-border pb-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="primary" size="sm">
                      {subject.name}
                    </Badge>
                    <span className="text-caption text-muted-foreground">
                      {chapter.title}
                    </span>
                  </div>

                  <h1 className="text-h3 font-bold tracking-tight text-foreground">
                    {lecture.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-body-sm text-muted-foreground pt-1">
                    {course && (
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4 text-brand-blue" aria-hidden="true" />
                        <span className="font-medium text-foreground">{course.faculty}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 font-mono">
                      <Clock className="h-4 w-4 text-brand-cyan" aria-hidden="true" />
                      <span>{lecture.duration}</span>
                    </div>
                  </div>
                </div>

                {/* "Mark as Complete" Button */}
                <div className="shrink-0 self-start sm:self-center">
                  <Button
                    type="button"
                    variant={isCompleted ? "outline" : "primary"}
                    size="md"
                    onClick={handleToggleComplete}
                    leftIcon={
                      <CheckCircle2
                        className={cn(
                          "h-4 w-4",
                          isCompleted ? "text-success fill-success/10" : "text-white"
                        )}
                        aria-hidden="true"
                      />
                    }
                    className={cn(
                      isCompleted && "border-success/40 text-success hover:bg-success/10"
                    )}
                  >
                    {isCompleted ? "Completed" : "Mark as Complete"}
                  </Button>
                </div>
              </div>

              {/* Prev / Next Lecture Navigation Buttons */}
              <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                <div>
                  {prevLecture ? (
                    <Link href={`/lectures/${prevLecture.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<ChevronLeft className="h-4 w-4" aria-hidden="true" />}
                      >
                        <span className="hidden sm:inline">Previous:</span> {prevLecture.title.slice(0, 20)}...
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      leftIcon={<ChevronLeft className="h-4 w-4" aria-hidden="true" />}
                    >
                      Previous
                    </Button>
                  )}
                </div>

                <div>
                  {nextLecture ? (
                    <Link href={`/lectures/${nextLecture.id}`}>
                      <Button
                        size="sm"
                        variant="primary"
                        rightIcon={<ChevronRight className="h-4 w-4" aria-hidden="true" />}
                      >
                        <span className="hidden sm:inline">Next:</span> {nextLecture.title.slice(0, 20)}...
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      disabled
                      rightIcon={<ChevronRight className="h-4 w-4" aria-hidden="true" />}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>

              {/* Description Section */}
              <Card variant="default" className="p-6 space-y-3">
                <h2 className="text-body font-bold text-foreground">
                  About This Lecture
                </h2>
                <p className="text-body-sm leading-relaxed text-muted-foreground">
                  {lecture.description}
                </p>
              </Card>

              {/* Notes / Study Material List */}
              <Card variant="default" className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-brand-blue" aria-hidden="true" />
                    <h2 className="text-body font-bold text-foreground">
                      Notes & Study Materials
                    </h2>
                  </div>
                  <span className="text-caption text-muted-foreground font-mono">
                    {lecture.notes?.length || 0} files
                  </span>
                </div>

                <div className="divide-y divide-border">
                  {lecture.notes?.map((note, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                          <FileText className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-body-sm font-medium text-foreground truncate">
                            {note.title}
                          </p>
                          <span className="text-caption text-muted-foreground font-mono">
                            {note.size} • PDF Document
                          </span>
                        </div>
                      </div>

                      <a
                        href={note.url}
                        download
                        className="shrink-0 self-end sm:self-center"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<Download className="h-3.5 w-3.5" aria-hidden="true" />}
                        >
                          Download
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* ======================================================= */}
            {/* Right: Chapter Lectures Sidebar (Collapsible on mobile) */}
            {/* ======================================================= */}
            <aside className="space-y-4 lg:col-span-1" aria-label="Chapter Lectures">
              {/* Desktop View */}
              <div className="hidden lg:block space-y-4">
                <Card variant="default" className="overflow-hidden p-0">
                  <div className="border-b border-border bg-muted/40 p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-caption font-semibold text-brand-blue uppercase tracking-wider">
                        Chapter Playlist
                      </span>
                      <span className="text-caption font-mono text-muted-foreground">
                        {chapterLectures.length} Lectures
                      </span>
                    </div>
                    <h3 className="text-body-sm font-bold text-foreground line-clamp-1">
                      {chapter.title}
                    </h3>
                  </div>

                  <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                    {chapterLectures.map((l, index) => {
                      const isCurrent = l.id === lecture.id;
                      const completed =
                        isCurrent ? isCompleted : isLectureCompleted(l.id);

                      return (
                        <Link
                          key={l.id}
                          href={`/lectures/${l.id}`}
                          className={cn(
                            "flex items-start gap-3 p-3.5 transition-colors text-left select-none",
                            isCurrent
                              ? "bg-brand-blue/10 border-l-4 border-l-brand-blue"
                              : "hover:bg-muted/30"
                          )}
                        >
                          <div className="pt-0.5 shrink-0">
                            {completed ? (
                              <CheckCircle2 className="h-4 w-4 text-success fill-success/10" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground/40" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1 space-y-1">
                            <p
                              className={cn(
                                "text-body-sm font-medium line-clamp-2",
                                isCurrent ? "text-brand-blue font-bold" : "text-foreground"
                              )}
                            >
                              {index + 1}. {l.title}
                            </p>
                            <div className="flex items-center gap-2 text-caption text-muted-foreground font-mono">
                              <span>{l.duration}</span>
                              {l.isFree && (
                                <Badge variant="success" size="sm">
                                  Free
                                </Badge>
                              )}
                            </div>
                          </div>

                          {isCurrent && (
                            <PlayCircle className="h-4 w-4 text-brand-blue shrink-0 mt-1" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* Mobile Collapsible Details View */}
              <div className="block lg:hidden">
                <details
                  open
                  className="group rounded-xl border border-border bg-card overflow-hidden shadow-sm open:border-brand-blue/40"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-4 font-bold text-foreground select-none">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-brand-blue" aria-hidden="true" />
                      <span>Other Lectures in this Chapter ({chapterLectures.length})</span>
                    </div>
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180 text-muted-foreground" />
                  </summary>

                  <div className="divide-y divide-border border-t border-border">
                    {chapterLectures.map((l, index) => {
                      const isCurrent = l.id === lecture.id;
                      const completed =
                        isCurrent ? isCompleted : isLectureCompleted(l.id);

                      return (
                        <Link
                          key={l.id}
                          href={`/lectures/${l.id}`}
                          className={cn(
                            "flex items-center justify-between p-3 transition-colors",
                            isCurrent ? "bg-brand-blue/10" : "hover:bg-muted/30"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {completed ? (
                              <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                            )}
                            <p
                              className={cn(
                                "text-caption truncate",
                                isCurrent ? "text-brand-blue font-bold" : "text-foreground"
                              )}
                            >
                              {index + 1}. {l.title}
                            </p>
                          </div>
                          <span className="text-[11px] text-muted-foreground font-mono shrink-0 pl-2">
                            {l.duration}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </details>
              </div>
            </aside>
          </div>
        </PageContainer>
    </div>
  );
}
