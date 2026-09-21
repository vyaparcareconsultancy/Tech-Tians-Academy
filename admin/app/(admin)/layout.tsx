import { AppShell } from "@/components/layout/AppShell";

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell defaultRole="admin">{children}</AppShell>;
}
