import * as React from "react";
import Link from "next/link";
import { User, BookOpen, ArrowRight, Star, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, Badge, Button } from "@/components/ui";
import { Course } from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils";

export interface DashboardCourseCardProps {
  course: Course;
  href?: string;
}

export function CourseCard({ course, href }: DashboardCourseCardProps) {
  const targetHref = href || (course.batchId ? `/batches/${course.batchId}` : `/courses/${course.id}`);
  const buttonText = href || !course.batchId ? "View Course" : "View Batch";

  return (
    <Card
      variant="default"
      hoverable
      className="flex h-full flex-col overflow-hidden border-border bg-card transition-all"
    >
      {/* Thumbnail visual header */}
      <div
        className={cn(
          "relative h-36 w-full bg-gradient-to-br flex flex-col justify-between p-4 text-white overflow-hidden",
          course.thumbnailBg || "from-brand-navy via-brand-navy-mid to-brand-blue"
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(var(--brand-cyan)_1px,transparent_1px)] [background-size:14px_14px] opacity-15 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <Badge
            variant="default"
            size="sm"
            className="bg-black/40 text-brand-cyan border-white/10 backdrop-blur-md"
          >
            {course.category}
          </Badge>

          {course.progressPercentage !== undefined ? (
            <span className="text-caption font-semibold rounded-md bg-white/20 px-2 py-0.5 backdrop-blur-sm">
              {course.progressPercentage}%
            </span>
          ) : course.rating !== undefined ? (
            <span className="inline-flex items-center gap-1 text-caption font-semibold rounded-md bg-black/40 px-2 py-0.5 text-warning backdrop-blur-md border border-white/10">
              <Star className="h-3 w-3 fill-current" aria-hidden="true" />
              <span>{course.rating.toFixed(1)}</span>
            </span>
          ) : null}
        </div>

        <div className="relative z-10">
          <p className="text-body-sm font-bold text-white line-clamp-1">
            {course.title}
          </p>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col p-4 space-y-3">
        {/* Title & Faculty */}
        <div>
          <h3 className="text-body font-bold text-foreground line-clamp-2 min-h-[2.75rem]">
            {course.title}
          </h3>
          <div className="mt-2 flex items-center gap-1.5 text-caption text-muted-foreground">
            <User className="h-3.5 w-3.5 text-brand-blue shrink-0" aria-hidden="true" />
            <span className="font-medium text-foreground">{course.faculty}</span>
          </div>
        </div>

        {/* Course Price & Duration (for explore / catalog view) */}
        {course.price !== undefined && (
          <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
            <div className="flex items-baseline gap-1.5">
              <span className="text-h4 font-bold text-foreground">
                {course.price === 0 ? "Free" : `₹${course.price.toLocaleString()}`}
              </span>
            </div>
            {course.duration && (
              <div className="flex items-center gap-1 text-caption text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-brand-cyan" aria-hidden="true" />
                <span>{course.duration}</span>
              </div>
            )}
          </div>
        )}

        {/* Lectures Completed Status & Progress (if enrolled) */}
        {course.completedLectures !== undefined && course.totalLectures !== undefined && (
          <div className="space-y-1.5 pt-2 border-t border-border mt-auto">
            <div className="flex items-center justify-between text-caption font-medium">
              <span className="flex items-center gap-1 text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5 text-brand-blue" aria-hidden="true" />
                <span>{course.completedLectures} of {course.totalLectures} lectures completed</span>
              </span>
              <span className="text-brand-blue font-semibold">{course.progressPercentage}%</span>
            </div>

            <div
              className="h-2 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={course.progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${course.progressPercentage}% of lectures completed for ${course.title}`}
            >
              <div
                className="h-full rounded-full bg-brand-blue transition-all duration-300"
                style={{ width: `${course.progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={targetHref} className="w-full">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            rightIcon={<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            {buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
