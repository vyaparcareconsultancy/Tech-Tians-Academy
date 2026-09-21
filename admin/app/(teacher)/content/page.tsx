"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, FileText, Video, Code, Download } from "lucide-react";

const LECTURE_CONTENT = [
  { id: "cnt_1", title: "React 18 Concurrent Rendering Deep-Dive", type: "Video & Slides", batch: "MERN Cohort 04", duration: "1h 45m", date: "18 Sep 2026", views: 62 },
  { id: "cnt_2", title: "Hands-on Starter Code: Authentication Flow", type: "GitHub Repo", batch: "Next.js Mastery", duration: "Code Asset", date: "16 Sep 2026", views: 41 },
  { id: "cnt_3", title: "Homework: Implement Redis LRU Cache & Tests", type: "Assignment", batch: "Backend Cohort", duration: "3 Challenges", date: "15 Sep 2026", views: 78 },
];

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Course Content & Materials
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload class recordings, lecture slides, assignments, and boilerplate repositories.
          </p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Upload Material
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {LECTURE_CONTENT.map((content) => (
          <Card key={content.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="cyan">{content.type}</Badge>
                <span className="text-[11px] text-slate-400">{content.date}</span>
              </div>
              <CardTitle className="text-sm font-semibold mt-2">{content.title}</CardTitle>
              <p className="text-xs text-slate-500">{content.batch}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>{content.duration}</span>
                <span>{content.views} student views</span>
              </div>
              <div className="pt-2 flex justify-end">
                <Button variant="outline" size="sm" className="w-full">
                  Manage Asset
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
