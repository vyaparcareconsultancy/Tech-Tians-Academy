import * as React from "react";
import Link from "next/link";
import { GraduationCap, Star, ShieldCheck, CheckCircle2 } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Left Panel: Desktop only with Navy Gradient, Value Prop & Testimonial */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-navy via-brand-navy-mid to-brand-navy p-12 text-white lg:flex">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(var(--brand-cyan)_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Ambient glow */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-blue/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-brand-cyan/15 blur-3xl pointer-events-none" />

        {/* Top: Logo & Wordmark */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md border border-white/10">
              <GraduationCap className="h-6 w-6 text-brand-cyan" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-body-lg font-bold tracking-tight text-white">
                {APP_NAME}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-cyan">
                Student Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Value Proposition */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <h2 className="text-display font-extrabold tracking-tight text-white sm:text-4xl leading-tight">
            Learn Without Limits. <br />
            <span className="bg-gradient-to-r from-brand-blue-light to-brand-cyan bg-clip-text text-transparent">
              Build Without Boundaries.
            </span>
          </h2>

          <p className="text-body text-gray-300 leading-relaxed">
            Gain access to scheduled live masterclasses, personalized weak-area diagnostics, and round-the-clock tutor doubt resolution.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2.5 text-body-sm text-gray-200">
              <CheckCircle2 className="h-4 w-4 text-brand-cyan shrink-0" />
              <span>Full curriculum with chapter DPPs & formula guides</span>
            </div>
            <div className="flex items-center gap-2.5 text-body-sm text-gray-200">
              <CheckCircle2 className="h-4 w-4 text-brand-cyan shrink-0" />
              <span>Unlimited lifetime access to HD class recordings</span>
            </div>
            <div className="flex items-center gap-2.5 text-body-sm text-gray-200">
              <ShieldCheck className="h-4 w-4 text-success shrink-0" />
              <span>Secure SSL encrypted student learning environment</span>
            </div>
          </div>
        </div>

        {/* Bottom: Student Testimonial Card */}
        <div className="relative z-10 rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur-md">
          <div className="flex items-center gap-1 text-warning mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <p className="text-body-sm text-gray-200 italic mb-4">
            &ldquo;The test series diagnostics and structured mentorship pushed my percentiles from the 80s to the top 0.1%. It completely reshaped how I approach problem solving.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-cyan text-brand-navy font-bold text-body-sm">
              AS
            </div>
            <div>
              <p className="text-body-sm font-bold text-white leading-tight">
                Aman Sharma
              </p>
              <p className="text-caption text-brand-cyan font-medium">
                AIR 48 - JEE Advanced
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Centered Form View */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-12 xl:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile-only logo */}
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy text-white shadow-sm">
                <GraduationCap className="h-6 w-6 text-brand-cyan" />
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-body-lg font-bold tracking-tight text-foreground">
                  {APP_NAME}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-blue">
                  Student Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Children Form */}
          {children}
        </div>
      </div>
    </div>
  );
}
