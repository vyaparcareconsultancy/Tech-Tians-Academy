"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  Award,
  AlertTriangle,
  PlayCircle,
} from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import { QuestionPalette, PaletteItem } from "@/components/tests";
import {
  getTestById,
  getLatestAttempt,
  evaluateTestAttempt,
  DetailedEvaluation,
  EvaluatedQuestion,
} from "@/lib/mock/tests";
import { cn } from "@/lib/utils";

type FilterType = "all" | "correct" | "wrong" | "unattempted";

export default function TestReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const test = getTestById(params.id);

  if (!test) {
    notFound();
  }

  const [evaluation, setEvaluation] = React.useState<DetailedEvaluation | null>(null);
  const [loaded, setLoaded] = React.useState(false);
  const [filter, setFilter] = React.useState<FilterType>("all");

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
        Loading test review solutions...
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
              No Attempt Recorded
            </h1>
            <p className="text-body text-muted-foreground max-w-md mx-auto">
              You must take &ldquo;{test.title}&rdquo; first before reviewing its solutions and question explanations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href={`/tests/${test.id}`} className="w-full sm:w-auto">
              <Button variant="primary" size="md" leftIcon={<PlayCircle className="h-4 w-4" />} fullWidth>
                Start Assessment
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

  const { evaluatedQuestions, correctCount, wrongCount, unattemptedCount } = evaluation;

  // Filtered question list
  const filteredQuestions = evaluatedQuestions.filter((eq) => {
    if (filter === "correct") return eq.isCorrect;
    if (filter === "wrong") return eq.isAttempted && !eq.isCorrect;
    if (filter === "unattempted") return !eq.isAttempted;
    return true;
  });

  // Palette items mapped with outcome colors (correct = green, wrong = red, unattempted = grey)
  const paletteItems: PaletteItem[] = evaluatedQuestions.map((eq) => ({
    id: eq.question.id,
    label: eq.questionIndex + 1,
    status: eq.isCorrect ? "correct" : eq.isAttempted ? "wrong" : "unattempted",
  }));

  const handleScrollToQuestion = (index: number) => {
    // If the target question was filtered out, reset filter so it's rendered
    const targetEq = evaluatedQuestions[index];
    if (targetEq) {
      if (
        (filter === "correct" && !targetEq.isCorrect) ||
        (filter === "wrong" && (!targetEq.isAttempted || targetEq.isCorrect)) ||
        (filter === "unattempted" && targetEq.isAttempted)
      ) {
        setFilter("all");
      }
    }

    setTimeout(() => {
      const el = document.getElementById(`question-${index + 1}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 60);
  };

  return (
    <PageContainer className="max-w-6xl space-y-8 py-6">
      {/* Header & Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <Link
            href={`/tests/${test.id}/result`}
            className="inline-flex items-center gap-1.5 text-body-sm font-medium text-muted-foreground hover:text-brand-blue transition-colors mb-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Result Summary</span>
          </Link>
          <h1 className="text-h2 font-bold tracking-tight text-foreground sm:text-3xl">
            Detailed Solution &amp; Review
          </h1>
          <p className="text-body-sm text-muted-foreground">
            {test.title} • Score: {evaluation.marksObtained} / {evaluation.totalMarks} ({evaluation.accuracyPercentage}% Accuracy)
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-body-sm font-medium transition-colors",
              filter === "all"
                ? "bg-brand-blue text-white shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            All ({evaluatedQuestions.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter("correct")}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-body-sm font-medium transition-colors flex items-center gap-1.5",
              filter === "correct"
                ? "bg-success text-white shadow-sm"
                : "bg-success/10 text-success hover:bg-success/20"
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Correct ({correctCount})
          </button>

          <button
            type="button"
            onClick={() => setFilter("wrong")}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-body-sm font-medium transition-colors flex items-center gap-1.5",
              filter === "wrong"
                ? "bg-danger text-white shadow-sm"
                : "bg-danger/10 text-danger hover:bg-danger/20"
            )}
          >
            <XCircle className="h-3.5 w-3.5" />
            Wrong ({wrongCount})
          </button>

          <button
            type="button"
            onClick={() => setFilter("unattempted")}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-body-sm font-medium transition-colors flex items-center gap-1.5",
              filter === "unattempted"
                ? "bg-foreground text-background shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Unattempted ({unattemptedCount})
          </button>
        </div>
      </div>

      {/* Main Review Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Question Cards Column */}
        <div className="lg:col-span-8 space-y-6">
          {filteredQuestions.length === 0 ? (
            <Card variant="default" className="border-border bg-card p-8 text-center text-muted-foreground">
              No questions found under the selected &ldquo;{filter}&rdquo; filter.
            </Card>
          ) : (
            filteredQuestions.map((eq: EvaluatedQuestion) => {
              const q = eq.question;
              const qNumber = eq.questionIndex + 1;

              return (
                <Card
                  key={q.id}
                  id={`question-${qNumber}`}
                  variant="default"
                  className="border-border bg-card p-6 space-y-5 shadow-sm scroll-mt-24"
                >
                  {/* Card Header & Marks Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-h4 font-bold text-foreground">
                        Question {qNumber}
                      </span>
                      <Badge variant="outline" size="sm" className="text-caption">
                        {q.subject ?? test.subject}
                      </Badge>
                      <Badge variant="default" size="sm" className="capitalize text-caption">
                        {q.type ?? "mcq"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      {eq.isCorrect ? (
                        <Badge variant="success" size="md">
                          +{eq.marksAwarded} Marks
                        </Badge>
                      ) : eq.isAttempted ? (
                        <Badge variant="danger" size="md">
                          {eq.marksAwarded} Marks
                        </Badge>
                      ) : (
                        <Badge variant="outline" size="md">
                          0 Marks (Not Attempted)
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <p className="text-body-lg font-medium text-foreground leading-relaxed">
                    {q.question}
                  </p>

                  {/* Question Options or Numerical Review */}
                  {q.type === "numerical" ? (
                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Student Response */}
                        <div
                          className={cn(
                            "rounded-lg border p-4",
                            eq.isCorrect
                              ? "border-success/40 bg-success/10 text-foreground"
                              : eq.isAttempted
                              ? "border-danger/40 bg-danger/10 text-foreground"
                              : "border-border bg-muted/40 text-muted-foreground"
                          )}
                        >
                          <p className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
                            Your Response
                          </p>
                          <p className="text-h4 font-bold mt-1">
                            {eq.isAttempted ? String(eq.studentAnswer) : "Not Attempted"}
                          </p>
                        </div>

                        {/* Correct Answer */}
                        <div className="rounded-lg border border-success/40 bg-success/10 p-4">
                          <p className="text-caption font-semibold uppercase tracking-wider text-success">
                            Correct Answer
                          </p>
                          <p className="text-h4 font-bold text-success mt-1">
                            {String(q.correctAnswer)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 pt-1">
                      {q.options?.map((option, optIdx) => {
                        const isCorrectOption = Number(q.correctAnswer) === optIdx;
                        const isStudentPick = eq.isAttempted && Number(eq.studentAnswer) === optIdx;
                        const optionLabel = String.fromCharCode(65 + optIdx);

                        return (
                          <div
                            key={optIdx}
                            className={cn(
                              "flex items-start justify-between gap-3 rounded-lg border p-3.5 transition-all text-body-sm",
                              // Correct option (always highlighted green)
                              isCorrectOption &&
                                "border-success bg-success/15 text-foreground ring-1 ring-success",
                              // Student picked wrong option (highlighted red)
                              isStudentPick &&
                                !isCorrectOption &&
                                "border-danger bg-danger/15 text-foreground ring-1 ring-danger",
                              // Other neutral options
                              !isCorrectOption &&
                                !isStudentPick &&
                                "border-border bg-card/60 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <span
                                className={cn(
                                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-caption font-bold mt-0.5",
                                  isCorrectOption
                                    ? "border-success bg-success text-white"
                                    : isStudentPick
                                    ? "border-danger bg-danger text-white"
                                    : "border-border bg-muted/50 text-muted-foreground"
                                )}
                              >
                                {optionLabel}
                              </span>
                              <span
                                className={cn(
                                  "pt-0.5 leading-relaxed",
                                  isCorrectOption && "font-medium text-foreground",
                                  isStudentPick && !isCorrectOption && "font-medium text-danger"
                                )}
                              >
                                {option}
                              </span>
                            </div>

                            {/* Badge Indicator on Right */}
                            <div className="shrink-0 pt-0.5">
                              {isCorrectOption && isStudentPick && (
                                <Badge variant="success" size="sm">
                                  Your Choice (Correct)
                                </Badge>
                              )}
                              {isCorrectOption && !isStudentPick && (
                                <Badge variant="success" size="sm">
                                  Correct Answer
                                </Badge>
                              )}
                              {!isCorrectOption && isStudentPick && (
                                <Badge variant="danger" size="sm">
                                  Your Choice (Wrong)
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Explanation Block */}
                  {q.explanation && (
                    <div className="rounded-lg border border-brand-blue/30 bg-brand-blue/5 p-4 space-y-2 mt-4">
                      <div className="flex items-center gap-2 text-body-sm font-bold text-brand-blue">
                        <BookOpen className="h-4 w-4" />
                        <span>Concept &amp; Explanation</span>
                      </div>
                      <p className="text-body-sm text-foreground/90 leading-relaxed pl-6">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>

        {/* Jump-To-Question Palette Sidebar */}
        <div className="lg:col-span-4 sticky top-6 space-y-6">
          <QuestionPalette
            items={paletteItems}
            onSelectQuestion={handleScrollToQuestion}
            mode="review"
            title="Solution Navigator"
            counts={{
              correct: correctCount,
              wrong: wrongCount,
              unattempted: unattemptedCount,
            }}
          />

          {/* Return Links Card */}
          <Card variant="default" className="border-border bg-card p-5 space-y-3 shadow-sm">
            <h3 className="text-body font-bold text-foreground">
              Navigation
            </h3>
            <div className="space-y-2">
              <Link href={`/tests/${test.id}/result`} className="block">
                <Button variant="outline" size="md" fullWidth leftIcon={<Award className="h-4 w-4" />}>
                  Back to Scorecard
                </Button>
              </Link>
              <Link href="/tests" className="block">
                <Button variant="ghost" size="md" fullWidth leftIcon={<ArrowLeft className="h-4 w-4" />}>
                  Back to Tests
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
