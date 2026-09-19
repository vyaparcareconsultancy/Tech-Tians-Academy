"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, Calendar, Clock } from "lucide-react";

const BATCHES = [
  { id: "bth_01", name: "MERN Stack Bootcamp — Batch 04", course: "Full Stack Web Development", faculty: "Prof. Priya Verma", enrolled: "65 / 75", timing: "Mon, Wed, Fri 6-8 PM", status: "Ongoing" },
  { id: "bth_02", name: "Next.js 14 App Router Advanced — Batch 02", course: "Next.js Mastery", faculty: "Prof. Priya Verma", enrolled: "42 / 50", timing: "Tue, Thu 7-9 PM", status: "Ongoing" },
  { id: "bth_03", name: "DSA & Problem Solving — Batch 08", course: "DSA Foundation", faculty: "Kunal Mehra", enrolled: "90 / 100", timing: "Daily 8-9:30 AM", status: "Ongoing" },
  { id: "bth_04", name: "GenAI & Agent Engineering — Cohort 01", course: "AI Systems Bootcamp", faculty: "Dr. Aryan Sharma", enrolled: "25 / 40", timing: "Sat, Sun 10 AM-1 PM", status: "Upcoming" },
];

export default function BatchesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Cohort & Batches</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage live cohorts, student seat capacity, assigned faculty, and session schedules.
          </p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Create Cohort
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active & Upcoming Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch / Cohort</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Assigned Faculty</TableHead>
                <TableHead>Seat Capacity</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BATCHES.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-semibold text-slate-900 dark:text-white">{b.name}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">{b.course}</TableCell>
                  <TableCell>{b.faculty}</TableCell>
                  <TableCell className="font-mono text-xs">{b.enrolled}</TableCell>
                  <TableCell className="text-xs text-slate-500">{b.timing}</TableCell>
                  <TableCell>
                    <Badge variant={b.status === "Ongoing" ? "success" : "blue"}>{b.status}</Badge>
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
