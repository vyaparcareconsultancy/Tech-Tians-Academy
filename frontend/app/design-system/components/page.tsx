"use client";

import * as React from "react";
import Link from "next/link";
import {
  Button,
  Input,
  Textarea,
  PasswordInput,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Spinner,
  LoadingOverlay,
  Skeleton,
  useToast,
  Badge,
  Avatar,
  Select,
} from "@/components/ui";

export default function ComponentsPreviewPage() {
  const { success, error, warning, info } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalSize, setModalSize] = React.useState<"sm" | "md" | "lg" | "xl">("md");

  // Loading Overlay State
  const [showOverlay, setShowOverlay] = React.useState(false);

  return (
    <div className="min-h-screen bg-background p-6 text-foreground transition-colors duration-200 sm:p-10">
      <div className="mx-auto max-w-6xl space-y-14">
        {/* Navigation & Header */}
        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/design-system"
                className="text-body-sm font-medium text-brand-blue hover:underline"
              >
                ← Tokens
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-body-sm text-muted-foreground">UI Kit</span>
            </div>
            <h1 className="mt-1 text-h1">UI Components</h1>
            <p className="text-body text-muted-foreground">
              Accessible, token-driven primitives for Tech Tians Academy
            </p>
          </div>
        </header>

        {/* 1. Buttons */}
        <section className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-h2">1. Button</h2>
            <p className="text-body-sm text-muted-foreground">
              Variants, sizes, states, icons, and loading indicator
            </p>
          </div>

          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <h3 className="text-h4">Variants</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>

            <h3 className="pt-2 text-h4">Sizes</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>

            <h3 className="pt-2 text-h4">States & Icons</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button isLoading>Saving...</Button>
              <Button
                leftIcon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                Add Course
              </Button>
              <Button
                variant="outline"
                rightIcon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                }
              >
                Continue
              </Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </section>

        {/* 2. Inputs & Forms */}
        <section className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-h2">2. Form Controls</h2>
            <p className="text-body-sm text-muted-foreground">
              Input, Textarea, PasswordInput with error states & icon slots
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 rounded-lg border border-border bg-card p-6 md:grid-cols-2">
            <Input
              label="Student Name"
              placeholder="e.g. John Doe"
              helperText="Enter your full legal name"
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="student@tians.academy"
              leftIcon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
            />

            <Input
              label="Username"
              defaultValue="invalid_user@"
              error="Username cannot contain special character @"
            />

            <Input
              label="Account ID"
              defaultValue="ACC-82910"
              disabled
              helperText="Assigned automatically by the registrar"
            />

            <PasswordInput
              label="Password"
              placeholder="Enter secure password"
              required
              helperText="Minimum 8 characters with letters & numbers"
            />

            <Select
              label="Primary Track"
              options={[
                { label: "Frontend Engineering", value: "frontend" },
                { label: "Backend Systems", value: "backend" },
                { label: "Cloud & DevOps", value: "devops" },
              ]}
              helperText="You can adjust this track later"
            />

            <div className="md:col-span-2">
              <Textarea
                label="Student Bio / Objectives"
                placeholder="Tell us about your background and what you want to build..."
                helperText="Markdown formatting supported"
              />
            </div>
          </div>
        </section>

        {/* 3. Cards */}
        <section className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-h2">3. Card</h2>
            <p className="text-body-sm text-muted-foreground">
              Default, bordered, elevated, and interactive hoverable variants
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>Clean boundary with subtle border</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm">
                  Standard container for content blocks, dashboards, and feeds.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline">Learn More</Button>
              </CardFooter>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Bordered Card</CardTitle>
                <CardDescription>High contrast 2px border</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm">
                  Designed for sections needing clear perimeter separation.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="secondary">View Details</Button>
              </CardFooter>
            </Card>

            <Card variant="elevated" hoverable>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Elevated + Hover</CardTitle>
                  <Badge variant="primary">Interactive</Badge>
                </div>
                <CardDescription>Shadow lift with brand accent</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm">
                  Hover over this card to preview the subtle translation and brand glow shadow.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="primary">Enroll Now</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* 4. Modal */}
        <section className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-h2">4. Modal</h2>
            <p className="text-body-sm text-muted-foreground">
              Portal-based with backdrop blur, focus trap, body scroll lock & ESC close
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-6">
            <Button
              onClick={() => {
                setModalSize("md");
                setIsModalOpen(true);
              }}
            >
              Open Medium Modal
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setModalSize("sm");
                setIsModalOpen(true);
              }}
            >
              Open Small Modal
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setModalSize("lg");
                setIsModalOpen(true);
              }}
            >
              Open Large Modal
            </Button>
          </div>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            size={modalSize}
            title="Complete Registration"
            description="Verify your enrollment details for Tech Tians Academy"
          >
            <ModalBody>
              <div className="space-y-3">
                <Input label="Student ID" defaultValue="TT-2026-904" disabled />
                <Input label="Graduation Year" defaultValue="2027" />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsModalOpen(false);
                  success("Saved", "Enrollment completed successfully!");
                }}
              >
                Confirm Enrollment
              </Button>
            </ModalFooter>
          </Modal>
        </section>

        {/* 5. Dropdown */}
        <section className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-h2">5. Dropdown</h2>
            <p className="text-body-sm text-muted-foreground">
              Trigger + menu with keyboard navigation, click-outside, and danger item
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border bg-card p-6">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="outline">
                  Account Menu ▼
                </Button>
              </DropdownTrigger>
              <DropdownMenu align="left">
                <DropdownItem
                  icon={
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                  onClick={() => info("Navigating to Profile")}
                >
                  My Profile
                </DropdownItem>
                <DropdownItem
                  icon={
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  }
                  onClick={() => info("Opening Settings")}
                >
                  Preferences
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem
                  variant="danger"
                  icon={
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  }
                  onClick={() => warning("Logged out")}
                >
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger>
                <Button variant="secondary">
                  Action Menu (Right-Aligned) ▼
                </Button>
              </DropdownTrigger>
              <DropdownMenu align="right">
                <DropdownItem onClick={() => info("Action 1")}>Export CSV</DropdownItem>
                <DropdownItem onClick={() => info("Action 2")}>Download Certificate</DropdownItem>
                <DropdownItem disabled>Archived Courses (Locked)</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </section>

        {/* 6. Tabs */}
        <section className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-h2">6. Tabs</h2>
            <p className="text-body-sm text-muted-foreground">
              Controlled / uncontrolled tabs with arrow-key navigation
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <div className="rounded-md border border-border bg-muted/40 p-4">
                  <h4 className="text-h4">Program Overview</h4>
                  <p className="mt-1 text-body-sm text-muted-foreground">
                    Comprehensive full-stack architecture modules focusing on production Next.js, TypeScript, and modern system design.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="curriculum" className="mt-4">
                <div className="rounded-md border border-border bg-muted/40 p-4">
                  <h4 className="text-h4">Course Modules</h4>
                  <p className="mt-1 text-body-sm text-muted-foreground">
                    8 modules covering App Router, Server Components, State Management, and Design Systems.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="projects" className="mt-4">
                <div className="rounded-md border border-border bg-muted/40 p-4">
                  <h4 className="text-h4">Capstone Projects</h4>
                  <p className="mt-1 text-body-sm text-muted-foreground">
                    Build a production-ready educational platform with auth, live streaming, and interactive exercises.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="settings" className="mt-4">
                <div className="rounded-md border border-border bg-muted/40 p-4">
                  <h4 className="text-h4">Track Preferences</h4>
                  <p className="mt-1 text-body-sm text-muted-foreground">
                    Configure notifications, timezone, and submission deadlines.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* 7. Loaders & Skeletons */}
        <section className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-h2">7. Loaders & Skeletons</h2>
            <p className="text-body-sm text-muted-foreground">
              Spinners, Skeletons (text, circle, rect) and LoadingOverlay
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 rounded-lg border border-border bg-card p-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-h4">Spinners</h3>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-caption text-muted-foreground">Small (16px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="md" />
                  <span className="text-caption text-muted-foreground">Medium (24px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="lg" />
                  <span className="text-caption text-muted-foreground">Large (36px)</span>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowOverlay(true);
                    setTimeout(() => setShowOverlay(false), 2000);
                  }}
                >
                  Test 2s Loading Overlay
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-h4">Skeletons</h3>
              <div className="flex items-center gap-3">
                <Skeleton variant="circle" className="h-12 w-12" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="w-3/4" />
                  <Skeleton variant="text" className="w-1/2" />
                </div>
              </div>
              <Skeleton variant="rect" className="h-20 w-full" />
            </div>
          </div>

          {showOverlay && <LoadingOverlay message="Synchronizing course content..." />}
        </section>

        {/* 8. Toasts */}
        <section className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-h2">8. Toast Notifications</h2>
            <p className="text-body-sm text-muted-foreground">
              Stackable alerts with automatic dismiss, manual close, and slide-in motion
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-6">
            <Button
              variant="primary"
              onClick={() => success("Saved!", "Your profile preferences were updated.")}
            >
              Trigger Success
            </Button>
            <Button
              variant="danger"
              onClick={() => error("Network Error", "Unable to establish database connection.")}
            >
              Trigger Error
            </Button>
            <Button
              variant="outline"
              onClick={() => warning("Session Expiring", "Please save your quiz progress.")}
            >
              Trigger Warning
            </Button>
            <Button
              variant="secondary"
              onClick={() => info("New Announcement", "Registration for Fall term is now open.")}
            >
              Trigger Info
            </Button>
          </div>
        </section>

        {/* 9. Badges & Avatars */}
        <section className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-h2">9. Badges & Avatars</h2>
            <p className="text-body-sm text-muted-foreground">
              Status pills and user profile avatars with initials fallback
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 rounded-lg border border-border bg-card p-6 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-h4">Status Badges</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Completed</Badge>
                <Badge variant="warning">In Review</Badge>
                <Badge variant="danger">Failed</Badge>
                <Badge variant="info">Upcoming</Badge>
                <Badge variant="outline">Draft</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-h4">Avatars</h3>
              <div className="flex items-center gap-4">
                <Avatar fallback="AK" size="sm" />
                <Avatar fallback="Tech Tians" size="md" />
                <Avatar fallback="Dev Titan" size="lg" />
                <Avatar fallback="Admin User" size="xl" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
