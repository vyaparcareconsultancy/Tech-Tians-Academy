"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Menu,
  X,
  GraduationCap,
  User,
  BookOpen,
  CreditCard,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Button,
  Avatar,
  Badge,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
} from "@/components/ui";

export interface NavbarProps {
  isLoggedIn?: boolean;
  unreadNotificationsCount?: number;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  onToggleMobileSidebar?: () => void;
  showSidebarToggle?: boolean;
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Tests", href: "/tests" },
  { label: "Doubts", href: "/doubts" },
  { label: "Live Classes", href: "/live" },
];

export function Navbar({
  isLoggedIn = false,
  unreadNotificationsCount = 3,
  user = {
    name: "Alex Titan",
    email: "student@tians.academy",
  },
  onToggleMobileSidebar,
  showSidebarToggle = false,
}: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Sticky shadow trigger past 10px scroll
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md transition-shadow duration-200",
        isScrolled && "shadow-sm"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile Sidebar Trigger + Brand Logo & Wordmark */}
        <div className="flex items-center gap-3">
          {showSidebarToggle && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              aria-label="Open sidebar navigation"
              className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground md:hidden"
            >
              <LayoutDashboard className="h-5 w-5" />
            </button>
          )}

          <Link
            href="/"
            className="flex items-center gap-2.5 transition opacity-95 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-md"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-navy text-white shadow-sm">
              <GraduationCap className="h-5 w-5 text-brand-cyan" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-body font-bold tracking-tight text-foreground">
                Tech Tians
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-blue">
                Academy
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3.5 py-2 text-body-sm font-medium transition-colors select-none",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue",
                  isActive
                    ? "text-brand-blue font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Auth / Student Controls */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              {/* Notification Bell */}
              <Dropdown>
                <DropdownTrigger>
                  <button
                    type="button"
                    aria-label="Notifications"
                    className="relative rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white leading-none">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>
                </DropdownTrigger>
                <DropdownMenu align="right" className="w-80 p-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-body-sm font-semibold text-foreground">
                      Notifications
                    </span>
                    <Badge variant="primary" size="sm">
                      {unreadNotificationsCount} New
                    </Badge>
                  </div>
                  <div className="space-y-2 py-3 text-left">
                    <div className="rounded-md bg-muted/50 p-2 text-caption">
                      <p className="font-medium text-foreground">Live class starting in 15m</p>
                      <p className="text-muted-foreground">Advanced Next.js App Router</p>
                    </div>
                    <div className="rounded-md bg-muted/50 p-2 text-caption">
                      <p className="font-medium text-foreground">Quiz Graded</p>
                      <p className="text-muted-foreground">TypeScript Strict Mode: 95/100</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block text-center text-caption font-medium text-brand-blue hover:underline"
                  >
                    View all notifications
                  </Link>
                </DropdownMenu>
              </Dropdown>

              {/* Avatar User Dropdown */}
              <Dropdown>
                <DropdownTrigger>
                  <button
                    type="button"
                    aria-label="User profile menu"
                    className="flex items-center gap-2 rounded-full p-0.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                  >
                    <Avatar
                      src={user.avatarUrl}
                      fallback={user.name}
                      size="sm"
                    />
                  </button>
                </DropdownTrigger>
                <DropdownMenu align="right" className="w-56">
                  <div className="border-b border-border px-3 py-2 text-left">
                    <p className="truncate text-body-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-caption text-muted-foreground">
                      {user.email}
                    </p>
                  </div>

                  <DropdownItem
                    icon={<User className="h-4 w-4" />}
                    onClick={() => {}}
                  >
                    <Link href="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownItem>
                  <DropdownItem
                    icon={<BookOpen className="h-4 w-4" />}
                    onClick={() => {}}
                  >
                    <Link href="/courses" className="w-full">
                      My Courses
                    </Link>
                  </DropdownItem>
                  <DropdownItem
                    icon={<CreditCard className="h-4 w-4" />}
                    onClick={() => {}}
                  >
                    <Link href="/payments" className="w-full">
                      Payments
                    </Link>
                  </DropdownItem>
                  <DropdownItem
                    icon={<Settings className="h-4 w-4" />}
                    onClick={() => {}}
                  >
                    <Link href="/settings" className="w-full">
                      Settings
                    </Link>
                  </DropdownItem>

                  <DropdownDivider />

                  <DropdownItem
                    variant="danger"
                    icon={<LogOut className="h-4 w-4" />}
                    onClick={() => {}}
                  >
                    <Link href="/login" className="w-full text-danger">
                      Logout
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          {isLoggedIn && (
            <Link
              href="/dashboard"
              aria-label="Profile"
              className="rounded-full p-1"
            >
              <Avatar src={user.avatarUrl} fallback={user.name} size="sm" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 flex flex-col bg-background/95 backdrop-blur-md border-t border-border animate-in slide-in-from-top-4 duration-200 md:hidden">
          <nav className="flex flex-1 flex-col space-y-1 p-6 text-left" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center rounded-lg px-4 py-3 text-body font-medium transition-colors",
                    isActive
                      ? "bg-brand-blue/10 text-brand-blue font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border p-6">
            {isLoggedIn ? (
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 px-2">
                  <Avatar src={user.avatarUrl} fallback={user.name} size="md" />
                  <div className="truncate">
                    <p className="text-body-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link href="/dashboard" className="w-full">
                    <Button variant="outline" size="sm" fullWidth>
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full">
                    <Button variant="ghost" size="sm" fullWidth className="text-danger">
                      Logout
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" className="w-full">
                  <Button variant="outline" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link href="/signup" className="w-full">
                  <Button variant="primary" fullWidth>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
