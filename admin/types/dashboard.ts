export interface StatCardData {
  id: string;
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: string;
  helperText?: string;
}

export interface ActivityItem {
  id: string;
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
  };
  action: string;
  target: string;
  timestamp: string;
  type: "user" | "course" | "doubt" | "order" | "test";
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  badge?: string;
  color?: "blue" | "cyan" | "navy";
}

export interface AdminDashboardData {
  stats: StatCardData[];
  recentActivities: ActivityItem[];
  quickActions: QuickAction[];
}

export interface TeacherDashboardData {
  stats: StatCardData[];
  recentDoubts: Array<{
    id: string;
    studentName: string;
    batchName: string;
    question: string;
    createdAt: string;
    status: "pending" | "resolved";
  }>;
  upcomingBatches: Array<{
    id: string;
    name: string;
    course: string;
    studentsCount: number;
    schedule: string;
  }>;
}
