"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { OtpVerification } from "@/components/shared";
import { useToast } from "@/components/ui";
import { useAuthStore } from "@/store/auth";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success } = useToast();
  const { login } = useAuthStore();

  const phoneParam = searchParams.get("phone");
  const emailParam = searchParams.get("email");

  const identifier = phoneParam || emailParam || "9876543210";
  const type: "phone" | "email" = emailParam ? "email" : "phone";

  const handleVerified = (data?: any) => {
    login({
      accessToken: data?.accessToken || "tok_" + Date.now(),
      user: data?.user || {
        id: "student-1",
        name: "Student",
        email: emailParam || "student@tians.academy",
        role: "student",
        createdAt: new Date().toISOString(),
      },
    });

    success("Verification Successful", "Welcome back to Tech Tians Academy.");
    router.push("/dashboard");
  };

  return (
    <div className="w-full space-y-6 text-left">
      <div className="space-y-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-caption font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to login</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h1 className="text-h2 font-bold tracking-tight text-foreground">
            Two-Step Verification
          </h1>
        </div>

        <p className="text-body-sm text-muted-foreground">
          Enter the one-time security code sent to verify your identity.
        </p>
      </div>

      <OtpVerification
        identifier={identifier}
        type={type}
        onVerified={handleVerified}
        purpose="LOGIN"
        onChangeNumber={() => router.push("/login")}
      />
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-body-sm text-muted-foreground">
          Loading verification session...
        </div>
      }
    >
      <VerifyOtpContent />
    </React.Suspense>
  );
}
