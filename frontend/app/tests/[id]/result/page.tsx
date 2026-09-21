"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  Target,
  Trophy,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
  FileSearch,
  PlayCircle,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { PageContainer } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import {
  getTestById,
  getLatestAttempt,
  evaluateTestAttempt,
  DetailedEvaluation,
  getTestAnalytics,
} from "@/lib/mock/tests";

export default function TestResultPage({
  params,
}: {
  params: { id: string };
}) {
  const test = getTestById(params.id);

  if (!test) {
    notFound();
  }

  // Load attempt from store/localStorage
  const [evaluation, setEvaluation] = React.useState<DetailedEvaluation | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const attempt = getLatestAttempt(test.id);
    if (attempt) {
      setEvaluation(evaluateTestAttempt(test, attempt));
    }
    setLoaded(true);
  }, [test]);

  if (!loaded) {
    return (
      <PageContainer className="max-w-5xl py-12 text-center text-muted-foreground">
        Loading assessment results...
      </PageContainer>
    );
  }

  // Fallback: No attempt found
  if (!evaluation) {
    return (
      <PageContainer className="max-w-2xl py-16">
        <Card variant="default" className="border-border bg-card p-8 text-center space-y-6 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning/15 text-warning">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-h3 font-bold text-foreground">
              You haven&apos;t attempted this test
            </h1>
            <p className="text-body text-muted-foreground max-w-md mx-auto">
              No recorded submission was found for &ldquo;{test.title}&rdquo;. Take the assessment now to evaluate your knowledge, view your cohort rank, and get in-depth explanations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href={`/tests/${test.id}`} className="w-full sm:w-auto">
              <Button variant="primary" size="md" leftIcon={<PlayCircle className="h-4 w-4" />} fullWidth>
                Start Test Now
              </Button>
            </Link>
            <Link href="/tests" className="w-full sm:w-auto">
              <Button variant="outline" size="md" leftIcon={<ArrowLeft className="h-4 w-4" />} fullWidth>
                Back to Tests
              </Button>
            </Link>
          </div>
        </Card>
      </PageContainer>
    );
  }

  // Calculate breakdown percentages
  const correctPct = evaluation.totalQuestions > 0
    ? (evaluation.correctCount / evaluation.totalQuestions) * 100
    : 0;
  const wrongPct = evaluation.totalQuestions > 0
    ? (evaluation.wrongCount / evaluation.totalQuestions) * 100
    : 0;
  const unattemptedPct = evaluation.totalQuestions > 0
    ? (evaluation.unattemptedCount / evaluation.totalQuestions) * 100
    : 0;

  const scorePercentage = evaluation.totalMarks > 0
    ? Math.max(0, Math.round((evaluation.marksObtained / evaluation.totalMarks) * 100))
    : 0;

  const getPerformanceBadge = () => {
    if (scorePercentage >= 80) return { label: "Exceptional Mastery", variant: "success" as const };
    if (scorePercentage >= 60) return { label: "Good Performance", variant: "primary" as const };
    if (scorePercentage >= 40) return { label: "Passing Grade", variant: "warning" as const };
    return { label: "Needs Practice", variant: "danger" as const };
  };

  const perf = getPerformanceBadge();
  const analytics = getTestAnalytics(evaluation);

  return (
    <PageContainer className="max-w-5xl space-y-8 py-6">
      {/* Breadcrumb / Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/tests"
          className="inline-flex items-center gap-1.5 text-body-sm font-medium text-muted-foreground hover:text-brand-blue transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Tests</span>
        </Link>

        <Link href={`/tests/${test.id}/review`}>
          <Button variant="primary" size="md" leftIcon={<FileSearch className="h-4 w-4" />}>
            Review Answers
          </Button>
        </Link>
      </div>

      {/* Score Card Hero */}
      <Card variant="default" className="border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" size="sm" className="border-brand-blue/30 text-brand-blue">
                {test.subject}
              </Badge>
              <Badge variant={perf.variant} size="sm">
                {perf.label}
              </Badge>
            </div>
            <h1 className="text-h2 font-bold tracking-tight text-foreground sm:text-3xl">
              {test.title}
            </h1>
            <p className="text-caption text-muted-foreground">
              Submitted on {new Date(evaluation.attempt.submittedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="rounded-xl border border-brand-blue/30 bg-brand-blue/10 p-4 text-center sm:text-right shrink-0">
            <p className="text-caption font-semibold text-muted-foreground uppercase tracking-wider">
              Score Obtained
            </p>
            <div className="mt-1 flex items-baseline justify-center sm:justify-end gap-1.5">
              <span className="text-h1 font-black text-brand-blue sm:text-4xl">
                {evaluation.marksObtained}
              </span>
              <span className="text-body font-medium text-muted-foreground">
                / {evaluation.totalMarks}
              </span>
            </div>
            <p className="text-caption text-muted-foreground mt-0.5">
              {scorePercentage}% aggregate score
            </p>
          </div>
        </div>

        {/* Stat Tiles */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
              <Target className="h-5 w-5" />
            </div>
            <p className="text-caption text-muted-foreground">Accuracy</p>
            <p className="text-h3 font-bold text-foreground mt-1">
              {evaluation.accuracyPercentage}%
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {evaluation.correctCount} of {evaluation.attemptedCount} attempted
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-warning/15 text-warning">
              <Trophy className="h-5 w-5" />
            </div>
            <p className="text-caption text-muted-foreground">Cohort Rank</p>
            <p className="text-h3 font-bold text-foreground mt-1">
              #{evaluation.rank}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              out of {evaluation.totalCandidates} candidates
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="text-caption text-muted-foreground">Percentile</p>
            <p className="text-h3 font-bold text-foreground mt-1">
              {evaluation.percentile}%
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              better than cohort pool
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-success/15 text-success">
              <Clock className="h-5 w-5" />
            </div>
            <p className="text-caption text-muted-foreground">Time Spent</p>
            <p className="text-h3 font-bold text-foreground mt-1">
              {evaluation.timeSpentFormatted}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              limit: {evaluation.totalDurationFormatted}
            </p>
          </div>
        </div>
      </Card>

      {/* Breakdown: Horizontal Stacked Bar */}
      <Card variant="default" className="border-border bg-card p-6 space-y-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <h2 className="text-h4 font-bold text-foreground flex items-center gap-2">
            <Award className="h-5 w-5 text-brand-blue" />
            Question Breakdown
          </h2>
          <span className="text-caption text-muted-foreground font-mono">
            {evaluation.totalQuestions} Questions Total
          </span>
        </div>

        {/* Horizontal Stacked Bar (Pure CSS / Divs) */}
        <div className="space-y-3">
          <div className="h-5 w-full flex overflow-hidden rounded-full bg-muted/60 p-0.5 border border-border">
            {correctPct > 0 && (
              <div
                style={{ width: `${correctPct}%` }}
                className="bg-success h-full rounded-l-full transition-all duration-500"
                title={`Correct: ${evaluation.correctCount} (${Math.round(correctPct)}%)`}
              />
            )}
            {wrongPct > 0 && (
              <div
                style={{ width: `${wrongPct}%` }}
                className={`bg-danger h-full transition-all duration-500 ${correctPct === 0 ? "rounded-l-full" : ""} ${unattemptedPct === 0 ? "rounded-r-full" : ""}`}
                title={`Incorrect: ${evaluation.wrongCount} (${Math.round(wrongPct)}%)`}
              />
            )}
            {unattemptedPct > 0 && (
              <div
                style={{ width: `${unattemptedPct}%` }}
                className="bg-muted-foreground/30 h-full rounded-r-full transition-all duration-500"
                title={`Unattempted: ${evaluation.unattemptedCount} (${Math.round(unattemptedPct)}%)`}
              />
            )}
          </div>

          {/* Legend Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-body-sm pt-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-foreground font-semibold">
                {evaluation.correctCount} Correct
              </span>
              <span className="text-caption text-muted-foreground">
                ({Math.round(correctPct)}%)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-danger" />
              <span className="text-foreground font-semibold">
                {evaluation.wrongCount} Wrong
              </span>
              <span className="text-caption text-muted-foreground">
                ({Math.round(wrongPct)}%)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-semibold">
                {evaluation.unattemptedCount} Unattempted
              </span>
              <span className="text-caption text-muted-foreground">
                ({Math.round(unattemptedPct)}%)
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Analytics Charts */}
      <div className="space-y-6">
        <div className="border-b border-border pb-3">
          <h2 className="text-h4 font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-brand-blue" />
            Performance Analytics
          </h2>
          <p className="text-caption text-muted-foreground mt-0.5">
            Visual metrics across subject scores, chapter accuracy, and test improvement trajectory.
          </p>
        </div>

        {/* 2-Column Grid: Subject Scores & Chapter Accuracy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Subject-Wise Score */}
          <Card variant="default" className="border-border bg-card p-6 space-y-4 shadow-sm">
            <div className="border-b border-border pb-3">
              <h3 className="text-body font-bold text-foreground">
                Subject-Wise Score
              </h3>
              <p className="text-caption text-muted-foreground">
                Marks obtained vs max marks per subject
              </p>
            </div>

            <div className="w-full h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.subjectScores}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} opacity={0.5} />
                  <XAxis
                    dataKey="shortSubject"
                    stroke="#64748b"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    interval={0}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.5rem",
                      color: "#f8fafc",
                      fontSize: "0.875rem",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                    }}
                    itemStyle={{ color: "#e2e8f0" }}
                    labelStyle={{ color: "#94a3b8", fontWeight: 600, marginBottom: "0.25rem" }}
                    formatter={(value: any, name: any) => [
                      `${value} marks`,
                      name === "marksObtained" ? "Marks Obtained" : "Max Marks",
                    ]}
                    labelFormatter={(label: any, payload: any) => {
                      const item = payload?.[0]?.payload;
                      return item?.subject || label;
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={32}
                    formatter={(value) => (
                      <span className="text-caption text-muted-foreground">
                        {value === "marksObtained" ? "Marks Obtained" : "Max Marks"}
                      </span>
                    )}
                  />
                  <Bar
                    dataKey="marksObtained"
                    name="marksObtained"
                    fill="#2563EB"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="maxMarks"
                    name="maxMarks"
                    fill="#06B6D4"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* 2. Chapter-Wise Accuracy */}
          <Card variant="default" className="border-border bg-card p-6 space-y-4 shadow-sm">
            <div className="border-b border-border pb-3">
              <h3 className="text-body font-bold text-foreground">
                Chapter-Wise Accuracy
              </h3>
              <p className="text-caption text-muted-foreground">
                Accuracy percentage across evaluated topic chapters
              </p>
            </div>

            <div className="w-full h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.chapterAccuracy}
                  margin={{ top: 10, right: 10, left: -15, bottom: 25 }}
                >
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} opacity={0.5} />
                  <XAxis
                    dataKey="chapter"
                    stroke="#64748b"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tickFormatter={(v) => `${v}%`}
                    stroke="#64748b"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.5rem",
                      color: "#f8fafc",
                      fontSize: "0.875rem",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                    }}
                    itemStyle={{ color: "#e2e8f0" }}
                    labelStyle={{ color: "#94a3b8", fontWeight: 600, marginBottom: "0.25rem" }}
                    formatter={(value: any, _name: any, item: any) => [
                      `${value}% (${item?.payload?.correct || 0}/${item?.payload?.attempted || 0} correct)`,
                      "Accuracy",
                    ]}
                  />
                  <Bar
                    dataKey="accuracy"
                    name="Accuracy %"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* 3. Improvement Trend (Full Width) */}
        <Card variant="default" className="border-border bg-card p-6 space-y-4 shadow-sm">
          <div className="border-b border-border pb-3">
            <h3 className="text-body font-bold text-foreground">
              Improvement Trend
            </h3>
            <p className="text-caption text-muted-foreground">
              Score percentage progression across your last 6 attempted diagnostic tests
            </p>
          </div>

          <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analytics.trendHistory}
                margin={{ top: 10, right: 20, left: -15, bottom: 5 }}
              >
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} opacity={0.5} />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(v) => `${v}%`}
                  stroke="#64748b"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.5rem",
                    color: "#f8fafc",
                    fontSize: "0.875rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                  }}
                  itemStyle={{ color: "#e2e8f0" }}
                  labelStyle={{ color: "#94a3b8", fontWeight: 600, marginBottom: "0.25rem" }}
                  formatter={(value: any, _name: any, item: any) => [
                    `${value}% (${item?.payload?.score || 0}/${item?.payload?.totalMarks || 0} marks)`,
                    item?.payload?.testTitle || "Score",
                  ]}
                  labelFormatter={(label: any) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  name="Score %"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#2563EB", strokeWidth: 1.5, stroke: "#ffffff" }}
                  activeDot={{ r: 6, fill: "#06B6D4", stroke: "#ffffff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Subject-Wise Performance Table */}
      <Card variant="default" className="border-border bg-card p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-h4 font-bold text-foreground">
            Subject-Wise Performance
          </h2>
          <Badge variant="outline" size="sm">
            {evaluation.subjects.length} Sections
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead className="border-b border-border bg-muted/40 text-caption font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4 text-center">Attempted</th>
                <th className="py-3 px-4 text-center">Correct</th>
                <th className="py-3 px-4 text-center">Marks</th>
                <th className="py-3 px-4 text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {evaluation.subjects.map((s, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-foreground">
                    {s.subject}
                    <span className="block text-[11px] text-muted-foreground font-normal">
                      {s.totalQuestions} questions
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center text-foreground">
                    {s.attempted} / {s.totalQuestions}
                  </td>
                  <td className="py-3.5 px-4 text-center text-success font-semibold">
                    {s.correct}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-foreground">
                    {s.marks} / {s.maxMarks}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-caption font-bold ${
                        s.accuracyPercentage >= 75
                          ? "bg-success/15 text-success"
                          : s.accuracyPercentage >= 50
                          ? "bg-brand-blue/15 text-brand-blue"
                          : "bg-danger/15 text-danger"
                      }`}
                    >
                      {s.accuracyPercentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Link href="/tests" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" leftIcon={<ArrowLeft className="h-4 w-4" />} fullWidth>
            Back to Tests Catalog
          </Button>
        </Link>

        <Link href={`/tests/${test.id}/review`} className="w-full sm:w-auto">
          <Button variant="primary" size="lg" leftIcon={<FileSearch className="h-5 w-5" />} fullWidth>
            Review Detailed Solutions
          </Button>
        </Link>
      </div>
    </PageContainer>
  );
}
