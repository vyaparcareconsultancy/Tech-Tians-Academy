"use client";

import * as React from "react";
import Link from "next/link";
import {
  Radio,
  PlayCircle,
  CheckSquare,
  HelpCircle,
  FileText,
  TrendingUp,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Users,
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MonitorPlay,
  Flame,
} from "lucide-react";
import { Container } from "@/components/layout";
import { Button, Badge, Modal, ModalBody, ModalHeader, ModalFooter, Accordion } from "@/components/ui";
import { CourseCard } from "@/components/dashboard/CourseCard";
import {
  MOCK_STATS,
  MOCK_FEATURES,
  MOCK_ALL_COURSES,
  MOCK_STEPS,
  MOCK_TESTIMONIALS,
  MOCK_FAQS,
} from "@/lib/mock/dashboard";

// Simple hook for IntersectionObserver visibility trigger
function useInView(options?: IntersectionObserverInit) {
  const [inView, setInView] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(el);
      }
    }, { threshold: 0.15, ...options });

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}

// Animated Counter component
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = React.useState(0);
  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (!inView) return;

    let startTime: number | null = null;
    const duration = 1600; // ms

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out expo
      const current = Math.floor(progress === 1 ? target : target * (1 - Math.pow(2, -10 * progress)));
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function LandingSections() {
  const [isDemoModalOpen, setIsDemoModalOpen] = React.useState(false);
  const [activeTestimonial, setActiveTestimonial] = React.useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = React.useState(false);

  // Auto-play for testimonials carousel (5s interval)
  React.useEffect(() => {
    if (isAutoplayPaused) return;

    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % MOCK_TESTIMONIALS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoplayPaused]);

  // Map string icon names to Lucide icons
  const getFeatureIcon = (name: string) => {
    switch (name) {
      case "Radio": return <Radio className="h-6 w-6 text-brand-blue" />;
      case "PlayCircle": return <PlayCircle className="h-6 w-6 text-brand-cyan" />;
      case "CheckSquare": return <CheckSquare className="h-6 w-6 text-success" />;
      case "HelpCircle": return <HelpCircle className="h-6 w-6 text-warning" />;
      case "FileText": return <FileText className="h-6 w-6 text-brand-blue" />;
      case "TrendingUp": return <TrendingUp className="h-6 w-6 text-brand-cyan" />;
      default: return <Sparkles className="h-6 w-6 text-brand-blue" />;
    }
  };

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-brand-navy-mid to-brand-navy py-20 text-white sm:py-28 lg:py-32">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(var(--brand-cyan)_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        
        {/* Atmospheric ambient glows */}
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-brand-blue/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-brand-cyan/15 blur-3xl pointer-events-none" />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Headlines & CTAs */}
            <div className="space-y-8 text-center lg:col-span-7 lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-caption font-medium backdrop-blur-md">
                <Flame className="h-4 w-4 text-warning animate-pulse" />
                <span>Next-Gen Engineering & Competitive Exam Coaching</span>
              </div>

              {/* Single H1 for SEO */}
              <h1 className="text-display font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                Master High-Impact <br />
                <span className="bg-gradient-to-r from-brand-blue-light via-brand-cyan to-white bg-clip-text text-transparent">
                  Engineering & Coding
                </span>
              </h1>

              <p className="mx-auto max-w-2xl text-body-lg text-gray-300 lg:mx-0">
                Join India&apos;s fastest-growing technical academy. Live interactive masterclasses, AI-assisted mock analysis, 15-minute doubt resolution, and curriculum crafted by industry veterans.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Link href="/courses">
                  <Button size="lg" variant="primary" className="shadow-brand">
                    Explore Courses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsDemoModalOpen(true)}
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                  leftIcon={<PlayCircle className="h-5 w-5 text-brand-cyan" />}
                >
                  Watch Demo
                </Button>
              </div>

              {/* Trust Row */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-8 lg:justify-start">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue/20 text-brand-cyan">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-body font-bold text-white leading-none">10,000+</p>
                    <p className="text-caption text-gray-400">Enrolled Students</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue/20 text-brand-cyan">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-body font-bold text-white leading-none">50+ Courses</p>
                    <p className="text-caption text-gray-400">Foundation to Pro</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/20 text-warning">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <div className="text-left">
                    <p className="text-body font-bold text-white leading-none">4.8 / 5.0</p>
                    <p className="text-caption text-gray-400">Student Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Mockup Showcase */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md rounded-xl border border-white/20 bg-brand-navy-mid/90 p-4 shadow-2xl backdrop-blur-xl transition hover:border-brand-cyan/40">
                {/* Mock Window Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-danger/80" />
                    <span className="h-3 w-3 rounded-full bg-warning/80" />
                    <span className="h-3 w-3 rounded-full bg-success/80" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-mono text-brand-cyan">
                    <span className="h-2 w-2 rounded-full bg-danger animate-ping" />
                    LIVE SESSION • 842 Online
                  </div>
                </div>

                {/* Mock Classroom Body */}
                <div className="mt-3 space-y-3">
                  <div className="relative h-44 w-full rounded-lg bg-brand-navy overflow-hidden flex flex-col justify-between p-3 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-caption font-mono text-gray-300">
                        Lesson #14: Distributed Caching & Queues
                      </span>
                      <Badge variant="primary" size="sm">
                        HD 1080p
                      </Badge>
                    </div>

                    <div className="rounded bg-black/40 p-2.5 font-mono text-xs text-gray-200 border border-white/5">
                      <code className="text-brand-cyan">redis.cluster()</code>
                      <span className="text-gray-400">.set(</span>
                      <span className="text-warning">&quot;user:session&quot;</span>
                      <span className="text-gray-400">, token);</span>
                    </div>

                    <div className="flex items-center justify-between text-caption text-gray-300">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-success" />
                        <span>Er. Rohit Varma (Instructor)</span>
                      </div>
                      <span className="text-[11px] text-gray-400">42:18 / 90:00</span>
                    </div>
                  </div>

                  {/* Mock Interactive Quiz Widget */}
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-caption font-bold text-white">Live Poll Question:</span>
                      <span className="text-[10px] text-brand-cyan font-mono">15s remaining</span>
                    </div>
                    <p className="text-caption text-gray-300">
                      What is the time complexity of searching in an optimized B+ Tree?
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div className="rounded bg-brand-blue/30 border border-brand-blue/50 p-1.5 text-center text-white font-medium">
                        ✓ O(log N) (84%)
                      </div>
                      <div className="rounded bg-white/5 p-1.5 text-center text-gray-400">
                        O(N) (6%)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. STATS STRIP SECTION */}
      <section className="border-y border-border bg-card py-10">
        <Container>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {MOCK_STATS.map((stat) => (
              <div key={stat.id} className="text-center space-y-1">
                <div className="text-h1 font-extrabold text-brand-blue tracking-tight">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-body-sm font-semibold text-foreground">{stat.label}</div>
                <div className="text-caption text-muted-foreground hidden sm:block">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. WHY CHOOSE US SECTION */}
      <section className="py-20 sm:py-28 bg-background">
        <Container>
          <div className="mx-auto max-w-2xl text-center space-y-4 mb-16">
            <Badge variant="primary">The Tech Tians Advantage</Badge>
            <h2 className="text-h1 font-bold tracking-tight text-foreground sm:text-4xl">
              Why Serious Aspirants Choose Us
            </h2>
            <p className="text-body text-muted-foreground">
              We combine pedagogical excellence with cutting-edge learning technology to deliver an unmatched student experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_FEATURES.map((feature) => (
              <div
                key={feature.id}
                className="group relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-brand text-left space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted border border-border transition-colors group-hover:bg-brand-blue/10">
                    {getFeatureIcon(feature.iconName)}
                  </div>
                  {feature.badge && (
                    <Badge variant="outline" size="sm" className="text-brand-blue border-brand-blue/30">
                      {feature.badge}
                    </Badge>
                  )}
                </div>

                <h3 className="text-h4 font-bold text-foreground group-hover:text-brand-blue transition-colors">
                  {feature.title}
                </h3>

                <p className="text-body-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. POPULAR COURSES SECTION */}
      <section className="border-t border-border bg-card/40 py-20 sm:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end mb-12">
            <div className="space-y-3 text-left">
              <Badge variant="primary">Flagship Programs</Badge>
              <h2 className="text-h1 font-bold tracking-tight text-foreground sm:text-4xl">
                Explore Popular Courses
              </h2>
              <p className="text-body text-muted-foreground">
                Structured learning paths with comprehensive curriculum and tutor support.
              </p>
            </div>

            <Link href="/courses">
              <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View All Courses
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_ALL_COURSES.slice(0, 3).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </Container>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section className="py-20 sm:py-28 bg-background">
        <Container>
          <div className="mx-auto max-w-2xl text-center space-y-4 mb-16">
            <Badge variant="primary">Simple Step-by-Step Path</Badge>
            <h2 className="text-h1 font-bold tracking-tight text-foreground sm:text-4xl">
              How Tech Tians Academy Works
            </h2>
            <p className="text-body text-muted-foreground">
              From day one to certification, our structured 4-step framework guarantees measurable outcomes.
            </p>
          </div>

          <div className="relative">
            {/* Desktop Connected Progress Line */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 hidden lg:block h-0.5 bg-border pointer-events-none z-0" />

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
              {MOCK_STEPS.map((step) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center text-center rounded-xl border border-border bg-card p-6 shadow-sm space-y-4 transition hover:border-brand-blue/30"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-navy text-white text-h4 font-bold border-4 border-card shadow-md">
                    <span className="text-brand-cyan">{step.number}</span>
                  </div>

                  <h3 className="text-h4 font-bold text-foreground">
                    {step.title}
                  </h3>

                  <p className="text-body-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 6. TESTIMONIALS CAROUSEL SECTION */}
      <section
        className="border-t border-border bg-card/40 py-20 sm:py-28"
        onMouseEnter={() => setIsAutoplayPaused(true)}
        onMouseLeave={() => setIsAutoplayPaused(false)}
      >
        <Container>
          <div className="mx-auto max-w-2xl text-center space-y-4 mb-14">
            <Badge variant="primary">Wall of Success</Badge>
            <h2 className="text-h1 font-bold tracking-tight text-foreground sm:text-4xl">
              Stories from Our Achievers
            </h2>
            <p className="text-body text-muted-foreground">
              Hear directly from students who transformed their careers and aced top competitive exams.
            </p>
          </div>

          {/* Testimonial Card Display */}
          <div className="mx-auto max-w-3xl">
            <div className="relative rounded-2xl border border-border bg-card p-8 sm:p-12 shadow-md text-left transition-all duration-300">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-warning mb-6">
                {[...Array(MOCK_TESTIMONIALS[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-h4 font-medium text-foreground leading-relaxed italic mb-8">
                &ldquo;{MOCK_TESTIMONIALS[activeTestimonial].quote}&rdquo;
              </blockquote>

              {/* Author & Exam Details */}
              <div className="flex items-center justify-between border-t border-border pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy text-white font-bold text-body">
                    {MOCK_TESTIMONIALS[activeTestimonial].avatarFallback}
                  </div>
                  <div>
                    <h4 className="text-body font-bold text-foreground">
                      {MOCK_TESTIMONIALS[activeTestimonial].name}
                    </h4>
                    <p className="text-caption font-semibold text-brand-blue">
                      {MOCK_TESTIMONIALS[activeTestimonial].result}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      {MOCK_TESTIMONIALS[activeTestimonial].course}
                    </p>
                  </div>
                </div>

                {/* Manual Carousel Arrows */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous testimonial"
                    onClick={() =>
                      setActiveTestimonial((prev) =>
                        prev === 0 ? MOCK_TESTIMONIALS.length - 1 : prev - 1
                      )
                    }
                    className="rounded-full border border-border p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next testimonial"
                    onClick={() =>
                      setActiveTestimonial((prev) =>
                        (prev + 1) % MOCK_TESTIMONIALS.length
                      )
                    }
                    className="rounded-full border border-border p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Carousel Indicator Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {MOCK_TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeTestimonial === idx
                      ? "w-8 bg-brand-blue"
                      : "w-2.5 bg-border hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-20 sm:py-28 bg-background">
        <Container>
          <div className="mx-auto max-w-2xl text-center space-y-4 mb-16">
            <Badge variant="primary">Got Questions?</Badge>
            <h2 className="text-h1 font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-body text-muted-foreground">
              Everything you need to know about our classroom platform, schedules, and policies.
            </p>
          </div>

          <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <Accordion
              items={MOCK_FAQS.map((faq) => ({
                id: faq.id,
                title: faq.question,
                content: faq.answer,
              }))}
            />
          </div>
        </Container>
      </section>

      {/* 8. FINAL CTA BAND */}
      <section className="relative overflow-hidden bg-gradient-to-r from-brand-blue to-brand-cyan py-16 text-white sm:py-20">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

        <Container className="relative z-10 text-center space-y-6">
          <h2 className="text-h1 font-extrabold text-white sm:text-4xl lg:text-5xl">
            Ready to Accelerate Your Career?
          </h2>

          <p className="mx-auto max-w-xl text-body-lg text-white/90">
            Join thousands of ambitious learners. Enroll today to unlock comprehensive live classes, test series, and personalized mentor feedback.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-brand-navy text-white hover:bg-brand-navy-mid shadow-lg border border-white/20"
              >
                Start Learning Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/courses">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 hover:text-white"
              >
                Browse Syllabus
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-caption text-white/80 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>7-Day Money Back Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span>Instant Portal Access</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              <span>Verified Course Certificates</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Interactive Demo Video Modal */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        size="lg"
        title="Interactive Platform Walkthrough"
        description="Experience the Tech Tians virtual classroom environment"
      >
        <ModalBody>
          <div className="relative aspect-video w-full rounded-lg bg-brand-navy border border-border flex flex-col items-center justify-center p-6 text-center text-white overflow-hidden">
            <MonitorPlay className="h-12 w-12 text-brand-cyan mb-3 animate-pulse" />
            <h4 className="text-h4 font-bold text-white">Live Classroom Preview</h4>
            <p className="mt-1 text-caption text-gray-400 max-w-sm">
              Demonstrating live code execution, real-time audio Q&A, and interactive student whiteboards.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="primary" size="sm">Interactive Video Demo</Badge>
              <span className="text-[11px] text-gray-400">Duration: 3m 45s</span>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsDemoModalOpen(false)}>
            Close Preview
          </Button>
          <Link href="/courses">
            <Button variant="primary" onClick={() => setIsDemoModalOpen(false)}>
              Explore Full Catalog
            </Button>
          </Link>
        </ModalFooter>
      </Modal>
    </div>
  );
}
