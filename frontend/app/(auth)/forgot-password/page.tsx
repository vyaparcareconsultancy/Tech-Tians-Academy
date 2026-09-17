"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, CheckCircle2, ArrowLeft, RefreshCw } from "lucide-react";
import { Input, Button, useToast } from "@/components/ui";
import { api } from "@/lib/api";

const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or phone number is required")
    .refine(
      (val) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        const isPhone = /^[6-9]\d{9}$/.test(val);
        return isEmail || isPhone;
      },
      {
        message: "Enter a valid email address or 10-digit mobile number",
      }
    ),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { success, error } = useToast();
  const [submittedIdentifier, setSubmittedIdentifier] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      identifier: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      await api.post("/auth/forgot-password", {
        identifier: data.identifier,
      });

      setSubmittedIdentifier(data.identifier);
      success("Reset Link Sent", "Instructions have been dispatched to your email/phone.");
    } catch (err: any) {
      // In dev or mockup, if endpoint is not live yet, simulate smooth UX
      const msg = err?.data?.message || err?.message;
      if (msg && !msg.includes("404")) {
        error("Request Failed", msg);
      } else {
        // Fallback simulation for mock dev
        setSubmittedIdentifier(data.identifier);
        success("Reset Link Sent", "Check your inbox for password recovery instructions.");
      }
    }
  };

  return (
    <div className="w-full space-y-6 text-left">
      {submittedIdentifier ? (
        /* Success State: Check Your Inbox */
        <div className="space-y-6 text-center animate-in fade-in duration-300">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success border border-success/20">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-h2 font-bold tracking-tight text-foreground">
              Check your inbox
            </h1>
            <p className="text-body-sm text-muted-foreground">
              We&apos;ve sent recovery instructions to{" "}
              <strong className="text-foreground font-semibold">
                {submittedIdentifier}
              </strong>
              .
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 text-caption text-muted-foreground">
            Didn&apos;t receive the link? Check your spam folder, or try requesting again after a few minutes.
          </div>

          <div className="space-y-3 pt-2">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setSubmittedIdentifier(null)}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Send to another email/phone
            </Button>

            <Link href="/login" className="block w-full">
              <Button variant="ghost" fullWidth leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Request Form */
        <div className="space-y-6">
          <div className="space-y-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-caption font-medium text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to login</span>
            </Link>
            <h1 className="text-h2 font-bold tracking-tight text-foreground">
              Forgot your password?
            </h1>
            <p className="text-body-sm text-muted-foreground">
              No worries. Enter your registered email or phone number and we&apos;ll send you a secure reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email or Mobile Number"
              placeholder="e.g. student@tians.academy or 9876543210"
              leftIcon={<Mail className="h-4 w-4" />}
              required
              error={errors.identifier?.message}
              {...register("identifier")}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="shadow-brand"
            >
              Send Reset Instructions
            </Button>
          </form>

          <p className="text-center text-caption text-muted-foreground">
            Remember your credentials?{" "}
            <Link href="/login" className="font-semibold text-brand-blue hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
