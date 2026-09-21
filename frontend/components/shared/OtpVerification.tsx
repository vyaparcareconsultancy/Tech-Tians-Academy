"use client";

import * as React from "react";
import { RefreshCw, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { api, USE_MOCK } from "@/lib/api";
import { cn } from "@/lib/utils";

export interface OtpVerificationProps {
  identifier: string;
  type?: "phone" | "email";
  /** Must match the purpose used when the OTP was sent (backend OtpPurpose enum) */
  purpose?: "SIGNUP" | "LOGIN" | "RESET_PASSWORD";
  onVerified: (data?: any) => void;
  length?: number;
  onChangeNumber?: () => void;
  className?: string;
}

export function OtpVerification({
  identifier,
  type = "phone",
  purpose = "SIGNUP",
  onVerified,
  length = 6,
  onChangeNumber,
  className,
}: OtpVerificationProps) {
  const [digits, setDigits] = React.useState<string[]>(Array(length).fill(""));
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // Resend Timer & Attempts
  const [secondsRemaining, setSecondsRemaining] = React.useState(30);
  const [resendAttempts, setResendAttempts] = React.useState(0);
  const [isResending, setIsResending] = React.useState(false);

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Masking format
  const maskedIdentifier = React.useMemo(() => {
    if (type === "phone" || /^\d+$/.test(identifier.replace(/\D/g, ""))) {
      const clean = identifier.replace(/\D/g, "");
      const lastFour = clean.slice(-4) || "••••";
      return `+91 ••••• •${lastFour}`;
    }
    const [local, domain] = identifier.split("@");
    if (!domain) return identifier;
    const first = local[0] || "•";
    const last = local.length > 1 ? local[local.length - 1] : "";
    return `${first}•••••${last}@${domain}`;
  }, [identifier, type]);

  // Countdown timer with unmount cleanup
  React.useEffect(() => {
    if (secondsRemaining <= 0 || resendAttempts >= 3) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining, resendAttempts]);

  // Auto-focus the first slot on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Verification execution
  const executeVerify = React.useCallback(
    async (code: string) => {
      if (code.length < length || isVerifying) return;

      setIsVerifying(true);
      setHasError(false);
      setErrorMessage("");

      try {
        // Backend returns { verified: true, message } — tokens come from login/register
        const response = await api.post<{
          verified?: boolean;
          message?: string;
          accessToken?: string;
          refreshToken?: string;
          user?: any;
        }>("/auth/otp/verify", {
          identifier,
          otp: code,
          purpose,
        });

        // Trigger success state
        setIsSuccess(true);
        setTimeout(() => {
          onVerified(response);
        }, 500);
      } catch (err: any) {
        if (!USE_MOCK) {
          setHasError(true);
          setErrorMessage(err?.message || "Invalid OTP, please try again");
          setDigits(Array(length).fill(""));
          inputRefs.current[0]?.focus();
          return;
        }
        // Fallback simulation for offline / mock testing: '123456' or any valid mock
        if (code === "000000") {
          setHasError(true);
          setErrorMessage("Invalid OTP, please try again");
          setDigits(Array(length).fill(""));
          inputRefs.current[0]?.focus();
        } else {
          // Success simulation in mock mode or error handling
          setIsSuccess(true);
          setTimeout(() => {
            onVerified({
              accessToken: "tok_" + Date.now(),
              user: {
                id: "usr_" + Date.now(),
                name: "Student",
                email: type === "email" ? identifier : "student@tians.academy",
                role: "student",
                createdAt: new Date().toISOString(),
              },
            });
          }, 500);
        }
      } finally {
        setIsVerifying(false);
      }
    },
    [identifier, length, isVerifying, onVerified, type, purpose]
  );

  // Single digit input
  const handleChange = (index: number, val: string) => {
    if (isVerifying || isSuccess) return;

    // Only allow single numeric digit
    const cleanDigit = val.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanDigit;
    setDigits(newDigits);
    setHasError(false);

    if (cleanDigit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when last digit is filled
    const fullCode = newDigits.join("");
    if (fullCode.length === length) {
      executeVerify(fullCode);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isVerifying || isSuccess) return;

    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Paste support
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (isVerifying || isSuccess) return;
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pastedData) return;

    const newDigits = Array(length).fill("");
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setDigits(newDigits);
    setHasError(false);

    const nextFocusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextFocusIndex]?.focus();

    if (pastedData.length === length) {
      executeVerify(pastedData);
    }
  };

  // Resend OTP handler
  const handleResend = async () => {
    if (secondsRemaining > 0 || resendAttempts >= 3 || isResending) return;

    setIsResending(true);
    try {
      await api.post("/auth/otp/send", {
        identifier,
        purpose,
      });
      setResendAttempts((prev) => prev + 1);
      setSecondsRemaining(30);
      setDigits(Array(length).fill(""));
      setHasError(false);
      setErrorMessage("");
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      if (!USE_MOCK) {
        setHasError(true);
        setErrorMessage(err?.message || "Could not resend OTP. Please wait and try again.");
        return;
      }
      // Simulate success in mock mode
      setResendAttempts((prev) => prev + 1);
      setSecondsRemaining(30);
    } finally {
      setIsResending(false);
    }
  };

  const timerDisplay = `0:${String(secondsRemaining).padStart(2, "0")}`;

  return (
    <div className={cn("w-full space-y-6 text-left", className)}>
      {/* Header Info */}
      <div className="space-y-1 text-center">
        <p className="text-body-sm text-muted-foreground">
          We sent a verification code to{" "}
          <span className="font-mono font-bold text-foreground">
            {maskedIdentifier}
          </span>
        </p>

        {onChangeNumber && (
          <button
            type="button"
            onClick={onChangeNumber}
            disabled={isVerifying}
            className="text-caption font-medium text-brand-blue hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue rounded px-1"
          >
            Change {type === "phone" ? "number" : "email"}
          </button>
        )}
      </div>

      {/* Input Slots */}
      <div className="space-y-3">
        <div
          className={cn(
            "flex justify-center gap-2 sm:gap-3",
            hasError && "animate-shake"
          )}
        >
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              disabled={isVerifying}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              aria-label={`Digit ${index + 1} of ${length}`}
              className={cn(
                "h-13 w-11 sm:h-14 sm:w-12 text-center text-h3 font-mono font-bold rounded-lg border bg-background text-foreground transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:border-brand-blue",
                "disabled:opacity-50 disabled:cursor-not-allowed select-none",
                !hasError && !isSuccess && "border-border",
                hasError && "border-danger text-danger focus-visible:ring-danger focus-visible:border-danger",
                isSuccess && "border-success text-success bg-success/5"
              )}
            />
          ))}
        </div>

        {/* Error / Success Feedback */}
        {hasError && (
          <div className="flex items-center justify-center gap-1.5 text-caption font-medium text-danger animate-in fade-in">
            <AlertCircle className="h-4 w-4" />
            <span>{errorMessage || "Invalid OTP, please try again"}</span>
          </div>
        )}

        {isSuccess && (
          <div className="flex items-center justify-center gap-1.5 text-caption font-medium text-success animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" />
            <span>Code verified! Completing registration...</span>
          </div>
        )}
      </div>

      {/* Timer & Resend Controls */}
      <div className="flex items-center justify-center text-caption text-muted-foreground">
        {resendAttempts >= 3 ? (
          <span className="font-medium text-danger">
            Too many attempts, try again later
          </span>
        ) : secondsRemaining > 0 ? (
          <span>
            Resend code in{" "}
            <strong className="font-mono text-foreground font-semibold">
              {timerDisplay}
            </strong>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || isVerifying}
            className="inline-flex items-center gap-1.5 font-semibold text-brand-blue hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue rounded px-1"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isResending && "animate-spin")} />
            <span>Resend OTP</span>
          </button>
        )}
      </div>

      {/* Manual Submit Button */}
      <Button
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isVerifying}
        disabled={isVerifying || isSuccess || digits.join("").length < length}
        onClick={() => executeVerify(digits.join(""))}
        className="shadow-brand"
        rightIcon={
          isSuccess ? (
            <CheckCircle2 className="h-4 w-4 text-white" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )
        }
      >
        {isSuccess ? "Verified" : "Verify & Continue"}
      </Button>
    </div>
  );
}
