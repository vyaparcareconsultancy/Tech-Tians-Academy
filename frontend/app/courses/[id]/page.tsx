"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  Clock,
  User,
  CheckCircle2,
  PlayCircle,
  ChevronDown,
  BookOpen,
  Award,
  Sparkles,
} from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import { getCourseById } from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils";

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const course = getCourseById(params.id);

  if (!course) {
    notFound();
  }

  const handleEnroll = () => {
    console.log("Enrolled in course:", course.id, course.title);
    alert(`Successfully enrolled in ${course.title}!`);
  };

  const totalLecturesCount =
    course.syllabus?.reduce((acc, ch) => acc + ch.lectures.length, 0) || 12;

  return (
    <div>
      {/* Course Banner */}
        <header
          className={cn(
            "relative overflow-hidden bg-gradient-to-br py-12 text-white sm:py-16",
            course.thumbnailBg || "from-brand-navy via-brand-navy-mid to-brand-blue"
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(var(--brand-cyan)_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <Badge
                variant="default"
                size="sm"
                className="bg-black/40 text-brand-cyan border-white/20 backdrop-blur-md"
              >
                {course.category}
              </Badge>

              <h1 className="text-h1 font-extrabold tracking-tight text-white leading-tight">
                {course.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-body-sm text-white/90 pt-2">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-brand-cyan" aria-hidden="true" />
                  <span className="font-semibold">{course.faculty}</span>
                </div>

                <div className="flex items-center gap-1 text-warning">
                  <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                  <span className="font-bold text-white">{course.rating.toFixed(1)}</span>
                  <span className="text-white/70">({course.popularity.toLocaleString()} students)</span>
                </div>

                {course.duration && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-brand-cyan" aria-hidden="true" />
                    <span>{course.duration}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Layout with Sticky Sidebar */}
        <PageContainer className="pt-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Sticky Enroll Card (Top on Mobile, Right on Desktop) */}
            <aside className="lg:col-span-1 lg:order-last" aria-label="Course Enrollment">
              <Card
                variant="elevated"
                className="sticky top-20 border-border bg-card p-6 space-y-6 shadow-lg"
              >
                {/* Price Display */}
                <div>
                  <p className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
                    Enrollment Fee
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-display font-extrabold text-foreground">
                      {course.price === 0 ? "Free" : `₹${course.price.toLocaleString()}`}
                    </span>
                    {course.price > 0 && (
                      <span className="text-body text-muted-foreground line-through">
                        ₹{(course.price * 2.5).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleEnroll}
                  leftIcon={<Sparkles className="h-5 w-5" aria-hidden="true" />}
                  className="font-bold shadow-md hover:shadow-brand"
                >
                  {course.price === 0 ? "Enroll for Free" : "Enroll Now"}
                </Button>

                {/* Course Inclusions List */}
                <div className="space-y-3 border-t border-border pt-5">
                  <p className="text-body-sm font-semibold text-foreground">
                    This course includes:
                  </p>
                  <ul className="space-y-2.5 text-body-sm text-muted-foreground">
                    {course.inclusions?.map((inclusion, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{inclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </aside>

            {/* Course Details (Left on Desktop) */}
            <div className="space-y-12 lg:col-span-2">
              {/* 1. Description Section */}
              <section className="space-y-3" aria-label="Course Description">
                <h2 className="text-h3 font-bold text-foreground">
                  Course Overview
                </h2>
                <p className="text-body leading-relaxed text-muted-foreground">
                  {course.description}
                </p>
              </section>

              {/* 2. Syllabus Accordion (Native <details>) */}
              <section className="space-y-4" aria-label="Course Syllabus">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-h3 font-bold text-foreground">
                      Course Curriculum
                    </h2>
                    <p className="text-caption text-muted-foreground">
                      {course.syllabus?.length || 0} modules • {totalLecturesCount} lectures total
                    </p>
                  </div>
                </div>

                <div className="space-y-3" id="syllabus-accordion">
                  {course.syllabus?.map((chapter, idx) => (
                    <details
                      key={idx}
                      className="group rounded-lg border border-border bg-card p-4 transition-colors open:border-brand-blue/40"
                    >
                      <summary className="flex cursor-pointer items-center justify-between text-body font-semibold text-foreground select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded">
                        <span className="pr-4">{chapter.title}</span>
                        <div className="flex items-center gap-2 text-caption text-muted-foreground shrink-0">
                          <span>{chapter.lectures.length} lectures</span>
                          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
                        </div>
                      </summary>

                      <div className="mt-3 space-y-2 border-t border-border pt-3">
                        {chapter.lectures.map((lecture, lIdx) => (
                          <div
                            key={lIdx}
                            className="flex items-center justify-between py-1.5 text-body-sm text-muted-foreground"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <PlayCircle className="h-4 w-4 text-brand-blue shrink-0" aria-hidden="true" />
                              <span className="truncate">{lecture.title}</span>
                            </div>
                            <span className="text-caption font-mono shrink-0">{lecture.duration}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              {/* 3. Faculty Block */}
              <section className="space-y-4" aria-label="Course Faculty">
                <h2 className="text-h3 font-bold text-foreground">
                  About the Instructor
                </h2>
                <Card variant="default" className="p-6">
                  <CardContent className="p-0 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue font-bold text-h3">
                      {course.faculty.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-h4 font-bold text-foreground">
                        {course.faculty}
                      </h3>
                      <p className="text-body-sm font-medium text-brand-blue">
                        {course.facultyTitle}
                      </p>
                      <p className="text-body-sm text-muted-foreground leading-relaxed pt-1">
                        {course.facultyBio}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* 4. Student Reviews Section */}
              <section className="space-y-4" aria-label="Student Reviews">
                <div className="flex items-center justify-between">
                  <h2 className="text-h3 font-bold text-foreground">
                    Student Feedback
                  </h2>
                  <div className="flex items-center gap-1.5 text-body-sm font-semibold">
                    <Star className="h-4 w-4 fill-current text-warning" aria-hidden="true" />
                    <span>{course.rating.toFixed(1)} / 5.0 rating</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {course.reviews?.map((review, idx) => (
                    <Card key={idx} variant="default" className="p-5 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground text-body-sm">
                            {review.name}
                          </span>
                          <div className="flex items-center text-warning">
                            {Array.from({ length: 5 }).map((_, sIdx) => (
                              <Star
                                key={sIdx}
                                className={cn(
                                  "h-3.5 w-3.5",
                                  sIdx < Math.floor(review.rating)
                                    ? "fill-current"
                                    : "text-muted-foreground/30"
                                )}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-body-sm text-muted-foreground leading-relaxed">
                          "{review.text}"
                        </p>
                      </div>

                      {review.date && (
                        <p className="text-caption text-muted-foreground/60 pt-2 border-t border-border">
                          {review.date}
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </PageContainer>
    </div>
  );
}
