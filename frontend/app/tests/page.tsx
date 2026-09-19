"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  Award,
  Calendar,
  ArrowRight,
  PlayCircle,
  RotateCcw,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Card, CardContent, Badge, Button } from "@/components/ui";
import {
  MOCK_TESTS,
  TEST_SUBJECTS,
  TEST_TYPES,
  Test,
  TestStatus,
  TestType,
} from "@/lib/mock/tests";
import { cn } from "@/lib/utils";

const TABS: { id: TestStatus; label: string }[] = [
  { id: "available", label: "Available" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
];

export default function TestsPage() {
  const [activeTab, setActiveTab] = React.useState<TestStatus>("available");
  const [selectedSubject, setSelectedSubject] = React.useState<string>("all");
  const [selectedType, setSelectedType] = React.useState<TestType | "all">("all");

  const counts = React.useMemo(() => {
    return {
      available: MOCK_TESTS.filter((t) => t.status === "available").length,
      upcoming: MOCK_TESTS.filter((t) => t.status === "upcoming").length,
      completed: MOCK_TESTS.filter((t) => t.status === "completed").length,
    };
  }, []);

  const hasActiveFilters = selectedSubject !== "all" || selectedType !== "all";

  const handleResetFilters = () => {
    setSelectedSubject("all");
    setSelectedType("all");
  };

  const filteredTests = React.useMemo(() => {
    return MOCK_TESTS.filter((test) => {
      if (test.status !== activeTab) return false;
      if (selectedSubject !== "all" && test.subject !== selectedSubject) return false;
      if (selectedType !== "all" && test.type !== selectedType) return false;
      return true;
    });
  }, [activeTab, selectedSubject, selectedType]);

  return (
    <PageContainer className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-h2 font-bold tracking-tight text-foreground">
              Practice Tests & Assessments
            </h1>
            <p className="text-body-sm text-muted-foreground mt-1">
              Timed chapter quizzes, national mock exams, and in-depth performance analytics.
            </p>
          </div>

          {hasActiveFilters && (
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                leftIcon={<RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs & Filters Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Status Tabs (Plain buttons with useState) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Test status">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const count = counts[tab.id];

            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-body-sm font-medium transition-colors select-none",
                  isActive
                    ? "bg-brand-blue text-white shadow-sm font-semibold"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-caption font-mono leading-none",
                    isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Dropdowns (Native Selects) */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="subject-filter" className="text-caption font-medium text-muted-foreground flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-brand-blue" aria-hidden="true" />
              Subject:
            </label>
            <select
              id="subject-filter"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="rounded-md border border-border bg-card px-3 py-1.5 text-body-sm font-medium text-foreground shadow-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue cursor-pointer"
            >
              <option value="all">All Subjects</option>
              {TEST_SUBJECTS.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="type-filter" className="text-caption font-medium text-muted-foreground">
              Type:
            </label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as TestType | "all")}
              className="rounded-md border border-border bg-card px-3 py-1.5 text-body-sm font-medium text-foreground shadow-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue cursor-pointer"
            >
              <option value="all">All Types</option>
              {TEST_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredTests.length === 0 ? (
        <Card variant="bordered" className="border-dashed border-2 py-16 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <FileText className="h-7 w-7" aria-hidden="true" />
            </div>
            <div className="max-w-md space-y-1">
              <h3 className="text-h4 font-bold text-foreground">
                {activeTab === "available"
                  ? "No available tests"
                  : activeTab === "upcoming"
                  ? "No upcoming tests scheduled"
                  : "No completed tests found"}
              </h3>
              <p className="text-body-sm text-muted-foreground">
                {hasActiveFilters
                  ? "No tests match your current subject or type filters. Try adjusting or clearing your filters."
                  : activeTab === "available"
                  ? "You have completed all open tests. Check the upcoming tab for scheduled assessments."
                  : activeTab === "upcoming"
                  ? "Check back soon for newly published cohort simulations."
                  : "Start and submit an available test to review your results here."}
              </p>
            </div>
            {hasActiveFilters && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleResetFilters}
                leftIcon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}

function TestCard({ test }: { test: Test }) {
  return (
    <Card
      variant="default"
      className="flex h-full flex-col justify-between border-border bg-card p-5 space-y-4 hover:border-brand-blue/40 transition-all shadow-sm"
    >
      <div className="space-y-3">
        {/* Badges Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge
            variant="outline"
            size="sm"
            className="border-brand-blue/30 text-brand-blue"
          >
            {test.subject}
          </Badge>

          <Badge
            variant={
              test.type === "Full Syllabus"
                ? "primary"
                : test.type === "Mock Test"
                ? "info"
                : "default"
            }
            size="sm"
          >
            {test.type}
          </Badge>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-h4 font-bold tracking-tight text-foreground line-clamp-2 min-h-[3rem]">
            {test.title}
          </h3>
          {test.description && (
            <p className="text-caption text-muted-foreground line-clamp-2 mt-1">
              {test.description}
            </p>
          )}
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-caption text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-brand-blue shrink-0" aria-hidden="true" />
            <span className="truncate">{test.questionCount} Qs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-brand-blue shrink-0" aria-hidden="true" />
            <span className="truncate">{test.durationMinutes}m</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-brand-blue shrink-0" aria-hidden="true" />
            <span className="truncate">{test.totalMarks} Marks</span>
          </div>
        </div>
      </div>

      {/* Action Area by Status */}
      <div className="border-t border-border pt-3">
        {test.status === "available" && (
          <Link href={`/tests/${test.id}`} className="block w-full">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              leftIcon={<PlayCircle className="h-4 w-4" aria-hidden="true" />}
            >
              Start Test
            </Button>
          </Link>
        )}

        {test.status === "upcoming" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-md bg-muted/60 px-2.5 py-1.5 text-caption text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-brand-cyan shrink-0" aria-hidden="true" />
              <span className="truncate font-medium text-foreground">{test.scheduledDate}</span>
            </div>
            <Button variant="outline" size="sm" fullWidth disabled className="opacity-70 cursor-not-allowed">
              Scheduled
            </Button>
          </div>
        )}

        {test.status === "completed" && test.result && (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-caption">
              <div>
                <span className="text-muted-foreground">Score: </span>
                <span className="font-bold text-foreground text-body-sm">
                  {test.result.score}
                </span>
                <span className="text-muted-foreground">/{test.totalMarks}</span>
              </div>
              <Badge variant="success" size="sm" className="font-mono">
                {test.result.accuracyPercentage}% Acc
              </Badge>
            </div>

            <Link href={`/tests/${test.id}/result`} className="block w-full">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                rightIcon={<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
              >
                View Result
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
