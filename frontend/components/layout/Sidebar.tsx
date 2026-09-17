"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Radio,
  CheckSquare,
  HelpCircle,
  Layers,
  CreditCard,
  User,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const defaultSidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Courses", href: "/courses", icon: BookOpen },
  { label: "Live Classes", href: "/live", icon: Radio },
  { label: "Tests", href: "/tests", icon: CheckSquare },
  { label: "Doubts", href: "/doubts", icon: HelpCircle },
  { label: "Study Material", href: "/materials", icon: Layers },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Profile", href: "/profile", icon: User },
];

export interface SidebarProps {
  items?: SidebarItem[];
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  className?: string;
}

export function Sidebar({
  items = defaultSidebarItems,
  mobileOpen = false,
  onMobileClose,
  className,
}: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Restore collapsed state from localStorage
  React.useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("sidebar-collapsed");
      if (stored !== null) {
        setIsCollapsed(stored === "true");
      }
    } catch {
      // Ignore localStorage read failures
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sidebar-collapsed", String(next));
      } catch {
        // Ignore localStorage write failures
      }
      return next;
    });
  };

  // Close mobile drawer on route change
  React.useEffect(() => {
    onMobileClose?.();
  }, [pathname, onMobileClose]);

  const navList = (isMobile: boolean = false) => (
    <nav className="flex-1 space-y-1.5 px-3 py-4" aria-label="Sidebar Navigation">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            title={isCollapsed && !isMobile ? item.label : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium transition-colors select-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue",
              isActive
                ? "bg-brand-blue text-white shadow-sm font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              isCollapsed && !isMobile && "justify-center px-2"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5 shrink-0 transition-transform duration-200",
                isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
              )}
            />
            {(!isCollapsed || isMobile) && (
              <span className="truncate">{item.label}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 flex-col border-r border-border bg-card transition-all duration-300 md:flex",
          isCollapsed ? "w-20" : "w-64",
          className
        )}
      >
        <div className="flex flex-1 flex-col overflow-y-auto">
          {navList(false)}
        </div>

        {/* Bottom Collapse Toggle */}
        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg p-2 text-body-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue",
              isCollapsed && "justify-center"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer (Triggered from Navbar) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={onMobileClose}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <aside className="relative z-50 flex w-72 flex-col border-r border-border bg-card text-card-foreground shadow-xl animate-in slide-in-from-left duration-200">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <span className="text-body font-bold text-foreground">
                Student Navigation
              </span>
              <button
                type="button"
                onClick={onMobileClose}
                aria-label="Close navigation"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {navList(true)}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
