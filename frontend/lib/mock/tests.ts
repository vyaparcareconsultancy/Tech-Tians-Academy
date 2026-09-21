export type TestType = "Mock Test" | "Chapter Test" | "Full Syllabus";
export type TestStatus = "available" | "upcoming" | "completed";

export interface Question {
  id: string;
  question: string;
  subject?: string;
  chapter?: string;
  type?: "mcq" | "numerical";
  options?: string[];
  correctAnswer: number | string;
  explanation?: string;
  marks: number;
  negativeMarks?: number;
}

export interface TestResult {
  testId: string;
  score: number;
  totalMarks: number;
  accuracyPercentage: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  timeTaken: string;
  rank?: number;
  totalCandidates?: number;
  completedAt: string;
}

export interface TestAttempt {
  id: string;
  testId: string;
  studentId: string;
  startedAt: string;
  submittedAt?: string;
  answers: Record<string, string | number | null>;
  score?: number;
  passed?: boolean;
}

export interface CompletedAttemptRecord {
  testId: string;
  testTitle: string;
  answers: Record<string, string | number | null>;
  timeTakenSeconds: number;
  submittedAt: string;
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  markedForReviewCount: number;
}

export interface Test {
  id: string;
  title: string;
  subject: string;
  type: TestType;
  status: TestStatus;
  questionCount: number;
  durationMinutes: number;
  totalMarks: number;
  marksPerCorrect?: number;
  negativeMarks?: number;
  scheduledDate?: string;
  result?: TestResult;
  description?: string;
  questions?: Question[];
}

export const TEST_TYPES: TestType[] = ["Mock Test", "Chapter Test", "Full Syllabus"];

