"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit3,
  Save,
  X,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  Download,
  Receipt,
  ExternalLink,
} from "lucide-react";
import { PageContainer } from "@/components/layout";
import { CourseCard } from "@/components/dashboard";
import { Avatar, Badge, Button, Card, CardContent, Input } from "@/components/ui";
import { MOCK_STUDENT, MOCK_ENROLLED_COURSES, Student } from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [student, setStudent] = React.useState<Student>(MOCK_STUDENT);
  const [isEditing, setIsEditing] = React.useState(false);

  // Edit form state
  const [formData, setFormData] = React.useState({
    name: student.name,
    email: student.email,
    phone: student.phone || "",
  });

  const handleStartEdit = () => {
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Name and email cannot be empty.");
      return;
    }

    const updated = {
      ...student,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    };

    setStudent(updated);
    setIsEditing(false);
    console.log("Profile updated successfully:", updated);
  };

  return (
    <PageContainer className="space-y-10">
          {/* ============================================================== */}
          {/* 1. Header Card with Profile / Edit Mode Toggle                 */}
          {/* ============================================================== */}
          <Card variant="default" className="border-border bg-card p-6 sm:p-8 shadow-sm">
            {!isEditing ? (
              /* View Profile Mode */
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <Avatar
                    fallback={student.name}
                    size="lg"
                    className="h-20 w-20 text-h3 border-2 border-brand-blue/30 shadow-sm"
                  />
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h1 className="text-h2 font-bold tracking-tight text-foreground">
                        {student.name}
                      </h1>
                      <Badge variant="primary" size="sm">
                        Verified Student
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-body-sm text-muted-foreground pt-1">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-4 w-4 text-brand-blue" aria-hidden="true" />
                        <span>{student.email}</span>
                      </div>
                      {student.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-4 w-4 text-brand-cyan" aria-hidden="true" />
                          <span>{student.phone}</span>
                        </div>
                      )}
                      {student.joinedDate && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          <span>Member since {student.joinedDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleStartEdit}
                    leftIcon={<Edit3 className="h-4 w-4" aria-hidden="true" />}
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            ) : (
              /* Inline Edit Mode */
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      fallback={student.name}
                      size="md"
                      className="border border-brand-blue/30"
                    />
                    <div>
                      <h2 className="text-body font-bold text-foreground">
                        Edit Profile Information
                      </h2>
                      <p className="text-caption text-muted-foreground">
                        Update your personal contact details
                      </p>
                    </div>
                  </div>
                  <Badge variant="default" size="sm">
                    Editing Mode
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div>
                    <label className="block text-body-sm font-medium text-foreground mb-1.5">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Alex Johnson"
                    />
                  </div>

                  <div>
                    <label className="block text-body-sm font-medium text-foreground mb-1.5">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="alex@tians.academy"
                    />
                  </div>

                  <div>
                    <label className="block text-body-sm font-medium text-foreground mb-1.5">
                      Phone Number
                    </label>
                    <Input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    leftIcon={<X className="h-4 w-4" aria-hidden="true" />}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    leftIcon={<Save className="h-4 w-4" aria-hidden="true" />}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </Card>

          {/* ============================================================== */}
          {/* 2. Stats Strip                                                 */}
          {/* ============================================================== */}
          <section aria-label="Learning Summary Statistics">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Card variant="default" className="p-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-body-sm text-muted-foreground font-medium">
                      Enrolled Courses
                    </p>
                    <p className="text-h2 font-bold text-foreground">
                      {student.enrolledCoursesCount}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                    <BookOpen className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
              </Card>

              <Card variant="default" className="p-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-body-sm text-muted-foreground font-medium">
                      Completed Lectures
                    </p>
                    <p className="text-h2 font-bold text-foreground">
                      {student.totalCompletedLectures ?? 95}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
                    <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
              </Card>

              <Card variant="default" className="p-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-body-sm text-muted-foreground font-medium">
                      Hours Watched
                    </p>
                    <p className="text-h2 font-bold text-foreground">
                      {student.hoursWatched}h
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                    <Clock className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
              </Card>

              <Card variant="default" className="p-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-body-sm text-muted-foreground font-medium">
                      Certificates Earned
                    </p>
                    <p className="text-h2 font-bold text-foreground">
                      {student.certificatesEarned ?? 2}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                    <Award className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* ============================================================== */}
          {/* 3. Enrolled Courses (Reusing CourseCard linking to Batches)   */}
          {/* ============================================================== */}
          <section className="space-y-4" aria-label="Enrolled Courses">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-h3 font-bold text-foreground">
                  My Enrolled Courses
                </h2>
                <p className="text-caption text-muted-foreground">
                  Continue learning in your registered cohort batches
                </p>
              </div>
              <Badge variant="primary" size="sm">
                {MOCK_ENROLLED_COURSES.length} Active Tracks
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {MOCK_ENROLLED_COURSES.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>

          {/* ============================================================== */}
          {/* 4. Purchase History (Desktop Table / Mobile Cards)            */}
          {/* ============================================================== */}
          <section className="space-y-4" aria-label="Purchase History">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-brand-blue" aria-hidden="true" />
                <div>
                  <h2 className="text-h3 font-bold text-foreground">
                    Purchase & Billing History
                  </h2>
                  <p className="text-caption text-muted-foreground">
                    Invoices and transaction receipts for enrolled batches
                  </p>
                </div>
              </div>
              <span className="text-caption font-mono text-muted-foreground">
                {student.purchaseHistory?.length || 0} Transactions
              </span>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-xl border border-border bg-card overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-body-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Course Name</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {student.purchaseHistory?.map((record) => (
                    <tr key={record.id} className="transition hover:bg-muted/20">
                      <td className="py-4 px-4 font-mono font-medium text-foreground">
                        {record.orderId}
                      </td>
                      <td className="py-4 px-4 font-semibold text-foreground">
                        {record.courseName}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {record.date}
                      </td>
                      <td className="py-4 px-4 font-medium text-foreground">
                        {record.amount === 0 ? "Free" : `₹${record.amount.toLocaleString()}`}
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={record.status === "Completed" ? "success" : "default"}
                          size="sm"
                        >
                          {record.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <a
                          href={record.invoiceUrl}
                          download
                          className="inline-flex items-center gap-1 text-caption font-medium text-brand-blue hover:underline"
                        >
                          <Download className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>PDF</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards View */}
            <div className="block md:hidden space-y-3">
              {student.purchaseHistory?.map((record) => (
                <Card key={record.id} variant="default" className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-caption text-muted-foreground">
                      {record.orderId}
                    </span>
                    <Badge
                      variant={record.status === "Completed" ? "success" : "default"}
                      size="sm"
                    >
                      {record.status}
                    </Badge>
                  </div>

                  <p className="text-body-sm font-bold text-foreground">
                    {record.courseName}
                  </p>

                  <div className="flex items-center justify-between text-caption text-muted-foreground pt-1 border-t border-border">
                    <span>{record.date}</span>
                    <span className="font-bold text-foreground">
                      {record.amount === 0 ? "Free" : `₹${record.amount.toLocaleString()}`}
                    </span>
                    <a
                      href={record.invoiceUrl}
                      download
                      className="inline-flex items-center gap-1 font-medium text-brand-blue hover:underline"
                    >
                      <Download className="h-3 w-3" aria-hidden="true" />
                      <span>Invoice</span>
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </section>
    </PageContainer>
  );
}
