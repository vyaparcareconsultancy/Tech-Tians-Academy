import * as React from "react";
import { Clock, User, Radio, Video } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { UpcomingClass } from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils";

export interface UpcomingClassItemProps {
  item: UpcomingClass;
}

export function UpcomingClassItem({ item }: UpcomingClassItemProps) {
  // Check if class starts within 30 minutes
  const startsInMs = new Date(item.startsAt).getTime() - Date.now();
  const startsWithin30Min = startsInMs <= 30 * 60 * 1000 && startsInMs >= -180 * 60 * 1000;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-brand-blue/30 sm:flex-row sm:items-center sm:justify-between">
      {/* Class Information */}
      <div className="space-y-1.5 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {startsWithin30Min ? (
            <Badge variant="danger" size="sm" className="gap-1 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Live / Starting Soon
            </Badge>
          ) : (
            <Badge variant="default" size="sm" className="gap-1">
              <Radio className="h-3 w-3 text-brand-blue" aria-hidden="true" />
              Scheduled
            </Badge>
          )}

          <span className="text-caption font-medium text-muted-foreground">
            {item.date} • {item.time}
          </span>
        </div>

        <h4 className="text-body font-semibold text-foreground line-clamp-1">
          {item.subject}
        </h4>

        <div className="flex flex-wrap items-center gap-4 text-caption text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-brand-blue" aria-hidden="true" />
            <span>{item.faculty}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            <span>{item.duration}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex shrink-0 items-center sm:self-center">
        <Button
          variant={startsWithin30Min ? "primary" : "outline"}
          size="sm"
          disabled={!startsWithin30Min}
          leftIcon={<Video className="h-3.5 w-3.5" aria-hidden="true" />}
          className={cn(
            !startsWithin30Min && "cursor-not-allowed opacity-60",
            "w-full sm:w-auto"
          )}
          aria-label={
            startsWithin30Min
              ? `Join live class: ${item.subject}`
              : `Join disabled. Class starts at ${item.time}`
          }
        >
          {startsWithin30Min ? "Join Class" : "Join (Locked)"}
        </Button>
      </div>
    </div>
  );
}