export const TEST_SUBJECTS = [
  "App Router & Fullstack Architecture",
  "Design Systems & Token Architecture",
  "Data Structures & Algorithms",
  "Cloud Infrastructure & DevOps",
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: "q-1",
    question: "In Next.js 14 App Router, which file convention is used to wrap a route segment and its children in a shared stateful wrapper without re-rendering the shell upon child navigation?",
    subject: "App Router & Fullstack Architecture",
    chapter: "Layouts & Routing",
    type: "mcq",
    options: ["template.tsx", "layout.tsx", "loading.tsx", "default.tsx"],
    correctAnswer: 1,
    explanation: "layout.tsx preserves state and remains mounted across route segment transitions.",
    marks: 4,
    negativeMarks: 1,
  },
  {
    id: "q-2",
    question: "When invoking a Server Action marked with 'use server' from an interactive Client Component, how is the request transmitted under the hood?",
    subject: "App Router & Fullstack Architecture",
    chapter: "Server Actions",
    type: "mcq",
    options: [
      "Via an HTTP POST request carrying serialized action ID and arguments",
      "By compiling the server code directly into the client bundle",
      "Through a synchronous WebSocket event pipe",
      "It requires manual binding inside a custom pages/api endpoint"
    ],
    correctAnswer: 0,
    explanation: "Next.js invokes Server Actions via an encrypted HTTP POST with action metadata in the headers.",
    marks: 4,
    negativeMarks: 1,
  },
  {
    id: "q-3",
    question: "Which hook should be wrapped inside a React <Suspense> boundary in Next.js App Router to avoid de-opting the entire route to client-side rendering during static site generation?",
    subject: "App Router & Fullstack Architecture",
    chapter: "Streaming & Suspense",
    type: "mcq",
    options: ["useSearchParams()", "usePathname()", "useParams()", "useRouter()"],
    correctAnswer: 0,
    explanation: "useSearchParams() reads dynamic query strings which can bail out static generation if not wrapped in Suspense.",
    marks: 4,
    negativeMarks: 1,
  },
  {
    id: "q-4",
    question: "Given a complete binary tree with 15 nodes, what is the height of the tree (measured as the number of edges on the longest path from root to leaf)?",
    subject: "Data Structures & Algorithms",
    chapter: "Binary Trees",
    type: "numerical",
    correctAnswer: "3",
    explanation: "A complete binary tree with N=15 nodes has floor(log2(15)) = 3 edges from root to leaf.",
    marks: 4,
    negativeMarks: 0,
  },
  {
    id: "q-5",
    question: "In React 18 Server Components, what is the role of the 'server-only' package when imported into a data-fetching module?",
    subject: "App Router & Fullstack Architecture",
    chapter: "RSC Boundaries",
    type: "mcq",
    options: [
      "Throws a build-time error if the module is inadvertently imported into a Client Component",
      "Executes the module inside an isolated worker thread on the client",
      "Automatically adds CORS headers to database queries",
      "Disables React hydration warnings in development"
    ],
    correctAnswer: 0,
    explanation: "'server-only' ensures sensitive server code (like API keys or DB connections) is never leaked to client bundles.",
    marks: 4,
    negativeMarks: 1,
  },
  {
    id: "q-6",
    question: "In a Redis cluster configured with 3 master shards and 1 replica per master, how many total Redis nodes are running across the cluster?",
    subject: "Cloud Infrastructure & DevOps",
    chapter: "Redis Caching",
    type: "numerical",
    correctAnswer: "6",
    explanation: "3 masters + 3 replicas = 6 total Redis instances.",
    marks: 4,
    negativeMarks: 0,
  },
  {
    id: "q-7",
    question: "Which HTTP Cache-Control directive instructs browsers and shared caches that they MUST revalidate cached responses with the origin server before serving stale content?",
    subject: "Cloud Infrastructure & DevOps",
    chapter: "HTTP Caching",
    type: "mcq",
    options: ["no-cache", "no-store", "immutable", "max-age=86400"],
    correctAnswer: 0,
    explanation: "'no-cache' allows storing the response but forces revalidation with the server before every use.",
    marks: 4,
    negativeMarks: 1,
  },
  {
    id: "q-8",
    question: "What is the worst-case time complexity of searching for an element in a balanced Red-Black Tree containing N elements?",
    subject: "Data Structures & Algorithms",
    chapter: "Balanced Trees",
    type: "mcq",
    options: ["O(log N)", "O(N)", "O(1)", "O(N log N)"],
    correctAnswer: 0,
    explanation: "Red-Black trees maintain a maximum height of 2 * log2(N+1), ensuring O(log N) worst-case search.",
    marks: 4,
    negativeMarks: 1,
  },
  {
    id: "q-9",
    question: "In standard IPv4 Classless Inter-Domain Routing (CIDR), how many usable host IP addresses are available in a /28 subnet?",
    subject: "Cloud Infrastructure & DevOps",
    chapter: "Networking & CIDR",
    type: "numerical",
    correctAnswer: "14",
    explanation: "A /28 subnet has 32 - 28 = 4 host bits. 2^4 - 2 (network & broadcast) = 14 usable hosts.",
    marks: 4,
    negativeMarks: 0,
  },
  {
    id: "q-10",
    question: "Which Tailwind CSS custom utility class in this design system provides an elevated brand-tinted drop shadow for interactive cards?",
    subject: "Design Systems & Token Architecture",
    chapter: "Design Tokens",
    type: "mcq",
    options: ["shadow-brand", "shadow-xl", "elevation-glow", "shadow-2xl"],
    correctAnswer: 0,
    explanation: "shadow-brand is mapped in tailwind.config.ts for brand-tinted elevation highlights.",
    marks: 4,
    negativeMarks: 1,
  },
];

