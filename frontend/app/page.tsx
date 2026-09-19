import type { Metadata } from "next";
import { LandingSections } from "@/components/landing/LandingSections";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${APP_NAME} - Online Coaching for Engineering & Coding`,
  description:
    "India's premier online coaching platform for engineering, coding, and competitive exams. Live interactive cohorts, recorded HD lectures, mock tests, and 24/7 doubt solving.",
  keywords: [
    "Tech Tians Academy",
    "online coaching",
    "engineering courses",
    "live classes",
    "mock tests",
    "doubt solving",
    "coding bootcamp",
    "system architecture",
  ],
  openGraph: {
    title: `${APP_NAME} - Master Engineering & Modern Coding`,
    description:
      "Join 10,000+ students learning with live interactive classes, AI mock test analysis, and 24/7 doubt resolution.",
    url: "https://techtians.academy",
    siteName: APP_NAME,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - Master Engineering & Modern Coding`,
    description:
      "Join 10,000+ students learning with live interactive classes, AI mock test analysis, and 24/7 doubt resolution.",
  },
};

export default function HomePage() {
  return <LandingSections />;
}
