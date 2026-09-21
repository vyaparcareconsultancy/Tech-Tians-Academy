"use client";

import * as React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import {
  Menu,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  User,
  ShieldCheck,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface TopBarProps {
  onOpenMobileMenu: () => void;
}

export function TopBar({ onOpenMobileMenu }: TopBarProps) {
  const { user, role, logout } = useAuth();
  const { permissionStatus, requestPermission, isRequesting } = useNotifications();

  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

  // Close dropdowns on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-dropdown]")) {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/80 dark:bg-brand-navy/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      {/* Left: Mobile trigger & Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-lg">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search students, courses, batches, tests..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg bg-slate-100 dark:bg-slate-800/70 border border-transparent focus:border-brand-blue dark:focus:border-brand-blue focus:bg-white dark:focus:bg-brand-navy text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
          />
        </div>
      </div>

      {/* Right: Notification bell & Profile dropdown */}
      <div className="flex items-center gap-2 sm:gap-4 ml-4">
        {/* Notification Bell Dropdown */}
        <div className="relative" data-dropdown>
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-brand-cyan rounded-full ring-2 ring-white dark:ring-brand-navy" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-brand-navy border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h4>
                  <Badge variant="cyan">3 New</Badge>
                </div>
                {permissionStatus !== "granted" && (
                  <button
                    onClick={requestPermission}
                    disabled={isRequesting}
                    className="text-xs text-brand-blue hover:underline font-medium"
                  >
                    Enable Push
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                <div className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    New doubt assigned
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Rahul Sharma posted a doubt in React Hooks module.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">15 mins ago</span>
                </div>
                <div className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Batch 04 Test Scheduled
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Full Stack Assessment starts at 6:00 PM today.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">1 hour ago</span>
                </div>
              </div>

              <div className="p-2.5 text-center border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-brand-navy-dark/40">
                <span className="text-xs text-slate-500">Firebase Cloud Messaging active</span>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" data-dropdown>
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-navy text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              {user?.name ? user.name.slice(0, 2) : "TT"}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                {user?.name || "Admin User"}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                {role || "admin"}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white dark:bg-brand-navy border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-brand-navy-dark/40">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <Badge variant={role === "teacher" ? "cyan" : "blue"}>
                    {role === "teacher" ? "Faculty" : "Administrator"}
                  </Badge>
                </div>
              </div>

              <div className="p-1">
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
