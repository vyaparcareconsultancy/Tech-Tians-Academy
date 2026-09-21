"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const LABEL_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  students: "Students",
  teachers: "Teachers",
  courses: "Courses",
  batches: "Batches",
  "my-batches": "My Batches",
  content: "Content",
  tests: "Tests & Assessments",
  doubts: "Doubts & Inquiries",
  orders: "Orders & Revenue",
  reports: "Reports & Analytics",
  settings: "Settings",
};

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();

  const segments = React.useMemo(() => {
    if (!pathname) return [];
    return pathname
      .split("/")
      .filter(Boolean)
      .filter((seg) => !seg.startsWith("(") && !seg.endsWith(")"));
  }, [pathname]);

  if (segments.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-xs text-slate-500 dark:text-slate-400 py-1 select-none", className)}
    >
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-slate-500 hover:text-brand-blue dark:hover:text-blue-400 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = "/" + segments.slice(0, index + 1).join("/");
          const label = LABEL_MAP[segment] || segment.replace(/-/g, " ");

          return (
            <li key={href} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              {isLast ? (
                <span className="font-semibold text-slate-900 dark:text-slate-100 capitalize">
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="hover:text-brand-blue dark:hover:text-blue-400 transition-colors capitalize"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
