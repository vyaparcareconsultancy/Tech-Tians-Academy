"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Users, Calendar, Video, Clock } from "lucide-react";

const MY_BATCHES = [
  {
    id: "mb_1",
    name: "Full Stack MERN Bootcamp — Cohort 04",
    course: "Web Development",
    students: 65,
    nextClass: "Today, 6:00 PM - 8:00 PM",
    topic: "React Query & Server Cache Optimization",
    status: "In Progress",
  },
  {
    id: "mb_2",
    name: "Next.js 14 App Router Advanced",
    course: "Frontend Architecture",
    students: 42,
    nextClass: "Tomorrow, 7:00 PM - 9:00 PM",
    topic: "Streaming SSR, Suspense & Parallel Routes",
    status: "In Progress",
  },
  {
    id: "mb_3",
    name: "System Design for Backend Engineers",
    course: "Architecture Series",
    students: 80,
    nextClass: "Saturday, 11:00 AM - 1:00 PM",
    topic: "Distributed Caching (Redis) & Rate Limiting",
    status: "Upcoming",
  },
];

export default function MyBatchesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Active Batches
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Assigned cohorts, upcoming live classes, lecture links, and student attendance.
          </p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Video className="w-4 h-4" />}>
          Start Live Class
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {MY_BATCHES.map((batch) => (
          <Card key={batch.id} className="hover:border-slate-300 dark:hover:border-slate-700">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div>
                <CardTitle className="text-base font-semibold">{batch.name}</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">{batch.course}</p>
              </div>
              <Badge variant={batch.status === "In Progress" ? "success" : "blue"}>
                {batch.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Enrolled Learners:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {batch.students} Students
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Next Live Session:</span>
                  <span className="font-semibold text-brand-blue">{batch.nextClass}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Topic / Agenda:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {batch.topic}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" size="sm">
                  View Roster
                </Button>
                <Button variant="secondary" size="sm">
                  Lecture Resources
                </Button>
                <Button variant="primary" size="sm">
                  Launch Classroom
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
