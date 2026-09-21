import * as React from "react";
import Link from "next/link";
import { Play, Clock } from "lucide-react";
import { Card, CardContent, Button } from "@/components/ui";
import { Lecture } from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils";

export interface ContinueLearningCardProps {
  lecture: Lecture;
}

export function ContinueLearningCard({ lecture }: ContinueLearningCardProps) {
  return (
    <Card
      variant="default"
      hoverable
      className="flex flex-col overflow-hidden border-border bg-card transition-all"
    >
      {/* Thumbnail Banner */}
      <div
        className={cn(
          "relative h-32 w-full bg-gradient-to-br flex items-center justify-center overflow-hidden p-4 text-white",
          lecture.thumbnailBg || "from-brand-navy via-brand-navy-mid to-brand-blue"
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(var(--brand-cyan)_1px,transparent_1px)] [background-size:12px_12px] opacity-20 pointer-events-none" />
        
        {/* Play Icon Badge */}
        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 shadow-md">
          <Play className="h-5 w-5 fill-current ml-0.5" aria-hidden="true" />
        </div>

        {/* Duration Chip */}
        <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 text-caption font-medium text-white backdrop-blur-sm">
          <Clock className="h-3 w-3" aria-hidden="true" />
          <span>{lecture.duration}</span>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col p-4 space-y-3">
        <div>
          <p className="text-caption font-medium text-brand-blue line-clamp-1">
            {lecture.courseName}
          </p>
          <h3 className="text-body font-semibold text-foreground line-clamp-2 mt-0.5 min-h-[2.5rem]">
            {lecture.title}
          </h3>
        </div>

        {/* Progress Bar with Accessible ARIA */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-caption text-muted-foreground font-medium">
            <span>Progress</span>
            <span className="text-foreground">{lecture.progressPercentage}%</span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={lecture.progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${lecture.progressPercentage}% completed for ${lecture.title}`}
          >
            <div
              className="h-full rounded-full bg-brand-blue transition-all duration-300"
              style={{ width: `${lecture.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Resume Button */}
        <div className="pt-2 mt-auto">
          <Link href={`/lectures/${lecture.id}`} className="block w-full">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              leftIcon={<Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />}
            >
              Resume
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
