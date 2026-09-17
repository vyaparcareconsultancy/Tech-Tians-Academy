"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, Lock, ArrowRight } from "lucide-react";
import { Input, PasswordInput, Button, useToast } from "@/components/ui";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

// Validation Schemas
const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number starting with 6-9"),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type PhoneFormValues = z.infer<typeof phoneSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { success, error, info } = useToast();
  const { login } = useAuthStore();
  const [authMethod, setAuthMethod] = React.useState<"email" | "phone">("email");

  // Email form
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Phone form
  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors, isSubmitting: isPhoneSubmitting },
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  // Handle Email + Password Submission
  const onEmailLogin = async (data: EmailFormValues) => {
    try {
      const response = await api.post<{
        accessToken: string;
        refreshToken?: string;
        user?: any;
      }>("/auth/login", {
        identifier: data.email,
        password: data.password,
      });

      login({
        accessToken: response.accessToken || "mock_token_" + Date.now(),
        user: response.user,
      });

      success("Welcome Back!", "Redirecting to your student dashboard...");
      router.push("/dashboard");
    } catch (err: any) {
      // Keep form filled and display message from API
      const errorMsg =
        err?.data?.message || err?.message || "Invalid email or password. Please try again.";
      error("Authentication Failed", errorMsg);
    }
  };

  // Handle Phone + OTP routing
  const onPhoneLogin = async (data: PhoneFormValues) => {
    try {
      info("Sending OTP", `Requesting verification code for +91 ${data.phone}...`);
      // Route to OTP screen with phone parameter
      router.push(`/otp?phone=${encodeURIComponent(data.phone)}`);
    } catch (err: any) {
      error("Error", err?.message || "Failed to initiate phone verification.");
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2 text-left">
        <h1 className="text-h2 font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-body-sm text-muted-foreground">
          Enter your registered credentials to access your courses and live batches.
        </p>
      </div>

      {/* Tabbed Toggle: Email | Phone */}
      <div className="flex rounded-lg border border-border bg-muted p-1">
        <button
          type="button"
          onClick={() => setAuthMethod("email")}
          className={`flex-1 rounded-md py-2 text-body-sm font-medium transition-all ${
            authMethod === "email"
              ? "bg-card text-foreground shadow-sm font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Email & Password
        </button>
        <button
          type="button"
          onClick={() => setAuthMethod("phone")}
          className={`flex-1 rounded-md py-2 text-body-sm font-medium transition-all ${
            authMethod === "phone"
              ? "bg-card text-foreground shadow-sm font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Phone & OTP
        </button>
      </div>

      {/* Form Content */}
      {authMethod === "email" ? (
        <form onSubmit={handleEmailSubmit(onEmailLogin)} className="space-y-4 text-left">
          <Input
            label="Email Address"
            type="email"
            placeholder="student@tians.academy"
            autoComplete="email"
            required
            leftIcon={<Mail className="h-4 w-4" />}
            error={emailErrors.email?.message}
            {...registerEmail("email")}
          />

          <PasswordInput
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            error={emailErrors.password?.message}
            {...registerEmail("password")}
          />

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-caption text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border text-brand-blue focus:ring-brand-blue"
                {...registerEmail("rememberMe")}
              />
              <span>Remember me</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-caption font-medium text-brand-blue transition hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isEmailSubmitting}
            disabled={isEmailSubmitting}
            className="shadow-brand"
          >
            Sign In with Email
          </Button>
        </form>
      ) : (
        <form onSubmit={handlePhoneSubmit(onPhoneLogin)} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="block text-body-sm font-medium text-foreground">
              Mobile Number <span className="text-danger">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-3 flex items-center gap-1.5 text-muted-foreground text-body-sm font-medium">
                <Phone className="h-4 w-4" />
                <span>+91</span>
                <span className="text-border">|</span>
              </div>
              <input
                type="tel"
                maxLength={10}
                placeholder="9876543210"
                className="flex h-10 w-full rounded-md border border-border bg-background py-2 pl-20 pr-3 text-body text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:border-brand-blue"
                {...registerPhone("phone")}
              />
            </div>
            {phoneErrors.phone?.message && (
              <p className="text-caption text-danger">{phoneErrors.phone.message}</p>
            )}
            <p className="text-caption text-muted-foreground">
              We will send a 6-digit one-time verification code via SMS.
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isPhoneSubmitting}
            disabled={isPhoneSubmitting}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="shadow-brand"
          >
            Login with OTP
          </Button>
        </form>
      )}

      {/* Divider */}
      <div className="relative flex items-center justify-center py-2">
        <div className="w-full border-t border-border" />
        <span className="absolute bg-background px-3 text-caption uppercase text-muted-foreground">
          or continue with
        </span>
      </div>

      {/* Social Google Sign-In Button (UI only) */}
      <Button
        type="button"
        variant="outline"
        size="lg"
        fullWidth
        onClick={() => info("Google Sign-In", "Single Sign-On authentication is coming in the next release.")}
        leftIcon={
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
          </svg>
        }
      >
        Continue with Google
      </Button>

      {/* Footer Text */}
      <p className="text-center text-body-sm text-muted-foreground">
        New to Tech Tians?{" "}
        <Link
          href="/signup"
          className="font-semibold text-brand-blue transition hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
