"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import {
  FileText,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Card, CardContent, Badge, Button } from "@/components/ui";
import { getTestById } from "@/lib/mock/tests";

export default function TestInstructionsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const test = getTestById(params.id);

  if (!test) {
    notFound();
  }

  const [agreed, setAgreed] = React.useState(false);

  const marksPerCorrect = test.marksPerCorrect ?? 4;
  const negativeMarks = test.negativeMarks ?? 1;

  const handleStartTest = () => {
    if (!agreed) return;
    router.push(`/tests/${test.id}/attempt`);
  };

  return (
    <PageContainer className="max-w-4xl space-y-8 py-6">
      {/* Back Link */}
      <div>
        <Link
          href="/tests"
          className="inline-flex items-center gap-1.5 text-body-sm font-medium text-muted-foreground hover:text-brand-blue transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Tests</span>
        </Link>
      </div>

      {/* Header Card */}
      <Card variant="default" className="border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-3 border-b border-border pb-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="outline" size="sm" className="border-brand-blue/30 text-brand-blue">
              {test.subject}
            </Badge>
            <Badge
              variant={test.type === "Full Syllabus" ? "primary" : test.type === "Mock Test" ? "info" : "default"}
              size="sm"
            >
              {test.type}
            </Badge>
          </div>

          <h1 className="text-h2 font-bold tracking-tight text-foreground sm:text-3xl">
            {test.title}
          </h1>

          {test.description && (
            <p className="text-body text-muted-foreground leading-relaxed">
              {test.description}
            </p>
          )}
        </div>

        {/* Test Parameters Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3.5 text-center">
            <p className="text-caption text-muted-foreground">Duration</p>
            <p className="text-h4 font-bold text-foreground mt-1 flex items-center justify-center gap-1.5">
              <Clock className="h-4 w-4 text-brand-blue" />
              {test.durationMinutes} mins
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3.5 text-center">
            <p className="text-caption text-muted-foreground">Total Questions</p>
            <p className="text-h4 font-bold text-foreground mt-1 flex items-center justify-center gap-1.5">
              <FileText className="h-4 w-4 text-brand-blue" />
              {test.questionCount}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3.5 text-center">
            <p className="text-caption text-muted-foreground">Total Marks</p>
            <p className="text-h4 font-bold text-foreground mt-1 flex items-center justify-center gap-1.5">
              <Award className="h-4 w-4 text-brand-blue" />
              {test.totalMarks}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3.5 text-center">
            <p className="text-caption text-muted-foreground">Format</p>
            <p className="text-body-sm font-bold text-foreground mt-1.5">
              MCQ + Numerical
            </p>
          </div>
        </div>
      </Card>

      {/* Marking Scheme */}
      <Card variant="default" className="border-border bg-card p-6 space-y-4 shadow-sm">
        <h2 className="text-h4 font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-brand-blue" />
          Marking Scheme
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
            <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
            <div>
              <p className="text-body font-bold text-foreground">+{marksPerCorrect} Marks</p>
              <p className="text-caption text-muted-foreground">Awarded for each correct answer</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/10 p-4">
            <XCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
            <div>
              <p className="text-body font-bold text-foreground">-{negativeMarks} Marks</p>
              <p className="text-caption text-muted-foreground">Deducted for each incorrect MCQ answer</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-4">
            <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-body font-bold text-foreground">0 Marks</p>
              <p className="text-caption text-muted-foreground">No negative marks for unattempted questions</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Examination Rules & Instructions */}
      <Card variant="default" className="border-border bg-card p-6 space-y-4 shadow-sm">
        <h2 className="text-h4 font-bold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Standard Examination Rules
        </h2>

        <ul className="space-y-3 text-body-sm text-muted-foreground pl-1">
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue shrink-0 mt-2" />
            <span>
              <strong className="text-foreground">Continuous Timer:</strong> The countdown timer in the top header starts immediately when you begin. It runs continuously and cannot be paused.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue shrink-0 mt-2" />
            <span>
              <strong className="text-foreground">Do Not Refresh:</strong> Navigating away, reloading the page, or closing the browser window may result in automatic submission.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue shrink-0 mt-2" />
            <span>
              <strong className="text-foreground">Auto-Submission:</strong> When the countdown timer reaches 00:00, your test will be automatically submitted with your currently selected answers.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue shrink-0 mt-2" />
            <span>
              <strong className="text-foreground">Question Palette:</strong> Use the palette on the right to navigate between questions. Questions marked for review with an answer will still be evaluated for final scoring.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue shrink-0 mt-2" />
            <span>
              <strong className="text-foreground">Review & Submit:</strong> You can review your response counts and submit early once you have completed all sections.
            </span>
          </li>
        </ul>
      </Card>

      {/* Declaration & Start Action */}
      <Card variant="default" className="border-border bg-card p-6 space-y-6 shadow-sm">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded border-border text-brand-blue focus:ring-brand-blue accent-brand-blue cursor-pointer"
          />
          <span className="text-body-sm text-foreground">
            I have read and understood all the instructions, guidelines, and marking criteria above. I agree to adhere strictly to the examination code of conduct.
          </span>
        </label>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-4">
          <Link href="/tests" className="w-full sm:w-auto">
            <Button variant="outline" fullWidth>
              Cancel
            </Button>
          </Link>

          <Button
            variant="primary"
            size="lg"
            onClick={handleStartTest}
            disabled={!agreed}
            leftIcon={<PlayCircle className="h-5 w-5" />}
            className="w-full sm:w-auto min-w-[200px]"
          >
            I am ready to begin
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}
