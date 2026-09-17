"use client";

import { PageHeader } from "@/components/layout";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "@/components/ui";
import { PlayCircle, Clock, BookOpen, Award } from "lucide-react";

export default function StudentDashboardPage() {
  const stats = [
    { label: "Enrolled Courses", value: "4", icon: BookOpen },
    { label: "Hours Learned", value: "38.5h", icon: Clock },
    { label: "Quizzes Completed", value: "12", icon: Award },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Student Dashboard"
        subtitle="Welcome back, Alex! Continue your learning path."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Student" },
          { label: "Dashboard" },
        ]}
        actions={
          <Button
            size="sm"
            leftIcon={<PlayCircle className="h-4 w-4" />}
            onClick={() => {}}
          >
            Resume Learning
          </Button>
        }
      />

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} variant="default">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>{s.label}</CardDescription>
                <div className="rounded-md bg-brand-blue/10 p-2 text-brand-blue">
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-h2 font-bold">{s.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Course Card */}
      <Card variant="bordered">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="success">In Progress</Badge>
            <span className="text-caption text-muted-foreground">Module 4 of 12</span>
          </div>
          <CardTitle className="mt-2">Next.js 14 Production Architecture & Design Systems</CardTitle>
          <CardDescription>
            Learn to build resilient layouts, token-based design systems, and typed API clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-caption font-medium">
              <span>Progress</span>
              <span>45%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[45%] rounded-full bg-brand-blue" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
