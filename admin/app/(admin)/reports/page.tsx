"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BarChart3, TrendingUp, Users, BookOpen } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Reports & Business Intelligence</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enrollment trajectory, completion metrics, learner drop-off points, and revenue forecast.
          </p>
        </div>
        <Button variant="outline" size="sm">Download Monthly PDF</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-600">Course Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">74.2%</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">+5.1% from last cohort</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-600">Avg. Doubt Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">2.4 hrs</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">-38 mins faster vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-600">Student Satisfaction (NPS)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">88 / 100</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">Top tier satisfaction</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
