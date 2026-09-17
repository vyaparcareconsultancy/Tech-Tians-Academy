import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors select-none",
        size === "sm" && "px-2 py-0.5 text-caption",
        size === "md" && "px-2.5 py-1 text-body-sm",
        variant === "default" && "bg-muted text-muted-foreground border border-border",
        variant === "primary" && "bg-brand-blue/10 text-brand-blue border border-brand-blue/20",
        variant === "success" && "bg-success/10 text-success border border-success/20",
        variant === "warning" && "bg-warning/10 text-warning border border-warning/20",
        variant === "danger" && "bg-danger/10 text-danger border border-danger/20",
        variant === "info" && "bg-info/10 text-info border border-info/20",
        variant === "outline" && "border border-border text-foreground bg-transparent",
        className
      )}
      {...props}
    />
  );
}
