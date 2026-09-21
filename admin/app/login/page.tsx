"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ShieldCheck, GraduationCap, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid work email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const [authError, setAuthError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@techtians.com",
      password: "password123",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError(null);
    try {
      const user = await login(data);
      addToast({
        type: "success",
        title: `Welcome back, ${user.name}!`,
        message: `Logged in as ${user.role.toUpperCase()}`,
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Invalid credentials. Please try again.";
      setAuthError(message);
      addToast({
        type: "error",
        title: "Login Failed",
        message,
      });
    }
  };

  // Quick switcher for demo testing
  const fillCredentials = (role: "admin" | "teacher") => {
    if (role === "admin") {
      setValue("email", "admin@techtians.com");
      setValue("password", "adminPass123!");
    } else {
      setValue("email", "teacher@techtians.com");
      setValue("password", "teacherPass123!");
    }
    setAuthError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/30 dark:from-brand-navy-dark dark:via-brand-navy dark:to-brand-navy-light relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-white dark:bg-brand-navy rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-cyan text-white shadow-lg mb-2">
              <span className="text-2xl font-black">TT</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Tech Tians Academy
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Admin & Faculty Portal Access
            </p>
          </div>

          {/* Quick Demo Switcher */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Quick Test Credential:</span>
              <span className="text-[10px] uppercase font-bold text-brand-cyan-dark">Mock Mode</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials("admin")}
                className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 hover:border-brand-blue border border-slate-200 dark:border-slate-600 transition-all text-slate-800 dark:text-slate-200 shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-brand-blue" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("teacher")}
                className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 hover:border-brand-cyan border border-slate-200 dark:border-slate-600 transition-all text-slate-800 dark:text-slate-200 shadow-xs"
              >
                <GraduationCap className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Teacher</span>
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {authError && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              placeholder="name@techtians.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-brand-blue focus:ring-brand-blue dark:bg-slate-800"
                />
                <span>Remember this device</span>
              </label>
              <a href="#" className="hover:text-brand-blue underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Security note */}
          <div className="pt-2 text-center text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
            Protected by Tech Tians Enterprise Auth • Role-based access control
          </div>
        </div>
      </div>
    </div>
  );
}
