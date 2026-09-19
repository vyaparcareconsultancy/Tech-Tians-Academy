import * as React from "react";
import { PageContainer } from "@/components/layout";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageContainer>{children}</PageContainer>;
}
