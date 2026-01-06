"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [userType, setUserType] = useState<"user" | "guide" | "">("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // The useAuth hook provides all necessary functions and state
  const { sendOtp, verifyAndRegister, loading, clearAuthError } = useAuth();

  useEffect(() => {
    // Clear any previous auth errors when the component loads
    clearAuthError();
  }, [clearAuthError]);

  useEffect(() => {
    // Auto-focus the first OTP input when the view changes
    if (step === 2 && otpRefs.current[0]) {
      const timer = setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOtpChange = (index: number, value: string) => {
    // Get only the last character typed (in case of multiple characters)
    const digit = value.slice(-1);

    // Handle empty value (deletion)
    if (!digit) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // Only allow numbers
    if (!/^\d$/.test(digit)) return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-move to next input when a digit is entered
    if (index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const key = e.key;

    // Handle number keys directly
    if (/^\d$/.test(key)) {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = key;
      setOtp(newOtp);

      // Move to next input
      if (index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
      return;
    }

    // Handle backspace
    if (key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      if (otp[index]) {
        // Clear current input if it has value
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input and clear it
        newOtp[index - 1] = "";
        setOtp(newOtp);
        otpRefs.current[index - 1]?.focus();
      }
      return;
    }

    // Handle Delete key
    if (key === "Delete") {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // Handle left arrow key
    if (key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      otpRefs.current[index - 1]?.focus();
      return;
    }

    // Handle right arrow key
    if (key === "ArrowRight" && index < 5) {
      e.preventDefault();
      otpRefs.current[index + 1]?.focus();
      return;
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Only accept 6-digit numbers
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      // Focus the last input
      setTimeout(() => {
        otpRefs.current[5]?.focus();
      }, 10);
    } else {
      toast.error("Please paste a valid 6-digit OTP");
    }
  };

  const validateStep1 = (): boolean => {
    if (!userType) {
      toast.error("Please select an account type: Tourist or Tour Guide.");
      return false;
    }
    if (!formData.name.trim()) {
      toast.error("Please enter your full name.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    // ✅ STEP 2: Add validation for the mobile number
    if (!formData.mobile.trim()) {
      toast.error("Please enter your mobile number.");
      return false;
    }
    if (!/^\d{10,}$/.test(formData.mobile.trim())) {
      toast.error("Please enter a valid 10-digit (or more) mobile number.");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }
    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSendOTP = async () => {
    if (!validateStep1()) return;

    const result = await sendOtp({ email: formData.email });
    if (result.meta.requestStatus === "fulfilled") {
      setStep(2);
    }
  };

  const handleVerifyAndRegister = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("otp", otpValue);
    formDataToSend.append("role", userType);
    formDataToSend.append("mobile", formData.mobile);

    const result = await verifyAndRegister(formDataToSend);

    if (result.meta.requestStatus === "fulfilled") {
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    }
  };

  const handleResendOTP = async () => {
    const result = await sendOtp({ email: formData.email });
    if (result.meta.requestStatus === "fulfilled") {
      setOtp(new Array(6).fill(""));
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 150);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-8 border border-border animate-scale-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Create an Account
        </h1>
        <p className="text-muted-foreground">
          Join our community of travelers and guides.
        </p>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              I am registering as a:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={userType === "user" ? "default" : "outline"}
                onClick={() => setUserType("user")}
                disabled={loading}
              >
                Tourist
              </Button>
              <Button
                type="button"
                variant={userType === "guide" ? "default" : "outline"}
                onClick={() => setUserType("guide")}
                disabled={loading}
              >
                Tour Guide
              </Button>
            </div>
          </div>
          <Input
            name="name"
            placeholder="Full Name *"
            value={formData.name}
            onChange={handleInputChange}
            disabled={loading}
          />
          <Input
            name="email"
            type="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
          />
          <Input
            name="mobile"
            type="tel" // Use "tel" for better mobile keyboard experience
            placeholder="Mobile Number *"
            value={formData.mobile}
            onChange={handleInputChange}
            disabled={loading}
          />
          <Input
            name="password"
            type="password"
            placeholder="Create Password *"
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="Confirm Password *"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="button"
            onClick={handleSendOTP}
            disabled={loading || !userType}
            className="w-full"
            size="lg"
          >
            {loading ? "Sending OTP..." : "Continue"}
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 text-center">
          <h3 className="text-lg font-medium text-foreground">
            Verify Your Email
          </h3>
          <p className="text-sm text-muted-foreground">
            A 6-digit code was sent to <strong>{formData.email}</strong>
          </p>
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  otpRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                onPaste={index === 0 ? handleOtpPaste : undefined}
                className="w-12 h-14 text-center text-lg font-semibold border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
                autoComplete="off"
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>
          <div className="space-y-3">
            <Button
              type="button"
              onClick={handleVerifyAndRegister}
              disabled={loading || otp.join("").length !== 6}
              className="w-full"
              size="lg"
            >
              {loading ? "Verifying..." : "Create Account"}
            </Button>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <span className="text-muted-foreground">
                Didn't receive code?
              </span>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-primary hover:underline font-medium disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => {
              setStep(1);
              setOtp(new Array(6).fill(""));
            }}
            variant="link"
            disabled={loading}
          >
            Go Back
          </Button>
        </div>
      )}

      <p className="mt-8 text-center text-muted-foreground text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary hover:underline font-medium"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
