import * as React from "react";
import { Card, CardContent } from "@/components/ui";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-label="Loading student dashboard data">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 rounded-md bg-muted" />
        <div className="h-4 w-96 rounded-md bg-muted" />
      </div>

      {/* Stats Row Skeleton */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} variant="default">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="h-7 w-16 rounded bg-muted" />
              </div>
              <div className="h-12 w-12 rounded-xl bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Learning Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 rounded bg-muted" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} variant="default" className="overflow-hidden">
              <div className="h-32 w-full bg-muted" />
              <CardContent className="p-4 space-y-3">
                <div className="h-3 w-28 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-2 w-full rounded bg-muted" />
                <div className="h-8 w-full rounded bg-muted pt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Courses and Classes Skeleton */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="h-6 w-36 rounded bg-muted" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} variant="default" className="overflow-hidden">
                <div className="h-36 w-full bg-muted" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                  <div className="h-2 w-full rounded bg-muted" />
                  <div className="h-8 w-full rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-6 w-40 rounded bg-muted" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-lg border border-border bg-muted/40 p-4" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
