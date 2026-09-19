import { User, LoginResponse } from "@/types/auth";
import { AdminDashboardData, TeacherDashboardData } from "@/types/dashboard";

export const MOCK_ADMIN_USER: User = {
  id: "usr_admin_001",
  name: "Dr. Rajesh Sharma",
  email: "admin@techtians.com",
  role: "admin",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  phone: "+91 98765 43210",
};

export const MOCK_TEACHER_USER: User = {
  id: "usr_teacher_001",
  name: "Prof. Priya Verma",
  email: "teacher@techtians.com",
  role: "teacher",
  avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  phone: "+91 98123 45678",
};

export const MOCK_ADMIN_LOGIN_RESPONSE: LoginResponse = {
  user: MOCK_ADMIN_USER,
  tokens: {
    accessToken: "mock_jwt_access_token_admin_techtians_2026",
    refreshToken: "mock_jwt_refresh_token_admin_techtians_2026",
  },
};

export const MOCK_TEACHER_LOGIN_RESPONSE: LoginResponse = {
  user: MOCK_TEACHER_USER,
  tokens: {
    accessToken: "mock_jwt_access_token_teacher_techtians_2026",
    refreshToken: "mock_jwt_refresh_token_teacher_techtians_2026",
  },
};

export const MOCK_ADMIN_DASHBOARD: AdminDashboardData = {
  stats: [
    {
      id: "stat_students",
      title: "Total Students",
      value: "14,820",
      change: "+12.5% vs last month",
      isPositive: true,
      icon: "Users",
      helperText: "Enrolled across 18 batches",
    },
    {
      id: "stat_courses",
      title: "Active Courses",
      value: "38",
      change: "+3 new this month",
      isPositive: true,
      icon: "BookOpen",
      helperText: "4 in review/drafting",
    },
    {
      id: "stat_revenue",
      title: "Revenue This Month",
      value: "₹ 18.4 Lakh",
      change: "+18.2% vs last month",
      isPositive: true,
      icon: "IndianRupee",
      helperText: "Target: ₹ 20.0 Lakh",
    },
    {
      id: "stat_doubts",
      title: "Pending Doubts",
      value: "42",
      change: "-8 vs yesterday",
      isPositive: true,
      icon: "HelpCircle",
      helperText: "Average resolution: 2.4 hrs",
    },
  ],
  quickActions: [
    {
      id: "qa_course",
      title: "Add Course",
      description: "Create a new curriculum, lessons & pricing",
      icon: "PlusCircle",
      href: "/courses",
      color: "blue",
    },
    {
      id: "qa_teacher",
      title: "Add Teacher",
      description: "Invite faculty member & assign batches",
      icon: "UserPlus",
      href: "/teachers",
      color: "cyan",
    },
    {
      id: "qa_test",
      title: "Create Test",
      description: "Draft MCQs, mock tests & assessment rubrics",
      icon: "FileCheck",
      href: "/tests",
      color: "navy",
    },
  ],
  recentActivities: [
    {
      id: "act_1",
      user: {
        name: "Aman Gupta",
        email: "aman.g@gmail.com",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
        role: "Student",
      },
      action: "enrolled in",
      target: "Full Stack MERN Bootcamp (Batch 04)",
      timestamp: "10 mins ago",
      type: "order",
    },
    {
      id: "act_2",
      user: {
        name: "Prof. Priya Verma",
        email: "teacher@techtians.com",
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        role: "Teacher",
      },
      action: "published mock test",
      target: "React Hooks & State Mastery Assessment",
      timestamp: "45 mins ago",
      type: "test",
    },
    {
      id: "act_3",
      user: {
        name: "Sneha Nair",
        email: "sneha.n@gmail.com",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        role: "Student",
      },
      action: "submitted doubt on",
      target: "DSA Graph Algorithms - Cycle Detection",
      timestamp: "2 hours ago",
      type: "doubt",
    },
    {
      id: "act_4",
      user: {
        name: "Karan Johar",
        email: "karan.j@techtians.com",
        role: "Admin",
      },
      action: "updated batch schedule for",
      target: "Data Science & GenAI Cohort 02",
      timestamp: "4 hours ago",
      type: "course",
    },
  ],
};

export const MOCK_TEACHER_DASHBOARD: TeacherDashboardData = {
  stats: [
    {
      id: "t_stat_batches",
      title: "My Active Batches",
      value: "4",
      change: "Active cohorts",
      isPositive: true,
      icon: "Layers",
      helperText: "230 total students",
    },
    {
      id: "t_stat_doubts",
      title: "Pending Doubts",
      value: "14",
      change: "Requires attention",
      isPositive: false,
      icon: "HelpCircle",
      helperText: "5 urgent (>4 hrs)",
    },
    {
      id: "t_stat_tests",
      title: "Tests to Evaluate",
      value: "2",
      change: "Deadline tomorrow",
      isPositive: false,
      icon: "FileText",
      helperText: "48 submissions pending",
    },
    {
      id: "t_stat_attendance",
      title: "Avg. Attendance",
      value: "89.4%",
      change: "+3.2% this week",
      isPositive: true,
      icon: "TrendingUp",
      helperText: "Top batch: MERN Cohort 04",
    },
  ],
  recentDoubts: [
    {
      id: "dbt_101",
      studentName: "Rahul Sharma",
      batchName: "MERN Cohort 04",
      question: "Why does useEffect run twice in React 18 Strict Mode and how does cleanup handle it?",
      createdAt: "30 mins ago",
      status: "pending",
    },
    {
      id: "dbt_102",
      studentName: "Ananya Patel",
      batchName: "Next.js Mastery",
      question: "How to handle Server Actions revalidation when cookie auth expires mid-request?",
      createdAt: "1 hour ago",
      status: "pending",
    },
    {
      id: "dbt_103",
      studentName: "Vikas Reddy",
      batchName: "Full Stack Cohort 03",
      question: "Difference between JWT refresh rotation and sliding session timeouts?",
      createdAt: "3 hours ago",
      status: "resolved",
    },
  ],
  upcomingBatches: [
    {
      id: "b_1",
      name: "MERN Stack Bootcamp — Batch 04",
      course: "Full Stack Web Development",
      studentsCount: 65,
      schedule: "Today, 6:00 PM - 8:00 PM",
    },
    {
      id: "b_2",
      name: "Next.js 14 App Router Advanced",
      course: "Modern Frontend Architecture",
      studentsCount: 42,
      schedule: "Tomorrow, 7:00 PM - 9:00 PM",
    },
  ],
};
