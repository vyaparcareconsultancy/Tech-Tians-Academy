import * as React from "react";
import Link from "next/link";
import { Star, Clock, BookOpen, User } from "lucide-react";
import { Card, CardContent, CardFooter, Badge, Button } from "@/components/ui";
import { CourseItem } from "@/lib/mock-data";

export interface CourseCardProps {
  course: CourseItem;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card variant="default" hoverable className="flex h-full flex-col overflow-hidden border-border bg-card">
      {/* Visual Thumbnail (Solid token gradient with pattern & badge) */}
      <div className="relative h-48 w-full bg-gradient-to-br from-brand-navy via-brand-navy-mid to-brand-blue flex items-center justify-center p-6 text-white overflow-hidden">
        {/* Subtle grid background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(var(--brand-cyan)_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

        <div className="relative z-10 text-center space-y-2">
          <span className="inline-block rounded-md bg-white/10 px-2.5 py-1 text-caption font-mono uppercase tracking-wider text-brand-cyan backdrop-blur-md border border-white/10">
            {course.category}
          </span>
          <p className="text-body font-bold text-white line-clamp-2 px-2">
            {course.title}
          </p>
        </div>

        {course.badge && (
          <div className="absolute left-3 top-3 z-10">
            <Badge variant="primary" size="sm" className="bg-brand-blue text-white shadow-sm">
              {course.badge}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col p-5 space-y-3">
        {/* Faculty & Rating */}
        <div className="flex items-center justify-between text-caption text-muted-foreground">
          <div className="flex items-center gap-1.5 truncate">
            <User className="h-3.5 w-3.5 text-brand-blue shrink-0" />
            <span className="truncate font-medium text-foreground">{course.faculty}</span>
          </div>
          <div className="flex items-center gap-1 text-warning shrink-0">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="font-semibold text-foreground">{course.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({course.reviewsCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-h4 font-bold tracking-tight text-foreground line-clamp-2 min-h-[3rem]">
          {course.title}
        </h3>

        {/* Duration & Lectures metadata */}
        <div className="flex items-center gap-4 text-caption text-muted-foreground pt-1 border-t border-border">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-brand-blue" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5 text-brand-cyan" />
            <span>{course.lecturesCount} Lectures</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-auto pt-3 flex items-baseline gap-2">
          <span className="text-h3 font-bold text-foreground">₹{course.price.toLocaleString()}</span>
          <span className="text-body-sm text-muted-foreground line-through">
            ₹{course.originalPrice.toLocaleString()}
          </span>
          <span className="text-caption font-semibold text-success">
            {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Link href={`/courses/${course.slug}`} className="w-full">
          <Button variant="primary" fullWidth size="md">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
