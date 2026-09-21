import * as React from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-9 w-9",
  }[size];

  return (
    <svg
      role="status"
      aria-label="Loading"
      className={cn("animate-spin text-brand-blue", sizeClass, className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export interface LoadingOverlayProps {
  fullPage?: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({
  fullPage = false,
  message = "Loading...",
  className,
}: LoadingOverlayProps) {
  return (
    <div
      role="alert"
      aria-busy="true"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm",
        fullPage ? "fixed inset-0 z-50" : "absolute inset-0 z-10 rounded-lg",
        className
      )}
    >
      <Spinner size="lg" />
      {message && (
        <p className="text-body-sm font-medium text-foreground">{message}</p>
      )}
    </div>
  );
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circle" | "rect";
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "rect", ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "animate-pulse bg-muted",
          variant === "text" && "h-4 w-full rounded-sm",
          variant === "circle" && "rounded-full aspect-square",
          variant === "rect" && "rounded-md",
          className
        )}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";
