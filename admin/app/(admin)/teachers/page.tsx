"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { UserPlus } from "lucide-react";

const TEACHERS = [
  { id: "tch_1", name: "Prof. Priya Verma", email: "priya.v@techtians.com", subject: "Full Stack & System Design", batches: 3, status: "Active" },
  { id: "tch_2", name: "Dr. Aryan Sharma", email: "aryan.s@techtians.com", subject: "Data Science & GenAI", batches: 2, status: "Active" },
  { id: "tch_3", name: "Kunal Mehra", email: "kunal.m@techtians.com", subject: "DSA & Algorithmic Thinking", batches: 4, status: "On Leave" },
];

export default function TeachersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Faculty & Teachers</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage instructional staff, subjects, assigned batches, and performance ratings.
          </p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
          Invite Faculty
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Instructors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Assigned Batches</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TEACHERS.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <div className="font-semibold text-slate-900 dark:text-white">{teacher.name}</div>
                    <div className="text-xs text-slate-400">{teacher.email}</div>
                  </TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>{teacher.batches} Batches</TableCell>
                  <TableCell>
                    <Badge variant={teacher.status === "Active" ? "success" : "warning"}>
                      {teacher.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Manage Batches</Button>
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
