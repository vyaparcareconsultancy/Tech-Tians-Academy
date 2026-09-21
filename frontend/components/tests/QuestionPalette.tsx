"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, Badge } from "@/components/ui";

export type PaletteStatus =
  | "not-visited"
  | "visited-unanswered"
  | "answered"
  | "marked-for-review"
  | "answered-and-marked"
  | "correct"
  | "wrong"
  | "unattempted";

export interface PaletteItem {
  id: string;
  label?: string | number;
  status: PaletteStatus;
  hasDot?: boolean;
}

export interface QuestionPaletteProps {
  items: PaletteItem[];
  currentIndex?: number;
  onSelectQuestion: (index: number) => void;
  mode?: "attempt" | "review";
  title?: string;
  counts?: {
    answered?: number;
    visitedUnanswered?: number;
    notVisited?: number;
    markedForReview?: number;
    answeredAndMarked?: number;
    correct?: number;
    wrong?: number;
    unattempted?: number;
  };
  className?: string;
}

export function QuestionPalette({
  items,
  currentIndex,
  onSelectQuestion,
  mode = "attempt",
  title = "Question Palette",
  counts,
  className,
}: QuestionPaletteProps) {
  return (
    <Card variant="default" className={cn("border-border bg-card p-5 space-y-5 shadow-sm", className)}>
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 className="text-body font-bold text-foreground">
          {title}
        </h2>
        <Badge variant="outline" size="sm">
          {items.length} Questions
        </Badge>
      </div>

      {/* Palette Grid */}
      <div className="grid grid-cols-5 gap-2.5">
        {items.map((item, idx) => {
          const isCurrent = currentIndex === idx;
          const status = item.status;
          const label = item.label ?? idx + 1;

          return (
            <button
              key={item.id || idx}
              type="button"
              onClick={() => onSelectQuestion(idx)}
              className={cn(
                "relative flex h-10 w-full items-center justify-center rounded-lg border text-caption font-semibold transition-all focus:outline-none",
                isCurrent && "ring-2 ring-brand-blue ring-offset-2 ring-offset-background",
                // Attempt page statuses
                status === "not-visited" &&
                  "border-border bg-muted/40 text-muted-foreground hover:bg-muted/80",
                status === "visited-unanswered" &&
                  "border-danger/40 bg-danger/15 text-danger hover:bg-danger/25 font-bold",
                status === "answered" &&
                  "border-success/40 bg-success/20 text-success hover:bg-success/30 font-bold",
                status === "marked-for-review" &&
                  "border-purple-500/40 bg-purple-500/15 text-purple-600 dark:text-purple-400 hover:bg-purple-500/25",
                status === "answered-and-marked" &&
                  "border-purple-500/40 bg-purple-500/20 text-purple-600 dark:text-purple-400 hover:bg-purple-500/30 font-bold",
                // Review page outcome statuses
                status === "correct" &&
                  "border-success/40 bg-success/20 text-success hover:bg-success/30 font-bold",
                status === "wrong" &&
                  "border-danger/40 bg-danger/15 text-danger hover:bg-danger/25 font-bold",
                status === "unattempted" &&
                  "border-border bg-muted/40 text-muted-foreground hover:bg-muted/80"
              )}
              aria-label={`Question ${label}: ${status}`}
            >
              {label}

              {/* Indicator Dot */}
              {(item.hasDot || status === "answered-and-marked") && (
                <span
                  className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-success border border-card"
                  title="Answered & Marked for Review"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="border-t border-border pt-4 space-y-2.5">
        <p className="text-caption font-semibold text-muted-foreground uppercase tracking-wider">
          Legend
        </p>

        {mode === "review" ? (
          <div className="grid grid-cols-3 gap-2 text-caption">
            <div className="flex items-center gap-1.5">
              <span className="h-4 w-4 rounded border border-success/40 bg-success/20 text-success flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
              <span className="text-foreground truncate">
                Correct {counts?.correct !== undefined ? `(${counts.correct})` : ""}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="h-4 w-4 rounded border border-danger/40 bg-danger/15 text-danger flex items-center justify-center text-[10px] font-bold">
                ✕
              </span>
              <span className="text-foreground truncate">
                Wrong {counts?.wrong !== undefined ? `(${counts.wrong})` : ""}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="h-4 w-4 rounded border border-border bg-muted/40 text-muted-foreground flex items-center justify-center text-[10px]">
                -
              </span>
              <span className="text-foreground truncate">
                Skipped {counts?.unattempted !== undefined ? `(${counts.unattempted})` : ""}
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-caption">
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded border border-success/40 bg-success/20 text-success flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
              <span className="text-foreground">
                Answered {counts?.answered !== undefined ? `(${counts.answered})` : ""}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded border border-danger/40 bg-danger/15 text-danger flex items-center justify-center text-[10px] font-bold">
                ✕
              </span>
              <span className="text-foreground">
                Unanswered {counts?.visitedUnanswered !== undefined ? `(${counts.visitedUnanswered})` : ""}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded border border-purple-500/40 bg-purple-500/15 text-purple-600 flex items-center justify-center text-[10px] font-bold">
                ●
              </span>
              <span className="text-foreground">
                Review {counts?.markedForReview !== undefined ? `(${counts.markedForReview})` : ""}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="relative h-4 w-4 rounded border border-purple-500/40 bg-purple-500/20 text-purple-600 flex items-center justify-center text-[10px] font-bold">
                ●
                <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              <span className="text-foreground">
                Ans & Rev {counts?.answeredAndMarked !== undefined ? `(${counts.answeredAndMarked})` : ""}
              </span>
            </div>

            <div className="col-span-2 flex items-center gap-2 pt-1 border-t border-border">
              <span className="h-4 w-4 rounded border border-border bg-muted/40 text-muted-foreground flex items-center justify-center text-[10px]">
                -
              </span>
              <span className="text-foreground">
                Not Visited {counts?.notVisited !== undefined ? `(${counts.notVisited})` : ""}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
