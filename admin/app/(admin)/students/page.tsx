"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, UserPlus, Download } from "lucide-react";

const SAMPLE_STUDENTS = [
  { id: "std_01", name: "Rahul Sharma", email: "rahul.s@gmail.com", batch: "MERN Cohort 04", progress: "78%", status: "Active" },
  { id: "std_02", name: "Ananya Patel", email: "ananya.p@gmail.com", batch: "Next.js Mastery", progress: "92%", status: "Active" },
  { id: "std_03", name: "Vikas Reddy", email: "vikas.r@gmail.com", batch: "Data Science Cohort 02", progress: "45%", status: "At Risk" },
  { id: "std_04", name: "Sneha Nair", email: "sneha.n@gmail.com", batch: "DSA Foundation", progress: "88%", status: "Active" },
];

export default function StudentsPage() {
  const [search, setSearch] = React.useState("");

  const filtered = SAMPLE_STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.batch.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Students Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage enrolled learners, progress tracking, batch assignments, and performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button variant="primary" size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
            Add Student
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="w-72">
            <Input
              placeholder="Search by student or batch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <Badge variant="blue">{filtered.length} Enrolled</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Active Batch</TableHead>
                <TableHead>Course Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="font-semibold text-slate-900 dark:text-white">{student.name}</div>
                    <div className="text-xs text-slate-400">{student.email}</div>
                  </TableCell>
                  <TableCell>{student.batch}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-blue h-full rounded-full"
                          style={{ width: student.progress }}
                        />
                      </div>
                      <span className="text-xs font-semibold">{student.progress}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.status === "Active" ? "success" : "warning"}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View Profile
                    </Button>
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
