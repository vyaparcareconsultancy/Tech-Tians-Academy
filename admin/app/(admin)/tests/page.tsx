"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, CheckSquare } from "lucide-react";

const TESTS = [
  { id: "tst_1", title: "React State & Hooks Assessment", batch: "MERN Cohort 04", duration: "60 mins", questions: 30, submissions: 58, status: "Evaluated" },
  { id: "tst_2", title: "Next.js Server Actions & Caching Quiz", batch: "Next.js Mastery", duration: "45 mins", questions: 25, submissions: 39, status: "Grading Pending" },
  { id: "tst_3", title: "Binary Trees & Graph BFS/DFS Mock Test", batch: "DSA Foundation", duration: "90 mins", questions: 4, submissions: 82, status: "Scheduled" },
];

export default function TestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tests & Evaluations</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build coding challenges, MCQ quizzes, batch assessments, and auto-grade rubrics.
          </p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Create Test
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Batch Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Target Batch</TableHead>
                <TableHead>Duration & Qs</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TESTS.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-semibold text-slate-900 dark:text-white">{t.title}</TableCell>
                  <TableCell>{t.batch}</TableCell>
                  <TableCell className="text-xs text-slate-500">{t.duration} • {t.questions} Qs</TableCell>
                  <TableCell>{t.submissions} submitted</TableCell>
                  <TableCell>
                    <Badge variant={t.status === "Evaluated" ? "success" : t.status === "Grading Pending" ? "warning" : "blue"}>
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View Submissions</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