export const MOCK_TESTS: Test[] = [
  // -----------------------------------------------------------------
  // 1. Available Tests
  // -----------------------------------------------------------------
  {
    id: "test-1",
    title: "Next.js 14 App Router & Server Actions Diagnostic",
    subject: "App Router & Fullstack Architecture",
    type: "Chapter Test",
    status: "available",
    questionCount: 10,
    durationMinutes: 45,
    totalMarks: 40,
    marksPerCorrect: 4,
    negativeMarks: 1,
    description: "Evaluates deep knowledge of RSC boundaries, parallel routes, and optimistic mutations.",
    questions: MOCK_QUESTIONS,
  },
  {
    id: "test-2",
    title: "Fullstack Architecture Grand Engineering Simulation 1",
    subject: "App Router & Fullstack Architecture",
    type: "Full Syllabus",
    status: "available",
    questionCount: 10,
    durationMinutes: 120,
    totalMarks: 40,
    marksPerCorrect: 4,
    negativeMarks: 1,
    description: "Comprehensive multi-tier simulation covering networking, client caching, and server concurrency.",
    questions: MOCK_QUESTIONS,
  },
  {
    id: "test-3",
    title: "Binary Trees, Graphs & Dynamic Programming Sprint",
    subject: "Data Structures & Algorithms",
    type: "Chapter Test",
    status: "available",
    questionCount: 10,
    durationMinutes: 60,
    totalMarks: 40,
    marksPerCorrect: 4,
    negativeMarks: 1,
    description: "Fast-paced algorithmic challenge focusing on DFS/BFS traversals, memoization, and interval scheduling.",
    questions: MOCK_QUESTIONS,
  },
  {
    id: "test-4",
    title: "Distributed Caching & Redis Clustering Arena",
    subject: "Cloud Infrastructure & DevOps",
    type: "Mock Test",
    status: "available",
    questionCount: 10,
    durationMinutes: 75,
    totalMarks: 40,
    marksPerCorrect: 4,
    negativeMarks: 1,
    description: "Scenario-based exam on cache invalidation strategies, write-through patterns, and pub/sub pipelines.",
    questions: MOCK_QUESTIONS,
  },

  // -----------------------------------------------------------------
  // 2. Upcoming Tests
  // -----------------------------------------------------------------
  {
    id: "test-5",
    title: "All-India Engineering Scholarship Mock Test",
    subject: "App Router & Fullstack Architecture",
    type: "Mock Test",
    status: "upcoming",
    questionCount: 75,
    durationMinutes: 150,
    totalMarks: 300,
    marksPerCorrect: 4,
    negativeMarks: 1,
    scheduledDate: "September 24, 2026 • 10:00 AM IST",
    description: "Nationwide competitive evaluation with real-time all-India rank percentiles and cohort fee waivers.",
  },
  {
    id: "test-6",
    title: "Design Systems, Tokens & Accessibility Evaluation",
    subject: "Design Systems & Token Architecture",
    type: "Chapter Test",
    status: "upcoming",
    questionCount: 30,
    durationMinutes: 45,
    totalMarks: 90,
    marksPerCorrect: 3,
    negativeMarks: 1,
    scheduledDate: "September 26, 2026 • 02:30 PM IST",
    description: "Assesses WCAG 2.1 AA standards, polymorphic component design, and fluid typographic tokens.",
  },
  {
    id: "test-7",
    title: "Database Indexing & PostgreSQL Query Optimization",
    subject: "Cloud Infrastructure & DevOps",
    type: "Chapter Test",
    status: "upcoming",
    questionCount: 35,
    durationMinutes: 60,
    totalMarks: 140,
    marksPerCorrect: 4,
    negativeMarks: 1,
    scheduledDate: "September 28, 2026 • 11:00 AM IST",
    description: "Practical query plan analysis, B-tree vs GIN indexes, vacuum tuning, and isolation levels.",
  },
  {
    id: "test-8",
    title: "Mid-Term Grand Mock: System Design & DSA",
    subject: "Data Structures & Algorithms",
    type: "Full Syllabus",
    status: "upcoming",
    questionCount: 80,
    durationMinutes: 180,
    totalMarks: 320,
    marksPerCorrect: 4,
    negativeMarks: 1,
    scheduledDate: "October 02, 2026 • 09:00 AM IST",
    description: "Half-yearly benchmark exam covering end-to-end distributed system concepts and advanced data structures.",
  },

  // -----------------------------------------------------------------
  // 3. Completed Tests
  // -----------------------------------------------------------------
  {
    id: "test-9",
    title: "TypeScript 5.0 Strict Generics & Type Gymnastics",
    subject: "App Router & Fullstack Architecture",
    type: "Chapter Test",
    status: "completed",
    questionCount: 20,
    durationMinutes: 30,
    totalMarks: 80,
    marksPerCorrect: 4,
    negativeMarks: 1,
    description: "Evaluated template literal types, conditional types, and recursive infer operations.",
    result: {
      testId: "test-9",
      score: 72,
      totalMarks: 80,
      accuracyPercentage: 90,
      correctCount: 18,
      incorrectCount: 2,
      unattemptedCount: 0,
      timeTaken: "24m 10s",
      rank: 14,
      totalCandidates: 840,
      completedAt: "September 15, 2026",
    },
  },
  {
    id: "test-10",
    title: "Foundations of Asymptotic Complexity & Sorting",
    subject: "Data Structures & Algorithms",
    type: "Chapter Test",
    status: "completed",
    questionCount: 25,
    durationMinutes: 40,
    totalMarks: 100,
    marksPerCorrect: 4,
    negativeMarks: 1,
    description: "Covered master theorem, quicksort partitioning, and heap invariant maintenance.",
    result: {
      testId: "test-10",
      score: 84,
      totalMarks: 100,
      accuracyPercentage: 84,
      correctCount: 21,
      incorrectCount: 3,
      unattemptedCount: 1,
      timeTaken: "33m 45s",
      rank: 42,
      totalCandidates: 1200,
      completedAt: "September 10, 2026",
    },
  },
  {
    id: "test-11",
    title: "National Level Pre-Assessment Grand Mock",
    subject: "App Router & Fullstack Architecture",
    type: "Full Syllabus",
    status: "completed",
    questionCount: 90,
    durationMinutes: 180,
    totalMarks: 360,
    marksPerCorrect: 4,
    negativeMarks: 1,
    description: "Diagnostic simulation for competitive software engineering entrance examination.",
    result: {
      testId: "test-11",
      score: 310,
      totalMarks: 360,
      accuracyPercentage: 86,
      correctCount: 79,
      incorrectCount: 8,
      unattemptedCount: 3,
      timeTaken: "162m 15s",
      rank: 28,
      totalCandidates: 3450,
      completedAt: "August 28, 2026",
    },
  },
];

