import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "blue" | "cyan" | "success" | "warning" | "danger" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-transparent",
    blue: "bg-blue-50 dark:bg-blue-950/60 text-brand-blue dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
    cyan: "bg-cyan-50 dark:bg-cyan-950/60 text-brand-cyan-dark dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/50",
    success: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
    warning: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
    danger: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50",
    outline: "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
