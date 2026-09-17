export interface CourseItem {
  id: string;
  title: string;
  category: string;
  faculty: string;
  facultyRole: string;
  rating: number;
  reviewsCount: number;
  duration: string;
  lecturesCount: number;
  price: number;
  originalPrice: number;
  badge?: string;
  slug: string;
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

export const MOCK_COURSES: CourseItem[] = [
  {
    id: "course-1",
    title: "Full-Stack System Architecture & Cloud Masterclass",
    category: "Software Engineering",
    faculty: "Er. Rohit Varma",
    facultyRole: "Ex-Google Staff Engineer",
    rating: 4.9,
    reviewsCount: 1420,
    duration: "6 Months",
    lecturesCount: 120,
    price: 4999,
    originalPrice: 14999,
    badge: "Bestseller",
    slug: "full-stack-system-architecture",
  },
  {
    id: "course-2",
    title: "Comprehensive Data Structures & Advanced Algorithms",
    category: "Coding & Problem Solving",
    faculty: "Dr. Sunita Rao",
    facultyRole: "IIT Bombay Alumni",
    rating: 4.8,
    reviewsCount: 2150,
    duration: "4 Months",
    lecturesCount: 95,
    price: 3499,
    originalPrice: 9999,
    badge: "Popular",
    slug: "dsa-mastery",
  },
  {
    id: "course-3",
    title: "Next.js 14, TypeScript & Production Design Systems",
    category: "Frontend Mastery",
    faculty: "Karan Singhania",
    facultyRole: "Principal Frontend Architect",
    rating: 4.9,
    reviewsCount: 890,
    duration: "3 Months",
    lecturesCount: 70,
    price: 2999,
    originalPrice: 7999,
    badge: "New",
    slug: "nextjs-typescript-design-systems",
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