// Single source of truth for completed attempts
const ATTEMPTS_STORE = new Map<string, CompletedAttemptRecord>();

export function saveAttempt(attempt: CompletedAttemptRecord): void {
  ATTEMPTS_STORE.set(attempt.testId, attempt);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`test_attempt_${attempt.testId}`, JSON.stringify(attempt));
    } catch {
      // Ignore storage errors
    }
  }
}

export function getLatestAttempt(testId: string): CompletedAttemptRecord | undefined {
  if (ATTEMPTS_STORE.has(testId)) {
    return ATTEMPTS_STORE.get(testId);
  }
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`test_attempt_${testId}`);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore storage errors
    }
  }
  return undefined;
}

export function getTestById(id: string): Test | undefined {
  return MOCK_TESTS.find((t) => t.id === id);
}

export function getTestQuestions(testId: string): Question[] {
  const test = getTestById(testId);
  return test?.questions && test.questions.length > 0 ? test.questions : MOCK_QUESTIONS;
}

// Alias for getLatestAttempt
export const getAttempt = getLatestAttempt;

// Fixed mock cohort scores across a sample of candidates to derive deterministic ranks and percentiles
export const MOCK_COHORT_SCORES: number[] = [
  40, 40, 39, 38, 37, 36, 36, 35, 34, 33, 32, 32, 31, 30, 29, 28, 27, 26, 25, 24,
  23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 8, 6, 4, 0, -2, -4
];

export function getCohortRankAndPercentile(
  score: number,
  totalMarks: number = 40
): { rank: number; totalCandidates: number; percentile: number } {
  const totalCandidates = 450;
  const scaledScores = MOCK_COHORT_SCORES.map((s) =>
    Math.round((s / 40) * totalMarks)
  );

  // How many cohort members scored strictly higher than the student
  const higherScoresCount = scaledScores.filter((s) => s > score).length;
  const rank = Math.max(1, Math.round((higherScoresCount / scaledScores.length) * totalCandidates) + 1);

  // Percentile: percentage of cohort scoring less than or equal to student
  const lowerOrEqualCount = scaledScores.filter((s) => s <= score).length;
  const percentile = Math.min(
    99.9,
    Math.max(1.0, Math.round((lowerOrEqualCount / scaledScores.length) * 1000) / 10)
  );

  return {
    rank,
    totalCandidates,
    percentile,
  };
}

export interface EvaluatedQuestion {
  question: Question;
  questionIndex: number;
  studentAnswer: string | number | null;
  isAttempted: boolean;
  isCorrect: boolean;
  marksAwarded: number;
}

export interface SubjectBreakdown {
  subject: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  unattempted: number;
  marks: number;
  maxMarks: number;
  accuracyPercentage: number;
}

