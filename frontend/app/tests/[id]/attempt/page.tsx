"use client";

import * as React from "react";
import { useRouter, notFound } from "next/navigation";
import {
  Clock,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Send,
} from "lucide-react";
import { PageContainer } from "@/components/layout";
import {
  Card,
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
} from "@/components/ui";
import { QuestionPalette } from "@/components/tests";
import {
  getTestById,
  getTestQuestions,
  saveAttempt,
  Question,
  CompletedAttemptRecord,
} from "@/lib/mock/tests";
import { cn } from "@/lib/utils";

type QuestionStatus =
  | "not-visited"
  | "visited-unanswered"
  | "answered"
  | "marked-for-review"
  | "answered-and-marked";

interface AttemptState {
  answers: Record<string, string | number | null>;
  visited: Set<string>;
  markedForReview: Set<string>;
  currentIndex: number;
  secondsRemaining: number;
}

function getQuestionStatus(
  questionId: string,
  state: AttemptState
): QuestionStatus {
  const ans = state.answers[questionId];
  const hasAnswer = ans !== undefined && ans !== null && ans !== "";
  const isMarked = state.markedForReview.has(questionId);
  const isVisited = state.visited.has(questionId);

  if (hasAnswer && isMarked) return "answered-and-marked";
  if (isMarked) return "marked-for-review";
  if (hasAnswer) return "answered";
  if (isVisited) return "visited-unanswered";
  return "not-visited";
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const h = Math.floor(m / 60);
  if (h > 0) {
    const remM = m % 60;
    return `${h.toString().padStart(2, "0")}:${remM.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function TestAttemptPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const test = getTestById(params.id);

  if (!test) {
    notFound();
  }

  const questions = React.useMemo(
    () => getTestQuestions(test.id),
    [test.id]
  );

  // Single source of attempt state
  const [state, setState] = React.useState<AttemptState>(() => {
    const firstQId = questions[0]?.id;
    return {
      answers: {},
      visited: new Set<string>(firstQId ? [firstQId] : []),
      markedForReview: new Set<string>(),
      currentIndex: 0,
      secondsRemaining: (test.durationMinutes || 60) * 60,
    };
  });

  const [isSubmitModalOpen, setIsSubmitModalOpen] = React.useState(false);
  const stateRef = React.useRef(state);
  stateRef.current = state;
  const hasSubmittedRef = React.useRef(false);

  const currentQuestion: Question | undefined = questions[state.currentIndex];

  // Final submission handler
  const handleFinalSubmit = React.useCallback(() => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;

    const currentState = stateRef.current;
    let answered = 0;
    let unanswered = 0;
    let marked = 0;

    questions.forEach((q) => {
      const status = getQuestionStatus(q.id, currentState);
      if (status === "answered" || status === "answered-and-marked") {
        answered++;
      } else {
        unanswered++;
      }
      if (status === "marked-for-review" || status === "answered-and-marked") {
        marked++;
      }
    });

    const totalDuration = (test.durationMinutes || 60) * 60;
    const timeTakenSeconds = Math.max(0, totalDuration - currentState.secondsRemaining);

    const record: CompletedAttemptRecord = {
      testId: test.id,
      testTitle: test.title,
      answers: currentState.answers,
      timeTakenSeconds,
      submittedAt: new Date().toISOString(),
      totalQuestions: questions.length,
      answeredCount: answered,
      unansweredCount: unanswered,
      markedForReviewCount: marked,
    };

    saveAttempt(record);
    router.push(`/tests/${test.id}/result`);
  }, [test, questions, router]);

  // Countdown timer with auto-submit on 00:00
  React.useEffect(() => {
    const timer = setInterval(() => {
      setState((prev) => {
        if (prev.secondsRemaining <= 1) {
          clearInterval(timer);
          return { ...prev, secondsRemaining: 0 };
        }
        return { ...prev, secondsRemaining: prev.secondsRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Trigger submission when time reaches 0
  React.useEffect(() => {
    if (state.secondsRemaining === 0) {
      handleFinalSubmit();
    }
  }, [state.secondsRemaining, handleFinalSubmit]);

  // Handle MCQ selection
  const handleSelectOption = (optionIndex: number) => {
    setState((prev) => {
      const q = questions[prev.currentIndex];
      if (!q) return prev;
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [q.id]: optionIndex,
        },
      };
    });
  };

  // Handle Numerical input
  const handleNumericalChange = (value: string) => {
    setState((prev) => {
      const q = questions[prev.currentIndex];
      if (!q) return prev;
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [q.id]: value,
        },
      };
    });
  };

  // Clear answer
  const handleClearResponse = () => {
    setState((prev) => {
      const q = questions[prev.currentIndex];
      if (!q) return prev;
      const updatedAnswers = { ...prev.answers };
      delete updatedAnswers[q.id];
      return {
        ...prev,
        answers: updatedAnswers,
      };
    });
  };

  // Save & Next
  const handleSaveAndNext = () => {
    setState((prev) => {
      const currentQ = questions[prev.currentIndex];
      const nextIndex = Math.min(prev.currentIndex + 1, questions.length - 1);
      const nextQ = questions[nextIndex];

      const nextMarked = new Set(prev.markedForReview);
      if (currentQ) nextMarked.delete(currentQ.id);
      const nextVisited = new Set(prev.visited);
      if (nextQ) nextVisited.add(nextQ.id);

      return {
        ...prev,
        markedForReview: nextMarked,
        visited: nextVisited,
        currentIndex: nextIndex,
      };
    });
  };

  // Mark for Review & Next
  const handleMarkForReviewAndNext = () => {
    setState((prev) => {
      const currentQ = questions[prev.currentIndex];
      const nextIndex = Math.min(prev.currentIndex + 1, questions.length - 1);
      const nextQ = questions[nextIndex];

      const nextMarked = new Set(prev.markedForReview);
      if (currentQ) nextMarked.add(currentQ.id);
      const nextVisited = new Set(prev.visited);
      if (nextQ) nextVisited.add(nextQ.id);

      return {
        ...prev,
        markedForReview: nextMarked,
        visited: nextVisited,
        currentIndex: nextIndex,
      };
    });
  };

  // Previous
  const handlePrevious = () => {
    setState((prev) => {
      if (prev.currentIndex <= 0) return prev;
      const prevIndex = prev.currentIndex - 1;
      const prevQ = questions[prevIndex];

      const nextVisited = new Set(prev.visited);
      if (prevQ) nextVisited.add(prevQ.id);

      return {
        ...prev,
        visited: nextVisited,
        currentIndex: prevIndex,
      };
    });
  };

  // Jump to specific question from palette
  const handleJumpToQuestion = (index: number) => {
    const targetQ = questions[index];
    setState((prev) => {
      const nextVisited = new Set(prev.visited);
      if (targetQ) nextVisited.add(targetQ.id);

      return {
        ...prev,
        currentIndex: index,
        visited: nextVisited,
      };
    });
  };

  // Summary counts derived directly from state
  const counts = React.useMemo(() => {
    let answered = 0;
    let visitedUnanswered = 0;
    let notVisited = 0;
    let markedForReview = 0;
    let answeredAndMarked = 0;

    questions.forEach((q) => {
      const status = getQuestionStatus(q.id, state);
      if (status === "answered") answered++;
      else if (status === "visited-unanswered") visitedUnanswered++;
      else if (status === "not-visited") notVisited++;
      else if (status === "marked-for-review") markedForReview++;
      else if (status === "answered-and-marked") answeredAndMarked++;
    });

    return {
      answered,
      visitedUnanswered,
      notVisited,
      markedForReview,
      answeredAndMarked,
      totalAnswered: answered + answeredAndMarked,
      totalUnanswered: notVisited + visitedUnanswered + markedForReview,
      totalMarked: markedForReview + answeredAndMarked,
    };
  }, [questions, state]);

  const paletteItems = React.useMemo(() => {
    return questions.map((q) => {
      const status = getQuestionStatus(q.id, state);
      return {
        id: q.id,
        status,
        hasDot: status === "answered-and-marked",
      };
    });
  }, [questions, state]);

  const isLowTime = state.secondsRemaining <= 300; // less than 5 mins

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Sticky Test Bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur shadow-sm">
        <PageContainer className="flex items-center justify-between py-3">
          <div className="min-w-0 pr-4">
            <h1 className="text-body font-bold text-foreground truncate sm:text-h4">
              {test.title}
            </h1>
            <p className="text-caption text-muted-foreground truncate hidden sm:block">
              {test.subject} • {test.type}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Countdown Timer */}
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-body-sm transition-colors",
                isLowTime
                  ? "border-danger/40 bg-danger/10 text-danger font-bold animate-pulse"
                  : "border-border bg-muted/50 text-foreground"
              )}
            >
              <Clock className={cn("h-4 w-4", isLowTime ? "text-danger" : "text-brand-blue")} />
              <span>{formatTime(state.secondsRemaining)}</span>
            </div>

            {/* Submit Button */}
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsSubmitModalOpen(true)}
              leftIcon={<Send className="h-4 w-4" />}
            >
              Submit Test
            </Button>
          </div>
        </PageContainer>
      </header>

      {/* Main Assessment Layout */}
      <PageContainer className="py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Question & Interaction Pane */}
          <div className="lg:col-span-8 space-y-6">
            <Card variant="default" className="border-border bg-card p-6 shadow-sm min-h-[500px] flex flex-col justify-between">
              <div className="space-y-6">
                {/* Question Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-h4 font-bold text-foreground">
                      Question {state.currentIndex + 1}
                    </span>
                    <span className="text-body-sm text-muted-foreground">
                      of {questions.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="success" size="sm">
                      +{currentQuestion.marks} Correct
                    </Badge>
                    <Badge variant="danger" size="sm">
                      -{currentQuestion.negativeMarks ?? 1} Wrong
                    </Badge>
                  </div>
                </div>

                {/* Question Text */}
                <div className="text-body-lg text-foreground font-medium leading-relaxed">
                  {currentQuestion.question}
                </div>

                {/* Question Options or Numerical Input */}
                {currentQuestion.type === "numerical" ? (
                  <div className="space-y-3 pt-2">
                    <label className="text-body-sm font-medium text-muted-foreground block">
                      Enter your numerical response:
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 42"
                      value={state.answers[currentQuestion.id] ?? ""}
                      onChange={(e) => handleNumericalChange(e.target.value)}
                      className="w-full max-w-sm rounded-lg border border-border bg-background px-4 py-2.5 text-body text-foreground placeholder:text-muted-foreground focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    {currentQuestion.options?.map((option, idx) => {
                      const isSelected = state.answers[currentQuestion.id] === idx;
                      const optionLabel = String.fromCharCode(65 + idx);

                      return (
                        <button
                          key={idx}
                          type="button"
                          data-option-index={idx}
                          onClick={() => handleSelectOption(idx)}
                          className={cn(
                            "w-full text-left flex items-start gap-3.5 rounded-lg border p-4 transition-all",
                            isSelected
                              ? "border-brand-blue bg-brand-blue/10 text-foreground ring-1 ring-brand-blue shadow-sm"
                              : "border-border bg-card text-foreground hover:bg-muted/50"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-caption font-bold transition-colors mt-0.5",
                              isSelected
                                ? "border-brand-blue bg-brand-blue text-white"
                                : "border-border bg-muted/60 text-muted-foreground"
                            )}
                          >
                            {optionLabel}
                          </span>
                          <span className="text-body leading-relaxed pt-0.5">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 mt-8">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handlePrevious}
                    disabled={state.currentIndex === 0}
                    leftIcon={<ChevronLeft className="h-4 w-4" />}
                  >
                    Previous
                  </Button>

                  <Button
                    variant="ghost"
                    size="md"
                    onClick={handleClearResponse}
                    disabled={state.answers[currentQuestion.id] === undefined}
                    leftIcon={<RotateCcw className="h-4 w-4" />}
                  >
                    Clear Response
                  </Button>
                </div>

                <div className="flex items-center gap-2.5">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleMarkForReviewAndNext}
                    leftIcon={<Bookmark className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                    className="border-purple-300 dark:border-purple-800 hover:bg-purple-500/10 text-purple-700 dark:text-purple-300"
                  >
                    Mark for Review & Next
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSaveAndNext}
                    rightIcon={<ChevronRight className="h-4 w-4" />}
                  >
                    Save & Next
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Question Palette & Legend Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <QuestionPalette
              items={paletteItems}
              currentIndex={state.currentIndex}
              onSelectQuestion={handleJumpToQuestion}
              mode="attempt"
              counts={counts}
            />
          </div>
        </div>
      </PageContainer>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        size="md"
        title="Submit Assessment"
        description="Are you sure you want to conclude and submit your test? This action is irreversible."
      >
        <ModalBody className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-center">
              <p className="text-caption text-muted-foreground">Answered</p>
              <p className="text-h4 font-bold text-success mt-1">
                {counts.totalAnswered}
              </p>
            </div>

            <div className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-center">
              <p className="text-caption text-muted-foreground">Unanswered</p>
              <p className="text-h4 font-bold text-danger mt-1">
                {counts.totalUnanswered}
              </p>
            </div>

            <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-3 text-center">
              <p className="text-caption text-muted-foreground">Marked</p>
              <p className="text-h4 font-bold text-purple-600 dark:text-purple-400 mt-1">
                {counts.totalMarked}
              </p>
            </div>
          </div>

          <p className="text-caption text-muted-foreground bg-muted/40 p-3 rounded-md">
            Remaining time: <span className="font-mono font-bold text-foreground">{formatTime(state.secondsRemaining)}</span>. Once submitted, your score and detailed answer review will be computed immediately.
          </p>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setIsSubmitModalOpen(false)}
          >
            Resume Test
          </Button>
          <Button
            variant="danger"
            onClick={handleFinalSubmit}
            leftIcon={<Send className="h-4 w-4" />}
          >
            Confirm & Submit
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
