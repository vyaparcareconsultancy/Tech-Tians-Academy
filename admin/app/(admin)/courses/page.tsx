"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, BookOpen, Clock, Users } from "lucide-react";

const COURSES = [
  { id: "crs_1", title: "Full Stack Web Development (MERN)", students: 1240, duration: "16 Weeks", level: "Beginner to Advanced", price: "₹ 14,999", status: "Published" },
  { id: "crs_2", title: "Next.js 14 Production Masterclass", students: 820, duration: "8 Weeks", level: "Intermediate", price: "₹ 9,999", status: "Published" },
  { id: "crs_3", title: "Data Structures & Algorithms (Java/C++)", students: 2150, duration: "20 Weeks", level: "All Levels", price: "₹ 11,999", status: "Published" },
  { id: "crs_4", title: "AI & GenAI Agent Systems Bootcamp", students: 430, duration: "10 Weeks", level: "Advanced", price: "₹ 19,999", status: "Draft" },
];

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Curriculum & Courses</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage course catalog, pricing, lesson plans, and publication status.
          </p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Create New Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {COURSES.map((course) => (
          <Card key={course.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant={course.status === "Published" ? "success" : "warning"}>
                  {course.status}
                </Badge>
                <span className="font-bold text-brand-blue text-sm">{course.price}</span>
              </div>
              <CardTitle className="text-base sm:text-lg">{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-800 py-3">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{course.students} Learners</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{course.level}</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" size="sm">Edit Curriculum</Button>
                <Button variant="primary" size="sm">Manage Batches</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