export interface DetailedEvaluation {
  test: Test;
  attempt: CompletedAttemptRecord;
  evaluatedQuestions: EvaluatedQuestion[];
  totalQuestions: number;
  attemptedCount: number;
  unattemptedCount: number;
  correctCount: number;
  wrongCount: number;
  marksObtained: number;
  totalMarks: number;
  accuracyPercentage: number;
  rank: number;
  totalCandidates: number;
  percentile: number;
  timeSpentSeconds: number;
  timeSpentFormatted: string;
  totalDurationSeconds: number;
  totalDurationFormatted: string;
  subjects: SubjectBreakdown[];
}

export function formatTimeSpan(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const h = Math.floor(m / 60);
  if (h > 0) {
    const remM = m % 60;
    return `${h}h ${remM}m ${s}s`;
  }
  return `${m}m ${s}s`;
}

export function evaluateTestAttempt(
  test: Test,
  attempt: CompletedAttemptRecord
): DetailedEvaluation {
  const questions = getTestQuestions(test.id);
  const marksPerCorrect = test.marksPerCorrect ?? 4;
  const defaultNegative = test.negativeMarks ?? 1;

  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;
  let marksObtained = 0;

  const evaluatedQuestions: EvaluatedQuestion[] = questions.map((q, idx) => {
    const studentAnswer = attempt.answers[q.id];
    const isAttempted =
      studentAnswer !== undefined && studentAnswer !== null && studentAnswer !== "";

    let isCorrect = false;
    let marksAwarded = 0;

    if (isAttempted) {
      if (q.type === "numerical") {
        isCorrect = String(studentAnswer).trim() === String(q.correctAnswer).trim();
      } else {
        isCorrect = Number(studentAnswer) === Number(q.correctAnswer);
      }

      if (isCorrect) {
        marksAwarded = q.marks ?? marksPerCorrect;
        correctCount++;
      } else {
        marksAwarded = -(q.negativeMarks ?? defaultNegative);
        wrongCount++;
      }
    } else {
      unattemptedCount++;
      marksAwarded = 0;
    }

    marksObtained += marksAwarded;

    return {
      question: q,
      questionIndex: idx,
      studentAnswer: isAttempted ? studentAnswer : null,
      isAttempted,
      isCorrect,
      marksAwarded,
    };
  });

  const totalQuestions = questions.length;
  const attemptedCount = correctCount + wrongCount;
  const totalMarks = questions.reduce((sum, q) => sum + (q.marks ?? marksPerCorrect), 0);
  const accuracyPercentage =
    attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

  const { rank, totalCandidates, percentile } = getCohortRankAndPercentile(
    marksObtained,
    totalMarks
  );

  // Group by subject
  const subjectMap = new Map<string, EvaluatedQuestion[]>();
  evaluatedQuestions.forEach((eq) => {
    const subj = eq.question.subject ?? test.subject;
    const existing = subjectMap.get(subj) ?? [];
    existing.push(eq);
    subjectMap.set(subj, existing);
  });

  const subjects: SubjectBreakdown[] = Array.from(subjectMap.entries()).map(
    ([subject, eqs]) => {
      const sAttempted = eqs.filter((e) => e.isAttempted).length;
      const sCorrect = eqs.filter((e) => e.isCorrect).length;
      const sWrong = sAttempted - sCorrect;
      const sUnattempted = eqs.length - sAttempted;
      const sMarks = eqs.reduce((sum, e) => sum + e.marksAwarded, 0);
      const sMaxMarks = eqs.reduce((sum, e) => sum + (e.question.marks ?? marksPerCorrect), 0);
      const sAccuracy = sAttempted > 0 ? Math.round((sCorrect / sAttempted) * 100) : 0;

      return {
        subject,
        totalQuestions: eqs.length,
        attempted: sAttempted,
        correct: sCorrect,
        wrong: sWrong,
        unattempted: sUnattempted,
        marks: sMarks,
        maxMarks: sMaxMarks,
        accuracyPercentage: sAccuracy,
      };
    }
  );

  const totalDurationSeconds = (test.durationMinutes || 60) * 60;
  const timeSpentSeconds = attempt.timeTakenSeconds || 0;

  return {
    test,
    attempt,
    evaluatedQuestions,
    totalQuestions,
    attemptedCount,
    unattemptedCount,
    correctCount,
    wrongCount,
    marksObtained,
    totalMarks,
    accuracyPercentage,
    rank,
    totalCandidates,
    percentile,
    timeSpentSeconds,
    timeSpentFormatted: formatTimeSpan(timeSpentSeconds),
    totalDurationSeconds,
    totalDurationFormatted: `${test.durationMinutes} mins`,
    subjects,
  };
}

