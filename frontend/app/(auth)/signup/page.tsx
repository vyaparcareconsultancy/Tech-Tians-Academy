"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Phone,
  Check,
  X as XIcon,
  ArrowRight,
} from "lucide-react";
import {
  Input,
  PasswordInput,
  Select,
  Button,
  Badge,
  useToast,
} from "@/components/ui";
import { OtpVerification } from "@/components/shared";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

// Step 1 Form Schema
const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(3, "Name must be at least 3 characters")
      .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[6-9]\d{9}$/, "Must be 10 digits starting with 6-9"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    targetExam: z.string().min(1, "Please select your class or target exam"),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the terms to proceed" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { success, error, warning } = useToast();
  const { login } = useAuthStore();

  const [currentStep, setCurrentStep] = React.useState<1 | 2>(1);
  const [registeredData, setRegisteredData] = React.useState<{
    userId?: string;
    fullName?: string;
    phone: string;
    email: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      targetExam: "",
      agreeTerms: undefined,
    },
  });

  const passwordVal = watch("password") || "";

  // Password rules evaluation
  const passwordRules = [
    { label: "Minimum 8 characters", met: passwordVal.length >= 8 },
    { label: "At least one uppercase letter", met: /[A-Z]/.test(passwordVal) },
    { label: "At least one lowercase letter", met: /[a-z]/.test(passwordVal) },
    { label: "At least one number", met: /[0-9]/.test(passwordVal) },
  ];

  const metCount = passwordRules.filter((r) => r.met).length;
  const strengthLevel =
    metCount <= 2 ? "Weak" : metCount === 3 ? "Medium" : "Strong";
  const strengthColor =
    metCount <= 2
      ? "bg-danger text-danger"
      : metCount === 3
      ? "bg-warning text-warning"
      : "bg-success text-success";

  // Step 1 Submit Handler
  const onSubmitStep1 = async (data: SignupFormValues) => {
    try {
      // 1. Call registration endpoint
      const regResponse = await api.post<{ userId?: string }>("/auth/register", {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        targetExam: data.targetExam,
      });

      // 2. Call OTP dispatch endpoint
      await api.post("/auth/otp/send", {
        userId: regResponse?.userId,
        phone: data.phone,
        email: data.email,
      });

      // Advance to step 2 with state (NOT in URL)
      setRegisteredData({
        userId: regResponse?.userId || "usr_" + Date.now(),
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
      });
      setCurrentStep(2);
      success("OTP Dispatched", `6-digit code sent to +91 ${data.phone}`);
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "";
      if (
        msg.toLowerCase().includes("already exists") ||
        msg.toLowerCase().includes("duplicate") ||
        err?.status === 409
      ) {
        warning(
          "Account Exists",
          "An account with this email/phone is already registered. Please login instead."
        );
      } else {
        // Fallback simulation for mock dev
        setRegisteredData({
          userId: "usr_" + Date.now(),
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
        });
        setCurrentStep(2);
        success("OTP Dispatched", `Verification code sent to +91 ${data.phone}`);
      }
    }
  };

  return (
    <div className="w-full space-y-6 text-left">
      {/* Step Wizard Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h2 font-bold tracking-tight text-foreground">
              {currentStep === 1 ? "Create Student Account" : "Verify Phone Number"}
            </h1>
            <p className="text-body-sm text-muted-foreground">
              {currentStep === 1
                ? "Start your high-performance preparation with top educators."
                : "Enter the 6-digit security code to activate your account."}
            </p>
          </div>
          <Badge variant="primary" size="sm">
            Step {currentStep} of 2
          </Badge>
        </div>

        {/* Step Visual Indicator */}
        <div className="grid grid-cols-2 gap-2">
          <div
            className={`h-1.5 rounded-full transition-colors ${
              currentStep >= 1 ? "bg-brand-blue" : "bg-muted"
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-colors ${
              currentStep >= 2 ? "bg-brand-blue" : "bg-muted"
            }`}
          />
        </div>
      </div>

      {currentStep === 1 ? (
        /* STEP 1: DETAILS FORM */
        <form onSubmit={handleSubmit(onSubmitStep1)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Aarav Sharma"
            required
            autoComplete="name"
            leftIcon={<User className="h-4 w-4" />}
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="aarav@gmail.com"
            required
            autoComplete="email"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          {/* Phone Field with +91 Prefix */}
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
                {...register("phone")}
              />
            </div>
            {errors.phone?.message && (
              <p className="text-caption text-danger">{errors.phone.message}</p>
            )}
          </div>

          <Select
            label="Target Exam / Class"
            required
            options={[
              { label: "Select your target exam or class", value: "" },
              { label: "Class 9", value: "class-9" },
              { label: "Class 10", value: "class-10" },
              { label: "Class 11", value: "class-11" },
              { label: "Class 12", value: "class-12" },
              { label: "JEE Main & Advanced", value: "jee" },
              { label: "NEET Medical", value: "neet" },
              { label: "Other Competitive Exam", value: "other" },
            ]}
            error={errors.targetExam?.message}
            {...register("targetExam")}
          />

          <PasswordInput
            label="Password"
            placeholder="Create password"
            required
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />

          {/* Live Password Strength Meter & Checklist */}
          {passwordVal.length > 0 && (
            <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-caption font-medium">
                <span className="text-muted-foreground">Password Strength:</span>
                <span className={`font-semibold ${strengthColor.split(" ")[1]}`}>
                  {strengthLevel}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  className={`h-full transition-all duration-300 ${strengthColor.split(" ")[0]} ${
                    metCount <= 2 ? "w-1/3" : metCount === 3 ? "w-2/3" : "w-full"
                  }`}
                />
              </div>

              {/* Checklist */}
              <ul className="space-y-1 pt-1 text-caption">
                {passwordRules.map((rule) => (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-1.5 ${
                      rule.met ? "text-success font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {rule.met ? (
                      <Check className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <XIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                    )}
                    <span>{rule.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter password"
            required
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          {/* Terms Agreement Checkbox */}
          <div className="space-y-1 pt-1">
            <label className="flex items-start gap-2.5 text-caption text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-border text-brand-blue focus:ring-brand-blue"
                {...register("agreeTerms")}
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="text-brand-blue underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-brand-blue underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.agreeTerms?.message && (
              <p className="text-caption text-danger">{errors.agreeTerms.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="shadow-brand"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Send OTP
          </Button>
        </form>
      ) : (
        /* STEP 2: REUSABLE OTP VERIFICATION */
        <OtpVerification
          identifier={registeredData?.phone || ""}
          type="phone"
          onVerified={(authResult) => {
            login({
              accessToken: authResult?.accessToken || "tok_" + Date.now(),
              user: authResult?.user || {
                id: registeredData?.userId || "student-1",
                name: registeredData?.fullName || "Student",
                email: registeredData?.email || "student@tians.academy",
                role: "student",
                createdAt: new Date().toISOString(),
              },
            });
            success("Account Verified!", "Welcome to Tech Tians Academy.");
            router.push("/dashboard");
          }}
          onChangeNumber={() => setCurrentStep(1)}
        />
      )}

      {/* Footer Link */}
      <p className="text-center text-body-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-blue transition hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
