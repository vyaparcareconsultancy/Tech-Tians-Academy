"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  FileCheck,
  ShoppingCart,
  BarChart3,
  Settings,
  HelpCircle,
  FolderGit2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";

interface SidebarProps {
  role: "admin" | "teacher";
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const ADMIN_NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "Students", href: "/students", icon: "Users" },
  { title: "Teachers", href: "/teachers", icon: "GraduationCap" },
  { title: "Courses", href: "/courses", icon: "BookOpen" },
  { title: "Batches", href: "/batches", icon: "Layers" },
  { title: "Tests", href: "/tests", icon: "FileCheck" },
  { title: "Orders", href: "/orders", icon: "ShoppingCart" },
  { title: "Reports", href: "/reports", icon: "BarChart3" },
  { title: "Settings", href: "/settings", icon: "Settings" },
];

const TEACHER_NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "My Batches", href: "/my-batches", icon: "Layers" },
  { title: "Content", href: "/content", icon: "FolderGit2" },
  { title: "Tests", href: "/tests", icon: "FileCheck" },
  { title: "Doubts", href: "/doubts", icon: "HelpCircle", badge: "14" },
  { title: "Students", href: "/students", icon: "Users" },
];

const ICONS_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5 shrink-0" />,
  Users: <Users className="w-5 h-5 shrink-0" />,
  GraduationCap: <GraduationCap className="w-5 h-5 shrink-0" />,
  BookOpen: <BookOpen className="w-5 h-5 shrink-0" />,
  Layers: <Layers className="w-5 h-5 shrink-0" />,
  FileCheck: <FileCheck className="w-5 h-5 shrink-0" />,
  ShoppingCart: <ShoppingCart className="w-5 h-5 shrink-0" />,
  BarChart3: <BarChart3 className="w-5 h-5 shrink-0" />,
  Settings: <Settings className="w-5 h-5 shrink-0" />,
  HelpCircle: <HelpCircle className="w-5 h-5 shrink-0" />,
  FolderGit2: <FolderGit2 className="w-5 h-5 shrink-0" />,
};

export function Sidebar({ role, isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const navItems = role === "teacher" ? TEACHER_NAV_ITEMS : ADMIN_NAV_ITEMS;

  // Persist sidebar collapsed state in localStorage
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(false);
  const [isMounted, setIsMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("techtians_sidebar_collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const toggleCollapsed = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("techtians_sidebar_collapsed", String(nextState));
  };

  // Close mobile drawer on route change
  React.useEffect(() => {
    onMobileClose();
  }, [pathname, onMobileClose]);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-brand-navy dark:bg-brand-navy-dark text-slate-200 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
            T
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                Tech Tians
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-cyan/20 text-brand-cyan font-medium">
                  {role === "teacher" ? "FACULTY" : "ADMIN"}
                </span>
              </span>
              <span className="text-[11px] text-slate-400 truncate">Academy Management</span>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        {isMobileOpen && (
          <button
            onClick={onMobileClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.title : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative",
                isActive
                  ? "bg-brand-blue text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              )}
            >
              {ICONS_MAP[item.icon] || <LayoutDashboard className="w-5 h-5 shrink-0" />}

              {(!isCollapsed || isMobileOpen) && (
                <span className="truncate flex-1">{item.title}</span>
              )}

              {(!isCollapsed || isMobileOpen) && item.badge && (
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-semibold",
                    isActive ? "bg-white/20 text-white" : "bg-brand-cyan text-brand-navy font-bold"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && !isMobileOpen && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer / Collapse Button (Desktop Only) */}
      <div className="hidden md:flex items-center justify-between p-3 border-t border-slate-800">
        <button
          onClick={toggleCollapsed}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Menu</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          "hidden md:block transition-all duration-200 z-30 shrink-0",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className={cn("fixed top-0 bottom-0 h-screen transition-all duration-200", isCollapsed ? "w-16" : "w-64")}>
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="md:hidden fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 ease-in-out shadow-2xl",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
}
