"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";

const ORDERS = [
  { id: "ord_1001", student: "Aman Gupta", course: "MERN Stack Bootcamp", amount: "₹ 14,999", paymentMethod: "UPI (Razorpay)", date: "Today, 10:45 AM", status: "Success" },
  { id: "ord_1002", student: "Neha Sen", course: "DSA Foundation", amount: "₹ 11,999", paymentMethod: "NetBanking", date: "Yesterday, 3:20 PM", status: "Success" },
  { id: "ord_1003", student: "Rohan Verma", course: "Next.js 14 Masterclass", amount: "₹ 9,999", paymentMethod: "Credit Card", date: "18 Sep 2026", status: "Success" },
  { id: "ord_1004", student: "Pooja Das", course: "AI Bootcamp", amount: "₹ 19,999", paymentMethod: "UPI", date: "17 Sep 2026", status: "Refunded" },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Orders & Transactions</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Course purchases, Razorpay gateway receipts, invoices, and refunds.
          </p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
          Export Invoices
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ORDERS.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell className="font-semibold text-slate-900 dark:text-white">{o.student}</TableCell>
                  <TableCell>{o.course}</TableCell>
                  <TableCell className="font-semibold text-brand-blue">{o.amount}</TableCell>
                  <TableCell className="text-xs text-slate-500">{o.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge variant={o.status === "Success" ? "success" : "danger"}>{o.status}</Badge>
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