// -----------------------------------------------------------------
// Analytics Helpers & Mock History
// -----------------------------------------------------------------

export interface SubjectScoreData {
  subject: string;
  shortSubject: string;
  marksObtained: number;
  maxMarks: number;
}

export interface ChapterAccuracyData {
  chapter: string;
  accuracy: number;
  attempted: number;
  correct: number;
  total: number;
}

export interface PastAttemptSummary {
  testId: string;
  testTitle: string;
  date: string;
  score: number;
  totalMarks: number;
  percentage: number;
}

export interface TestAnalytics {
  subjectScores: SubjectScoreData[];
  chapterAccuracy: ChapterAccuracyData[];
  trendHistory: PastAttemptSummary[];
}

export const MOCK_PAST_ATTEMPTS: PastAttemptSummary[] = [
  {
    testId: "past-1",
    testTitle: "TS Generics & Utility Types",
    date: "Aug 18",
    score: 26,
    totalMarks: 40,
    percentage: 65,
  },
  {
    testId: "past-2",
    testTitle: "React 18 Concurrent Rendering",
    date: "Aug 26",
    score: 29,
    totalMarks: 40,
    percentage: 73,
  },
  {
    testId: "past-3",
    testTitle: "Redis Cluster & Distributed Lock",
    date: "Sep 03",
    score: 31,
    totalMarks: 40,
    percentage: 78,
  },
  {
    testId: "past-4",
    testTitle: "Fullstack Caching & Edge CDNs",
    date: "Sep 09",
    score: 33,
    totalMarks: 40,
    percentage: 83,
  },
  {
    testId: "past-5",
    testTitle: "Balanced Trees & Graphs Challenge",
    date: "Sep 15",
    score: 35,
    totalMarks: 40,
    percentage: 88,
  },
];

export function getTestAnalytics(evaluation: DetailedEvaluation): TestAnalytics {
  // 1. Subject-wise score
  const subjectScores: SubjectScoreData[] = evaluation.subjects.map((s) => {
    let shortSubject = s.subject;
    if (s.subject.includes("App Router")) shortSubject = "App Router";
    else if (s.subject.includes("Design System")) shortSubject = "Design UI";
    else if (s.subject.includes("Data Structures")) shortSubject = "DSA";
    else if (s.subject.includes("Cloud Infrastructure")) shortSubject = "DevOps";
    return {
      subject: s.subject,
      shortSubject,
      marksObtained: Math.max(0, s.marks),
      maxMarks: s.maxMarks,
    };
  });

  // 2. Chapter-wise accuracy
  const chapterMap = new Map<string, { correct: number; attempted: number; total: number }>();
  evaluation.evaluatedQuestions.forEach((eq) => {
    const chapter =
      eq.question.chapter ||
      (eq.question.subject ? eq.question.subject.split("&")[0].trim() : "Core");
    const existing = chapterMap.get(chapter) || { correct: 0, attempted: 0, total: 0 };
    existing.total += 1;
    if (eq.isAttempted) {
      existing.attempted += 1;
      if (eq.isCorrect) {
        existing.correct += 1;
      }
    }
    chapterMap.set(chapter, existing);
  });

  const chapterAccuracy: ChapterAccuracyData[] = Array.from(chapterMap.entries()).map(
    ([chapter, stats]) => ({
      chapter,
      accuracy: stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0,
      attempted: stats.attempted,
      correct: stats.correct,
      total: stats.total,
    })
  );

  // 3. Improvement trend: 5 prior tests + current test
  const currentPct =
    evaluation.totalMarks > 0
      ? Math.max(0, Math.round((evaluation.marksObtained / evaluation.totalMarks) * 100))
      : 0;

  const currentDate = evaluation.attempt.submittedAt
    ? new Date(evaluation.attempt.submittedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Current";

  const currentPoint: PastAttemptSummary = {
    testId: evaluation.test.id,
    testTitle: evaluation.test.title,
    date: currentDate,
    score: evaluation.marksObtained,
    totalMarks: evaluation.totalMarks,
    percentage: currentPct,
  };

  const trendHistory = [...MOCK_PAST_ATTEMPTS, currentPoint];

  return {
    subjectScores,
    chapterAccuracy,
    trendHistory,
  };
}
