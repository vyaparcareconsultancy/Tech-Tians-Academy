"use client";

import * as React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import { Container } from "./Container";
import { Input, Button, useToast } from "@/components/ui";

export function Footer() {
  const [email, setEmail] = React.useState("");
  const { success } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    success("Subscribed!", "You have joined the Tech Tians newsletter.");
    setEmail("");
  };

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "All Courses", href: "/courses" },
    { label: "Practice Tests", href: "/tests" },
    { label: "Doubt Resolution", href: "/doubts" },
    { label: "Live Masterclasses", href: "/live" },
  ];

  const courseTracks = [
    { label: "Frontend Engineering", href: "/courses#frontend" },
    { label: "Full Stack Architecture", href: "/courses#fullstack" },
    { label: "Distributed Systems", href: "/courses#systems" },
    { label: "Data Structures & Algos", href: "/courses#dsa" },
    { label: "Cloud Infrastructure", href: "/courses#cloud" },
  ];

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: About & Socials */}
          <div className="space-y-4 text-left">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-md"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-navy text-white shadow-sm">
                <GraduationCap className="h-5 w-5 text-brand-cyan" />
              </div>
              <span className="text-h4 font-bold tracking-tight text-foreground">
                Tech Tians Academy
              </span>
            </Link>

            <p className="text-body-sm text-muted-foreground leading-relaxed">
              Empowering engineers and students worldwide with industry-aligned curriculum, interactive live sessions, and practical real-world capstone projects.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4 text-left">
            <h3 className="text-body font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2.5 text-body-sm text-muted-foreground">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition hover:text-brand-blue"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Courses */}
          <div className="space-y-4 text-left">
            <h3 className="text-body font-semibold text-foreground">Popular Tracks</h3>
            <ul className="space-y-2.5 text-body-sm text-muted-foreground">
              {courseTracks.map((track) => (
                <li key={track.label}>
                  <Link
                    href={track.href}
                    className="transition hover:text-brand-blue"
                  >
                    {track.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="space-y-4 text-left">
            <h3 className="text-body font-semibold text-foreground">Stay Connected</h3>
            <p className="text-body-sm text-muted-foreground">
              Subscribe to get weekly engineering tutorials, release updates, and scholarship alerts.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-9 text-body-sm"
                />
                <Button type="submit" size="sm" className="shrink-0">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </form>

            <div className="space-y-2 pt-2 text-caption text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-brand-blue" />
                <span>support@tians.academy</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-brand-blue" />
                <span>+1 (800) 555-TIAN</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-brand-blue" />
                <span>Bengaluru, India & San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-caption text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Tech Tians Academy. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="transition hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/cookies" className="transition hover:text-foreground">
              Cookie Preferences
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
