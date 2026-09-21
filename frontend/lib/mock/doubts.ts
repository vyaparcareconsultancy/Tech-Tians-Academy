export type DoubtStatus = "Pending" | "Answered" | "Closed";

export interface TeacherResponse {
  facultyName: string;
  avatarInitials: string;
  responseText: string;
  responseDate: string;
}

export interface Doubt {
  id: string;
  subject: string;
  chapter: string;
  doubtText: string;
  attachedFileName?: string;
  submittedDate: string;
  status: DoubtStatus;
  response?: TeacherResponse;
}

export const DOUBT_SUBJECTS_MAP: Record<string, string[]> = {
  "App Router & Fullstack Architecture": [
    "App Router Conventions & Routing Mechanics",
    "Server Components & Streaming Pipeline",
    "Server Actions & Mutations",
    "Caching Multi-Tier & Invalidation",
  ],
  "Design Systems & Token Architecture": [
    "Tokens, Theming & Tailwind Config",
    "Primitive Component Engineering",
    "Fluid Typography & Elevation Scales",
    "Form Controls & Accessibility",
  ],
  "Data Structures & Algorithms": [
    "Binary Trees & BSTs",
    "Balanced Red-Black Trees",
    "Graphs & BFS/DFS Traversals",
    "Dynamic Programming & Memoization",
  ],
  "Cloud Infrastructure & DevOps": [
    "Redis Clusters & Caching",
    "Docker Containerization & CI/CD",
    "Subnetting & CIDR Networking",
    "Edge CDN Routing & Hardening",
  ],
};

export const MOCK_DOUBTS: Doubt[] = [
  {
    id: "doubt-1",
    subject: "App Router & Fullstack Architecture",
    chapter: "Server Components & Streaming Pipeline",
    doubtText: "When streaming with Suspense in Next.js 14, my fallback spinner flashes briefly even when data is cached via fetch memoization. Why doesn't it render synchronously on the client?",
    attachedFileName: "suspense-flash-trace.png",
    submittedDate: "Sep 18, 2026",
    status: "Answered",
    response: {
      facultyName: "Karan Singhania",
      avatarInitials: "KS",
      responseText: "Even when fetch memoization resolves immediately on the server, a client navigation still yields an asynchronous React transition for new RSC payload chunks. To avoid layout flash, wrap child navigation in useTransition and keep layout shells static across route segments.",
      responseDate: "Sep 18, 2026, 4:30 PM",
    },
  },
  {
    id: "doubt-2",
    subject: "Data Structures & Algorithms",
    chapter: "Balanced Red-Black Trees",
    doubtText: "How does the Red-Black tree deletion fixup maintain the black-height invariant when deleting a node whose replacement child is also black (double black scenario)?",
    attachedFileName: "double-black-tree-case.png",
    submittedDate: "Sep 17, 2026",
    status: "Answered",
    response: {
      facultyName: "Dr. Sunita Rao",
      avatarInitials: "SR",
      responseText: "In the double-black case, we examine the sibling node's color and its children. If the sibling is black with at least one red child, rotations and recoloring eliminate the extra black. If both children are black, we push blackness up to the parent and recolor the sibling red, iterating upwards if necessary.",
      responseDate: "Sep 17, 2026, 7:15 PM",
    },
  },
  {
    id: "doubt-3",
    subject: "Design Systems & Token Architecture",
    chapter: "Tokens, Theming & Tailwind Config",
    doubtText: "Should design tokens for surface colors use direct hex/HSL values or CSS custom variables inside tailwind.config.ts for seamless dark mode swapping?",
    submittedDate: "Sep 16, 2026",
    status: "Answered",
    response: {
      facultyName: "Priya Sharma",
      avatarInitials: "PS",
      responseText: "Always map CSS custom variables: e.g. card: 'hsl(var(--card))'. This enables runtime dark/light theme transitions via data-theme attributes without duplicating utility classes or recalculating stylesheets.",
      responseDate: "Sep 16, 2026, 11:20 AM",
    },
  },
  {
    id: "doubt-4",
    subject: "Cloud Infrastructure & DevOps",
    chapter: "Redis Clusters & Caching",
    doubtText: "In a 3-master 3-replica Redis cluster setup, what happens if two master nodes go down simultaneously before automatic failover can complete?",
    attachedFileName: "redis-sharding-topology.png",
    submittedDate: "Sep 19, 2026",
    status: "Pending",
  },
  {
    id: "doubt-5",
    subject: "App Router & Fullstack Architecture",
    chapter: "Server Actions & Mutations",
    doubtText: "Can I invoke multiple Server Actions concurrently via Promise.all from an optimistic form, or will serialized action headers cause state desynchronization?",
    submittedDate: "Sep 19, 2026",
    status: "Pending",
  },
  {
    id: "doubt-6",
    subject: "Data Structures & Algorithms",
    chapter: "Dynamic Programming & Memoization",
    doubtText: "What is the optimal space complexity reduction for the 0/1 Knapsack problem when we only need the maximum aggregate value rather than reconstructing the chosen item subset?",
    submittedDate: "Sep 19, 2026",
    status: "Pending",
  },
  {
    id: "doubt-7",
    subject: "Design Systems & Token Architecture",
    chapter: "Primitive Component Engineering",
    doubtText: "Is it safe to render Radix Dialog primitives inside Server Components, or should the trigger button always live in an isolated 'use client' island?",
    submittedDate: "Sep 14, 2026",
    status: "Closed",
    response: {
      facultyName: "Priya Sharma",
      avatarInitials: "PS",
      responseText: "Resolved during live office hours. Radix primitives register DOM event listeners and refs, so they must always be encapsulated within a client component.",
      responseDate: "Sep 14, 2026, 6:00 PM",
    },
  },
  {
    id: "doubt-8",
    subject: "Cloud Infrastructure & DevOps",
    chapter: "Docker Containerization & CI/CD",
    doubtText: "How do we configure next.config.js output: 'standalone' to prune unused node_modules in multi-stage Docker builds?",
    submittedDate: "Sep 12, 2026",
    status: "Closed",
  },
];
