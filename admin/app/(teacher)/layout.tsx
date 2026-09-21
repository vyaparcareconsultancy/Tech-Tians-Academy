import { AppShell } from "@/components/layout/AppShell";

export default function TeacherGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell defaultRole="teacher">{children}</AppShell>;
}
