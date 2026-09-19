export interface SyllabusLecture {
  title: string;
  duration: string;
}

export interface SyllabusChapter {
  title: string;
  lectures: SyllabusLecture[];
}

export interface CourseReview {
  name: string;
  rating: number;
  text: string;
  date?: string;
}

export interface Course {
  id: string;
  title: string;
  faculty: string;
  category: string;
  completedLectures?: number;
  totalLectures?: number;
  progressPercentage?: number;
  batchId?: string;
  thumbnailBg?: string;
  price: number; // 0 for Free
  rating: number;
  popularity: number;
  duration?: string;
  description?: string;
  facultyTitle?: string;
  facultyBio?: string;
  syllabus?: SyllabusChapter[];
  reviews?: CourseReview[];
  inclusions?: string[];
}

export interface LectureNote {
  title: string;
  size: string;
  url: string;
}

export interface BatchLecture {
  id: string;
  title: string;
  duration: string;
  isFree?: boolean;
  youtubeId?: string;
  description?: string;
  notes?: LectureNote[];
}

export interface BatchChapter {
  id: string;
  title: string;
  lectures: BatchLecture[];
}

export interface BatchSubject {
  id: string;
  name: string;
  chapters: BatchChapter[];
}

export interface Batch {
  id: string;
  name: string;
  courseId: string;
  startDate: string;
  isActive: boolean;
  subjects: BatchSubject[];
}

export interface Lecture {
  id: string;
  title: string;
  courseName: string;
  duration: string;
  progressPercentage: number;
  thumbnailBg?: string;
}

export interface UpcomingClass {
  id: string;
  subject: string;
  faculty: string;
  date: string;
  time: string;
  duration: string;
  startsAt: string; // ISO string for computing startsWithin30Min
}

export interface PurchaseRecord {
  id: string;
  orderId: string;
  courseName: string;
  date: string;
  amount: number;
  status: "Completed" | "Processing" | "Refunded";
  invoiceUrl: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinedDate?: string;
  avatarUrl?: string;
  enrolledCoursesCount: number;
  activeBatchesCount: number;
  hoursWatched: number;
  completionPercentage: number;
  totalCompletedLectures?: number;
  certificatesEarned?: number;
  purchaseHistory?: PurchaseRecord[];
}

// -------------------------------------------------------------
// SINGLE SOURCE OF TRUTH: Lecture Completion IDs
// -------------------------------------------------------------
export const COMPLETED_LECTURE_IDS = new Set<string>([
  // Batch 1 Subject 1 (7 lectures) - all 7 completed
  "b1-s1-c1-l1",
  "b1-s1-c1-l2",
  "b1-s1-c1-l3",
  "b1-s1-c2-l1",
  "b1-s1-c2-l2",
  "b1-s1-c2-l3",
  "b1-s1-c2-l4",
  // Batch 1 Subject 2 (8 lectures) - 6 completed
  "b1-s2-c1-l1",
  "b1-s2-c1-l2",
  "b1-s2-c1-l3",
  "b1-s2-c1-l4",
  "b1-s2-c2-l1",
  "b1-s2-c2-l2",
  // Batch 1 Subject 3 (9 lectures) - 5 completed
  "b1-s3-c1-l1",
  "b1-s3-c1-l2",
  "b1-s3-c1-l3",
  "b1-s3-c2-l1",
  "b1-s3-c2-l2",
  // Total completed = 7 + 6 + 5 = 18 out of 24 (75%)

  // Batch 2 (DSA) - 38 completed out of 95 (40%)
  ...Array.from({ length: 38 }, (_, i) => `b2-l-${i + 1}`),

  // Batch 3 (Cloud) - 27 completed out of 30 (90%)
  ...Array.from({ length: 27 }, (_, i) => `b3-l-${i + 1}`),

  // Batch 4 (Backend) - 12 completed out of 40 (30%)
  ...Array.from({ length: 12 }, (_, i) => `b4-l-${i + 1}`),
]);

export function isLectureCompleted(lectureId: string): boolean {
  return COMPLETED_LECTURE_IDS.has(lectureId);
}

export function getSubjectProgress(subject: BatchSubject) {
  let total = 0;
  let completed = 0;
  for (const chapter of subject.chapters) {
    for (const lecture of chapter.lectures) {
      total++;
      if (COMPLETED_LECTURE_IDS.has(lecture.id)) {
        completed++;
      }
    }
  }
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}

export function getBatchProgress(batch: Batch) {
  let total = 0;
  let completed = 0;
  for (const subject of batch.subjects) {
    const p = getSubjectProgress(subject);
    completed += p.completed;
    total += p.total;
  }
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}

