"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Breadcrumbs } from "./Breadcrumbs";
import { useAuth } from "@/hooks/useAuth";

interface AppShellProps {
  children: React.ReactNode;
  defaultRole?: "admin" | "teacher";
}

export function AppShell({ children, defaultRole = "admin" }: AppShellProps) {
  const { role: userRole } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);

  const activeRole = (userRole as "admin" | "teacher") || defaultRole;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-brand-navy-dark text-slate-900 dark:text-slate-100">
      {/* Dynamic Sidebar */}
      <Sidebar
        role={activeRole}
        isMobileOpen={isMobileNavOpen}
        onMobileClose={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onOpenMobileMenu={() => setIsMobileNavOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
}
