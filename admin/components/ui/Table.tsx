import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-navy shadow-subtle">
      <table className={cn("w-full caption-bottom text-sm text-left", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-brand-navy-dark/75 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider",
        className
      )}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn("divide-y divide-slate-100 dark:divide-slate-800/60 font-normal", className)}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={cn("h-11 px-4 text-left align-middle font-medium", className)} {...props} />
  );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("p-4 align-middle", className)} {...props} />;
}