// -------------------------------------------------------------
// MOCK BATCHES
// -------------------------------------------------------------
export const MOCK_BATCHES: Batch[] = [
  {
    id: "batch-1",
    name: "Titan Cohort 1: Next.js Production Architecture",
    courseId: "course-1",
    startDate: "August 15, 2026",
    isActive: true,
    subjects: [
      {
        id: "b1-subj-1",
        name: "App Router & Fullstack Architecture",
        chapters: [
          {
            id: "b1-s1-ch-1",
            title: "App Router Conventions & Routing Mechanics",
            lectures: [
              { id: "b1-s1-c1-l1", title: "Project Ingestion, App Directory & Layouts", duration: "18m", isFree: true },
              { id: "b1-s1-c1-l2", title: "Dynamic Segments, Catch-All & Optional Routes", duration: "24m", isFree: true },
              { id: "b1-s1-c1-l3", title: "Route Groups, Parallel Routes & Interception", duration: "32m", isFree: false },
            ],
          },
          {
            id: "b1-s1-ch-2",
            title: "Server Components & Streaming Pipeline",
            lectures: [
              { id: "b1-s1-c2-l1", title: "RSC vs Client Components Mental Model", duration: "28m", isFree: false },
              { id: "b1-s1-c2-l2", title: "Progressive Streaming with Suspense Boundaries", duration: "35m", isFree: false },
              { id: "b1-s1-c2-l3", title: "Server Actions, Form State & Mutations", duration: "42m", isFree: false },
              { id: "b1-s1-c2-l4", title: "Nested Error Handling & Route-Level Recovery", duration: "22m", isFree: false },
            ],
          },
        ],
      },
      {
        id: "b1-subj-2",
        name: "Design Systems & Token Architecture",
        chapters: [
          {
            id: "b1-s2-ch-1",
            title: "Tokens, Theming & Tailwind Config",
            lectures: [
              { id: "b1-s2-c1-l1", title: "CSS Custom Properties & Semantic Color Maps", duration: "25m", isFree: true },
              { id: "b1-s2-c1-l2", title: "Fluid Typography, Spacing & Elevation Scales", duration: "30m", isFree: false },
              { id: "b1-s2-c1-l3", title: "CVA (Class Variance Authority) Variants", duration: "27m", isFree: false },
              { id: "b1-s2-c1-l4", title: "Focus Rings, Dark Mode & System Overrides", duration: "20m", isFree: false },
            ],
          },
          {
            id: "b1-s2-ch-2",
            title: "Primitive Component Engineering",
            lectures: [
              { id: "b1-s2-c2-l1", title: "Polymorphic Button & Accessible Badges", duration: "34m", isFree: false },
              { id: "b1-s2-c2-l2", title: "Modal Dialogs, Focus Traps & Portals", duration: "38m", isFree: false },
              { id: "b1-s2-c2-l3", title: "Form Controls, React Hook Form & Zod Client", duration: "45m", isFree: false },
              { id: "b1-s2-c2-l4", title: "Responsive Navigation Shell & Sidebar State", duration: "36m", isFree: false },
            ],
          },
        ],
      },
      {
        id: "b1-subj-3",
        name: "Data Fetching, Caching & Production Release",
        chapters: [
          {
            id: "b1-s3-ch-1",
            title: "Caching Multi-Tier & Invalidation",
            lectures: [
              { id: "b1-s3-c1-l1", title: "Request Memoization & Data Cache Mechanics", duration: "30m", isFree: false },
              { id: "b1-s3-c1-l2", title: "Time-based & On-Demand Revalidation (revalidatePath)", duration: "36m", isFree: false },
              { id: "b1-s3-c1-l3", title: "Edge Middleware, Session Verification & Cookies", duration: "38m", isFree: false },
              { id: "b1-s3-c1-l4", title: "Optimistic UI Updates with useOptimistic", duration: "26m", isFree: false },
              { id: "b1-s3-c1-l5", title: "Resilient Offline Sync & Retry Strategies", duration: "31m", isFree: false },
            ],
          },
          {
            id: "b1-s3-ch-2",
            title: "Containerization, Hardening & CI/CD",
            lectures: [
              { id: "b1-s3-c2-l1", title: "Multi-stage Next.js Standalone Docker Builds", duration: "40m", isFree: false },
              { id: "b1-s3-c2-l2", title: "Bundle Analyzer, Web Vitals & Performance Budget", duration: "35m", isFree: false },
              { id: "b1-s3-c2-l3", title: "OpenTelemetry, Structured Logs & Sentry Hook", duration: "29m", isFree: false },
              { id: "b1-s3-c2-l4", title: "Edge CDN Routing & Deployment Checklist", duration: "32m", isFree: false },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "batch-2",
    name: "Achievers Batch: Advanced DSA & Competitive Coding",
    courseId: "course-2",
    startDate: "July 1, 2026",
    isActive: true,
    subjects: [
      {
        id: "b2-subj-1",
        name: "Data Structures Foundations",
        chapters: [
          {
            id: "b2-s1-ch-1",
            title: "Arrays, Linked Lists & Stacks",
            lectures: Array.from({ length: 30 }, (_, i) => ({
              id: `b2-l-${i + 1}`,
              title: `Lecture ${i + 1}: DS Concept & LeetCode Hard Walkthrough`,
              duration: "45m",
              isFree: i === 0,
            })),
          },
        ],
      },
      {
        id: "b2-subj-2",
        name: "Advanced Trees & Graph Algorithms",
        chapters: [
          {
            id: "b2-s2-ch-1",
            title: "Tries, Segment Trees & Graphs",
            lectures: Array.from({ length: 35 }, (_, i) => ({
              id: `b2-l-${i + 31}`,
              title: `Lecture ${i + 31}: Graph Theory & Topological Sort`,
              duration: "50m",
            })),
          },
        ],
      },
      {
        id: "b2-subj-3",
        name: "Dynamic Programming & Optimization",
        chapters: [
          {
            id: "b2-s3-ch-1",
            title: "1D & 2D Dynamic Programming Patterns",
            lectures: Array.from({ length: 30 }, (_, i) => ({
              id: `b2-l-${i + 66}`,
              title: `Lecture ${i + 66}: DP State Transitions & Bitmasking`,
              duration: "60m",
            })),
          },
        ],
      },
    ],
  },
  {
    id: "batch-3",
    name: "Cloud Architect Batch: AWS, Kubernetes & DevOps",
    courseId: "course-3",
    startDate: "June 10, 2026",
    isActive: true,
    subjects: [
      {
        id: "b3-subj-1",
        name: "Cloud Networking & Linux Internals",
        chapters: [
          {
            id: "b3-s1-ch-1",
            title: "Networking, VPCs & Containers",
            lectures: Array.from({ length: 10 }, (_, i) => ({
              id: `b3-l-${i + 1}`,
              title: `Cloud Module ${i + 1}: VPC Peering, Routing & Security Groups`,
              duration: "40m",
              isFree: i === 0,
            })),
          },
        ],
      },
      {
        id: "b3-subj-2",
        name: "Kubernetes Cluster Engineering",
        chapters: [
          {
            id: "b3-s2-ch-1",
            title: "Pods, Services & Ingress Controllers",
            lectures: Array.from({ length: 10 }, (_, i) => ({
              id: `b3-l-${i + 11}`,
              title: `Kubernetes Module ${i + 1}: StatefulSets & Helm Deployments`,
              duration: "45m",
            })),
          },
        ],
      },
      {
        id: "b3-subj-3",
        name: "Terraform & Multi-Region CI/CD",
        chapters: [
          {
            id: "b3-s3-ch-1",
            title: "Infrastructure as Code & GitOps",
            lectures: Array.from({ length: 10 }, (_, i) => ({
              id: `b3-l-${i + 21}`,
              title: `Terraform Module ${i + 1}: Automated GitOps Pipeline`,
              duration: "50m",
            })),
          },
        ],
      },
    ],
  },
  {
    id: "batch-4",
    name: "Backend Core: PostgreSQL & Distributed Systems",
    courseId: "course-4",
    startDate: "September 5, 2026",
    isActive: true,
    subjects: [
      {
        id: "b4-subj-1",
        name: "PostgreSQL Internals & ACID",
        chapters: [
          {
            id: "b4-s1-ch-1",
            title: "Storage Engine & B-Tree Indexing",
            lectures: Array.from({ length: 15 }, (_, i) => ({
              id: `b4-l-${i + 1}`,
              title: `Postgres ${i + 1}: MVCC, Vacuuming & WAL Logging`,
              duration: "35m",
              isFree: i === 0,
            })),
          },
        ],
      },
      {
        id: "b4-subj-2",
        name: "Distributed Concurrency & Consensus",
        chapters: [
          {
            id: "b4-s2-ch-1",
            title: "Raft, Paxos & Two-Phase Commits",
            lectures: Array.from({ length: 15 }, (_, i) => ({
              id: `b4-l-${i + 16}`,
              title: `Distributed ${i + 1}: Distributed Locking with Redlock`,
              duration: "45m",
            })),
          },
        ],
      },
      {
        id: "b4-subj-3",
        name: "Event-Driven Message Queues",
        chapters: [
          {
            id: "b4-s3-ch-1",
            title: "Kafka & RabbitMQ Scalability",
            lectures: Array.from({ length: 10 }, (_, i) => ({
              id: `b4-l-${i + 31}`,
              title: `Messaging ${i + 1}: Consumer Groups & Partitioning`,
              duration: "40m",
            })),
          },
        ],
      },
    ],
  },
];

export function getBatchById(id: string): Batch | undefined {
  return MOCK_BATCHES.find((b) => b.id === id);
}

// -------------------------------------------------------------
// ENROLLED COURSES (Derived dynamically from getBatchProgress)
// -------------------------------------------------------------
const b1Progress = getBatchProgress(MOCK_BATCHES[0]);
const b2Progress = getBatchProgress(MOCK_BATCHES[1]);
const b3Progress = getBatchProgress(MOCK_BATCHES[2]);
const b4Progress = getBatchProgress(MOCK_BATCHES[3]);

export const MOCK_ENROLLED_COURSES: Course[] = [
  {
    id: "course-1",
    title: "Next.js 14 Production Architecture & Design Systems",
    faculty: "Karan Singhania",
    category: "Frontend Architecture",
    completedLectures: b1Progress.completed,
    totalLectures: b1Progress.total,
    progressPercentage: b1Progress.percentage,
    batchId: "batch-1",
    thumbnailBg: "from-blue-600 via-indigo-700 to-navy",
    price: 2999,
    rating: 4.9,
    popularity: 3400,
    duration: "8 Weeks",
  },
  {
    id: "course-2",
    title: "Advanced Data Structures & Competitive Coding",
    faculty: "Dr. Sunita Rao",
    category: "Problem Solving",
    completedLectures: b2Progress.completed,
    totalLectures: b2Progress.total,
    progressPercentage: b2Progress.percentage,
    batchId: "batch-2",
    thumbnailBg: "from-emerald-600 via-teal-700 to-emerald-900",
    price: 4999,
    rating: 4.8,
    popularity: 4800,
    duration: "16 Weeks",
  },
  {
    id: "course-3",
    title: "Full-Stack Cloud System Architecture & Kubernetes",
    faculty: "Er. Rohit Varma",
    category: "Cloud Engineering",
    completedLectures: b3Progress.completed,
    totalLectures: b3Progress.total,
    progressPercentage: b3Progress.percentage,
    batchId: "batch-3",
    thumbnailBg: "from-purple-600 via-indigo-800 to-slate-900",
    price: 7999,
    rating: 4.9,
    popularity: 2900,
    duration: "12 Weeks",
  },
  {
    id: "course-4",
    title: "Database Design, PostgreSQL & Distributed Systems",
    faculty: "Priya Sharma",
    category: "Backend Engineering",
    completedLectures: b4Progress.completed,
    totalLectures: b4Progress.total,
    progressPercentage: b4Progress.percentage,
    batchId: "batch-4",
    thumbnailBg: "from-rose-600 via-pink-700 to-amber-700",
    price: 3499,
    rating: 4.7,
    popularity: 2100,
    duration: "10 Weeks",
  },
];

const totalEnrolledCompleted =
  b1Progress.completed + b2Progress.completed + b3Progress.completed + b4Progress.completed;
const totalEnrolledLectures =
  b1Progress.total + b2Progress.total + b3Progress.total + b4Progress.total;
const overallCompletion =
  totalEnrolledLectures > 0
    ? Math.round((totalEnrolledCompleted / totalEnrolledLectures) * 100)
    : 68;

export const MOCK_PURCHASE_HISTORY: PurchaseRecord[] = [
  {
    id: "purch-1",
    orderId: "ORD-98241",
    courseName: "Next.js 14 Production Architecture & Design Systems",
    date: "Aug 14, 2026",
    amount: 2999,
    status: "Completed",
    invoiceUrl: "#",
  },
  {
    id: "purch-2",
    orderId: "ORD-87120",
    courseName: "Advanced Data Structures & Competitive Coding",
    date: "Jun 30, 2026",
    amount: 4999,
    status: "Completed",
    invoiceUrl: "#",
  },
  {
    id: "purch-3",
    orderId: "ORD-75619",
    courseName: "Full-Stack Cloud System Architecture & Kubernetes",
    date: "Jun 08, 2026",
    amount: 7999,
    status: "Completed",
    invoiceUrl: "#",
  },
  {
    id: "purch-4",
    orderId: "ORD-62340",
    courseName: "Database Design, PostgreSQL & Distributed Systems",
    date: "Sep 04, 2026",
    amount: 3499,
    status: "Completed",
    invoiceUrl: "#",
  },
  {
    id: "purch-5",
    orderId: "ORD-51922",
    courseName: "Introduction to Web Development & JavaScript Essentials",
    date: "Jan 15, 2026",
    amount: 0,
    status: "Completed",
    invoiceUrl: "#",
  },
];

export const MOCK_STUDENT: Student = {
  id: "std-001",
  name: "Alex Johnson",
  email: "alex.johnson@tians.academy",
  phone: "+91 98765 43210",
  joinedDate: "January 12, 2026",
  enrolledCoursesCount: 4,
  activeBatchesCount: 3,
  hoursWatched: 42.5,
  completionPercentage: overallCompletion,
  totalCompletedLectures: totalEnrolledCompleted,
  certificatesEarned: 2,
  purchaseHistory: MOCK_PURCHASE_HISTORY,
};

export const MOCK_RECENT_LECTURES: Lecture[] = [
  {
    id: "lec-101",
    title: "Server Actions & Optimistic Mutations in Next.js 14",
    courseName: "Next.js 14 Production Architecture",
    duration: "45m",
    progressPercentage: 75,
    thumbnailBg: "from-blue-600 via-indigo-600 to-sky-500",
  },
  {
    id: "lec-102",
    title: "0/1 Knapsack & Subset Sum Optimization",
    courseName: "Advanced DSA & Algorithms",
    duration: "60m",
    progressPercentage: 40,
    thumbnailBg: "from-emerald-600 via-teal-600 to-cyan-500",
  },
  {
    id: "lec-103",
    title: "Distributed Caching & Redis Clustering",
    courseName: "Cloud System Architecture",
    duration: "50m",
    progressPercentage: 90,
    thumbnailBg: "from-amber-600 via-orange-600 to-rose-500",
  },
];

export const MOCK_ALL_COURSES: Course[] = [
  ...MOCK_ENROLLED_COURSES,
  {
    id: "course-5",
    title: "Introduction to Web Development & JavaScript Essentials",
    faculty: "Aman Gupta",
    category: "Frontend Architecture",
    thumbnailBg: "from-cyan-500 via-blue-600 to-indigo-700",
    price: 0,
    rating: 4.6,
    popularity: 9500,
    duration: "4 Weeks",
  },
  {
    id: "course-6",
    title: "Mastering React, TypeScript & State Management",
    faculty: "Karan Singhania",
    category: "Frontend Architecture",
    thumbnailBg: "from-sky-500 via-blue-700 to-indigo-900",
    price: 1499,
    rating: 4.8,
    popularity: 3100,
    duration: "6 Weeks",
  },
  {
    id: "course-7",
    title: "Python for Data Science & Machine Learning",
    faculty: "Ananya Sen",
    category: "AI & Machine Learning",
    thumbnailBg: "from-violet-600 via-purple-700 to-fuchsia-800",
    price: 3999,
    rating: 4.9,
    popularity: 4200,
    duration: "10 Weeks",
  },
  {
    id: "course-8",
    title: "Deep Learning Foundations & Neural Networks",
    faculty: "Ananya Sen",
    category: "AI & Machine Learning",
    thumbnailBg: "from-fuchsia-600 via-pink-700 to-rose-900",
    price: 8999,
    rating: 4.9,
    popularity: 1900,
    duration: "14 Weeks",
  },
  {
    id: "course-9",
    title: "Git, GitHub & Open Source Contribution Starter Pack",
    faculty: "Er. Rohit Varma",
    category: "Cloud Engineering",
    thumbnailBg: "from-emerald-500 via-teal-600 to-slate-800",
    price: 0,
    rating: 4.7,
    popularity: 8200,
    duration: "2 Weeks",
  },
  {
    id: "course-10",
    title: "Golang Microservices & High Performance APIs",
    faculty: "Vikram Malhotra",
    category: "Backend Engineering",
    thumbnailBg: "from-cyan-600 via-teal-700 to-blue-900",
    price: 1999,
    rating: 4.8,
    popularity: 2600,
    duration: "6 Weeks",
  },
  {
    id: "course-11",
    title: "Complete DevOps, CI/CD Pipelines & Terraform",
    faculty: "Er. Rohit Varma",
    category: "Cloud Engineering",
    thumbnailBg: "from-amber-600 via-orange-700 to-red-800",
    price: 5999,
    rating: 4.8,
    popularity: 3700,
    duration: "10 Weeks",
  },
  {
    id: "course-12",
    title: "React Native & Cross-Platform Mobile Apps",
    faculty: "Vikram Malhotra",
    category: "Mobile Development",
    thumbnailBg: "from-blue-500 via-indigo-600 to-purple-800",
    price: 4499,
    rating: 4.7,
    popularity: 2300,
    duration: "8 Weeks",
  },
  {
    id: "course-13",
    title: "Flutter & Dart Mobile App Development",
    faculty: "Priya Sharma",
    category: "Mobile Development",
    thumbnailBg: "from-sky-400 via-blue-600 to-teal-700",
    price: 999,
    rating: 4.5,
    popularity: 1800,
    duration: "5 Weeks",
  },
  {
    id: "course-14",
    title: "Competitive Programming Crash Course: Graph Algorithms",
    faculty: "Dr. Sunita Rao",
    category: "Problem Solving",
    thumbnailBg: "from-teal-600 via-emerald-700 to-green-900",
    price: 1899,
    rating: 4.9,
    popularity: 3900,
    duration: "6 Weeks",
  },
  {
    id: "course-15",
    title: "Generative AI, LLMs & Prompt Engineering Bootcamp",
    faculty: "Ananya Sen",
    category: "AI & Machine Learning",
    thumbnailBg: "from-purple-700 via-violet-800 to-indigo-950",
    price: 6499,
    rating: 4.9,
    popularity: 5100,
    duration: "8 Weeks",
  },
];

// Helper to generate dynamic ISO timestamps for demo
const now = Date.now();
const min = 60 * 1000;

export const MOCK_UPCOMING_CLASSES: UpcomingClass[] = [
  {
    id: "cls-1",
    subject: "Next.js App Router Masterclass: Live Code Review",
    faculty: "Karan Singhania",
    date: "Today",
    time: "Starting soon",
    duration: "90 min",
    startsAt: new Date(now + 15 * min).toISOString(), // Starts in 15 mins -> Join ENABLED
  },
  {
    id: "cls-2",
    subject: "Graph Traversal & Dijkstra Problem Solving",
    faculty: "Dr. Sunita Rao",
    date: "Today",
    time: "4:00 PM",
    duration: "120 min",
    startsAt: new Date(now + 240 * min).toISOString(), // Starts in 4 hrs -> Join DISABLED
  },
  {
    id: "cls-3",
    subject: "Docker & Kubernetes Multi-Node Cluster Setup",
    faculty: "Er. Rohit Varma",
    date: "Tomorrow",
    time: "11:00 AM",
    duration: "90 min",
    startsAt: new Date(now + 1440 * min).toISOString(), // Tomorrow -> Join DISABLED
  },
  {
    id: "cls-4",
    subject: "SQL Query Optimization & Indexing Strategies",
    faculty: "Priya Sharma",
    date: "Tomorrow",
    time: "3:30 PM",
    duration: "75 min",
    startsAt: new Date(now + 1710 * min).toISOString(), // Tomorrow -> Join DISABLED
  },
];

export function getCourseById(id: string): Course | undefined {
  const course = MOCK_ALL_COURSES.find((c) => c.id === id);
  if (!course) return undefined;

  return {
    ...course,
    description:
      course.description ||
      `Master ${course.title} from the ground up with hands-on architectural design, production case studies, and real-world implementations. Taught by industry veteran ${course.faculty}, this track bridges the gap between conceptual understanding and enterprise-grade software delivery.`,
    facultyTitle: course.facultyTitle || "Lead Educator & Former Senior Principal Architect",
    facultyBio:
      course.facultyBio ||
      `${course.faculty} brings 12+ years of production experience building high-throughput distributed systems and modern web architectures. Having mentored over 25,000+ students and engineers, their lectures focus on core mental models, production debugging, and clean architecture patterns.`,
    inclusions: course.inclusions || [
      "40+ hours of on-demand HD lecture recordings",
      "Full lifetime access to course material and future updates",
      "Downloadable starter repositories & architecture diagrams",
      "Dedicated doubt forum with fast mentor response time",
      "Official Verifiable Certificate of Completion",
    ],
    syllabus: course.syllabus || [
      {
        title: "Module 1: Foundations, Mental Models & Core Principles",
        lectures: [
          { title: "Course Introduction & Development Environment Setup", duration: "18m" },
          { title: "Foundational Architectural Paradigms & Constraints", duration: "32m" },
          { title: "Data Flow, State Hierarchies & Lifecycle Overview", duration: "28m" },
        ],
      },
      {
        title: "Module 2: Deep Dive Implementation & Core Mechanics",
        lectures: [
          { title: "Deep Dive: Syntax, Internal Engines & Compilation Pipelines", duration: "44m" },
          { title: "Building Resilient Domain Logic & Component Systems", duration: "36m" },
          { title: "Handling Asynchronous Flows, Caching & Data Mutation", duration: "42m" },
          { title: "Hands-on Code Walkthrough & Refactoring Exercise", duration: "50m" },
        ],
      },
      {
        title: "Module 3: Advanced Optimization, Performance & Scalability",
        lectures: [
          { title: "Profiling Bottlenecks & Algorithmic Complexity", duration: "38m" },
          { title: "Memory Management & Latency Reduction Techniques", duration: "35m" },
          { title: "Production Hardening, Error Boundaries & Telemetry", duration: "45m" },
        ],
      },
      {
        title: "Module 4: Enterprise Capstone Project & Deployment",
        lectures: [
          { title: "Architecting the End-to-End Capstone Application", duration: "55m" },
          { title: "CI/CD Setup, Production Release & Next Steps", duration: "40m" },
        ],
      },
    ],
    reviews: course.reviews || [
      {
        name: "Aman Sharma",
        rating: 5,
        text: "The conceptual depth in this course is unmatched. The whiteboard breakdowns and hands-on capstone project gave me immense confidence during system design rounds.",
        date: "2 weeks ago",
      },
      {
        name: "Pooja Krishnan",
        rating: 5,
        text: "Crystal clear explanations without unnecessary fluff. The instructor explains the 'why' behind architectural choices rather than just syntax.",
        date: "1 month ago",
      },
      {
        name: "Vikram Malhotra",
        rating: 4.8,
        text: "High-yield curriculum from start to finish. The syllabus structure is progressive and the code examples are production-ready.",
        date: "1 month ago",
      },
      {
        name: "Sneha Reddy",
        rating: 5,
        text: "Easily the best investment I've made in my engineering upskilling. Highly recommended for every developer aiming for top-tier roles.",
        date: "2 months ago",
      },
    ],
  };
}

export interface LectureDetailsResult {
  lecture: BatchLecture;
  chapter: BatchChapter;
  subject: BatchSubject;
  batch: Batch;
  course?: Course;
  prevLecture: BatchLecture | null;
  nextLecture: BatchLecture | null;
  chapterLectures: BatchLecture[];
}

export function getLectureDetails(id: string): LectureDetailsResult | null {
  let targetId = id;
  if (id.startsWith("lec-")) {
    const lectureIdMap: Record<string, string> = {
      "lec-101": "b1-s1-c2-l3",
      "lec-102": "b2-l-66",
      "lec-103": "b1-s3-c1-l1",
    };
    targetId = lectureIdMap[id] || "b1-s1-c1-l1";
  }

  for (const batch of MOCK_BATCHES) {
    for (const subject of batch.subjects) {
      for (const chapter of subject.chapters) {
        const lectureIndex = chapter.lectures.findIndex((l) => l.id === targetId);
        if (lectureIndex !== -1) {
          const lecture = chapter.lectures[lectureIndex];
          const prevLecture = lectureIndex > 0 ? chapter.lectures[lectureIndex - 1] : null;
          const nextLecture =
            lectureIndex < chapter.lectures.length - 1 ? chapter.lectures[lectureIndex + 1] : null;
          const course = getCourseById(batch.courseId);

          return {
            lecture: {
              ...lecture,
              youtubeId: lecture.youtubeId || "LDB4uaJ87e0", // Next.js 14 Complete Course (freeCodeCamp embeddable)
              description:
                lecture.description ||
                `In this lecture on "${lecture.title}", we break down essential design decisions, runtime performance characteristics, and developer ergonomic practices. You will learn step-by-step implementation techniques followed by real-world architectural case studies.`,
              notes: lecture.notes || [
                {
                  title: `${lecture.title} - Annotated Lecture Slides.pdf`,
                  size: "2.4 MB",
                  url: `/downloads/${lecture.id}-slides.pdf`,
                },
                {
                  title: `${lecture.title} - Source Code & DPP Solution.pdf`,
                  size: "1.2 MB",
                  url: `/downloads/${lecture.id}-dpp.pdf`,
                },
              ],
            },
            chapter,
            subject,
            batch,
            course,
            prevLecture,
            nextLecture,
            chapterLectures: chapter.lectures,
          };
        }
      }
    }
  }

  return null;
}

// -------------------------------------------------------------
// LANDING PAGE MOCK DATA (Merged from lib/mock-data.ts)
// -------------------------------------------------------------
export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
  description: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface StepItem {
  number: string;
  title: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  result: string;
  course: string;
  quote: string;
  rating: number;
  avatarFallback: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const MOCK_STATS: StatItem[] = [
  { id: "students", label: "Students Enrolled", value: 10000, suffix: "+", description: "Active learners across 20+ countries" },
  { id: "faculty", label: "Expert Faculty", value: 50, suffix: "+", description: "Top rankers & IIT/NIT alumni" },
  { id: "courses", label: "Quality Courses", value: 120, suffix: "+", description: "Comprehensive syllabus coverage" },
  { id: "success", label: "Success Rate", value: 98, suffix: "%", description: "Qualifying exam clearance rate" },
];

export const MOCK_FEATURES: FeatureItem[] = [
  {
    id: "live-classes",
    title: "Live Interactive Classes",
    description: "Two-way audio/video sessions with top educators. Ask questions in real-time with instant whiteboarding.",
    iconName: "Radio",
    badge: "Interactive",
  },
  {
    id: "recorded-lectures",
    title: "Recorded Lectures",
    description: "Never miss a concept. HD recordings available within 1 hour with variable playback speed and timestamps.",
    iconName: "PlayCircle",
  },
  {
    id: "mock-tests",
    title: "Mock Tests & Analysis",
    description: "Full-length exam simulations with AI-powered weak-area diagnostics and all-India rank percentiles.",
    iconName: "CheckSquare",
    badge: "AI Powered",
  },
  {
    id: "doubt-solving",
    title: "24/7 Doubt Resolution",
    description: "Dedicated teaching assistants resolve questions in under 15 minutes via chat, audio, and video snippets.",
    iconName: "HelpCircle",
  },
  {
    id: "study-material",
    title: "Study Material & DPPs",
    description: "Daily Practice Papers, chapter-wise formulas, annotated PDF notes, and previous 10-year question banks.",
    iconName: "FileText",
  },
  {
    id: "performance-tracking",
    title: "Performance Tracking",
    description: "Weekly progress scorecards, attendance logs, homework completion meters, and tutor checkpoints.",
    iconName: "TrendingUp",
  },
];

export const MOCK_STEPS: StepItem[] = [
  {
    number: "01",
    title: "Sign Up for Free",
    description: "Create your student account in 30 seconds and take a free baseline diagnostic assessment.",
  },
  {
    number: "02",
    title: "Choose Your Course",
    description: "Browse our curated tracks, attend free sample masterclasses, and select your enrollment tier.",
  },
  {
    number: "03",
    title: "Start Learning",
    description: "Attend scheduled live lectures, solve Daily Practice Problems (DPPs), and interact with mentors.",
  },
  {
    number: "04",
    title: "Track & Excel",
    description: "Analyze test percentiles, clear lingering doubts 24/7, and achieve your dream target score.",
  },
];

export const MOCK_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "test-1",
    name: "Aman Sharma",
    result: "AIR 48 - JEE Advanced",
    course: "Physics & Math Mastery",
    quote:
      "The structured test analysis and 15-minute doubt solving changed my preparation completely. Tech Tians educators don't just teach formulas—they build crystal-clear conceptual intuition.",
    rating: 5,
    avatarFallback: "AS",
  },
  {
    id: "test-2",
    name: "Pooja Krishnan",
    result: "Score 710/720 - NEET",
    course: "Medical Foundation Batch",
    quote:
      "Daily Practice Papers kept me disciplined every single day. The teachers break down complex biology and chemistry mechanisms into intuitive visual workflows that make retention effortless.",
    rating: 5,
    avatarFallback: "PK",
  },
  {
    id: "test-3",
    name: "Vikram Malhotra",
    result: "AIR 12 - GATE CS",
    course: "Algorithms & Systems",
    quote:
      "The high-yield mock tests and simulated rankings mirrored the actual exam environment perfectly. Tech Tians Academy is without doubt the gold standard in modern coaching.",
    rating: 5,
    avatarFallback: "VM",
  },
  {
    id: "test-4",
    name: "Sneha Reddy",
    result: "99.85 Percentile - CAT",
    course: "Quantitative Aptitude",
    quote:
      "Live interactive lectures made all the difference. Being able to ask questions and see live step-by-step whiteboard breakdowns helped me conquer my weakest topics in record time.",
    rating: 5,
    avatarFallback: "SR",
  },
];

export const MOCK_FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "How do live interactive classes work?",
    answer:
      "Our live classes take place inside our interactive student classroom. You can ask doubts directly via real-time audio or chat, participate in live polls, and view high-resolution whiteboard annotations. Recordings are posted within an hour of class conclusion.",
  },
  {
    id: "faq-2",
    question: "What happens if I miss a scheduled live class?",
    answer:
      "Every single live lecture is automatically recorded in 1080p HD and uploaded to your student portal. You receive unlimited lifetime access to recordings, timestamped chapters, and downloadable annotated PDF lecture notes.",
  },
  {
    id: "faq-3",
    question: "How does the 24/7 doubt resolution system work?",
    answer:
      "Whenever you get stuck on a question, upload a screenshot or voice note to the Doubt Forum. Our qualified subject matter experts and dedicated teaching assistants respond with detailed step-by-step solutions in under 15 minutes.",
  },
  {
    id: "faq-4",
    question: "Can I access the classes and test series on mobile devices?",
    answer:
      "Yes! Tech Tians Academy is fully responsive across desktop, tablet, and mobile browsers. You can watch lectures, submit quizzes, download DPPs, and track your metrics on any screen with zero friction.",
  },
  {
    id: "faq-5",
    question: "Are Daily Practice Papers (DPPs) and solutions provided?",
    answer:
      "Yes. After every live session, a curated DPP consisting of 15 to 25 topic-targeted problems is released. Video explanations and detailed written answer keys are unlocked the following morning.",
  },
  {
    id: "faq-6",
    question: "Is there a refund policy if I want to cancel my enrollment?",
    answer:
      "We offer a 7-day unconditional money-back guarantee on all our flagship batches. If you feel the curriculum does not meet your expectations, simply reach out to support within 7 days for a 100% full refund.",
  },
];


