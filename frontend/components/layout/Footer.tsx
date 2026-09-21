import * as React from "react";
import Link from "next/link";
import { Container } from "./Container";

const FOOTER_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Courses", href: "/courses" },
  { label: "Profile", href: "/profile" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 text-caption text-muted-foreground sm:flex-row">
        <div className="flex flex-col items-center gap-1 sm:items-start text-center sm:text-left">
          <p className="text-body-sm font-semibold text-foreground">Tech Tians Academy</p>
          <p>Next-generation learning platform for engineering cohorts and masterclasses.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p>© {new Date().getFullYear()} Tech Tians Academy. All rights reserved.</p>
      </Container>
    </footer>
  );
}
