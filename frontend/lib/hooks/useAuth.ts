"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "../store";
import {
  loginUser,
  verifyOtpAndRegister,
  sendOTP,
  getCurrentUser,
  logoutUser,
  refreshToken,
  updateUser,
  setError,
  clearAuth,
} from "@/lib/redux/authSlice";
import { LoginRequest, OTPRequest, User } from "@/types/auth";
import { showToast } from "@/lib/utils/toastHelper";
import { useCallback } from "react"; // Import useCallback

const ROLE_ROUTES: Record<string, string> = {
  guide: "/dashboard/guide",
  admin: "/dashboard/admin",
  manager: "/dashboard/admin",
  user: "/dashboard/user",
};

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const login = useCallback(async (credentials: LoginRequest) => {
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.data?.role ?? "user";
      showToast.success(
        `Welcome back, ${result.payload.data?.name || "User"}!`
      );
      router.push(ROLE_ROUTES[role] ?? "/dashboard");
    } else {
      showToast.error((result.payload as string) || "Login failed");
    }
    return result;
  }, [dispatch, router]);

  const sendOtp = useCallback(async (data: OTPRequest) => {
    const result = await dispatch(sendOTP(data));
    if (sendOTP.fulfilled.match(result)) {
      showToast.success("OTP sent successfully to your email!");
    } else {
      showToast.error((result.payload as string) || "Failed to send OTP");
    }
    return result;
  }, [dispatch]);

  const verifyAndRegister = useCallback(async (formData: FormData) => {
    const result = await dispatch(verifyOtpAndRegister(formData));
    if (verifyOtpAndRegister.fulfilled.match(result)) {
      showToast.success("Registration successful! Please login to continue.");
    } else {
      showToast.error((result.payload as string) || "Registration failed");
    }
    return result;
  }, [dispatch]);

  const fetchCurrentUser = useCallback(async () => {
    // This function should only fetch the user, not handle redirects.
    // Page-level protection should handle redirects.
    return dispatch(getCurrentUser());
  }, [dispatch]);

  const refresh = useCallback(async () => {
    return dispatch(refreshToken());
  }, [dispatch]);

  const logout = useCallback(async () => {
    await dispatch(logoutUser());
    showToast.info("Logged out successfully. See you soon!");
    router.push("/login");
  }, [dispatch, router]);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    sendOtp,
    verifyAndRegister,
    fetchCurrentUser,
    refresh,
    logout,
    clearAuthError: () => dispatch(setError(null)),
    updateAuthUser: (data: Partial<User>) => dispatch(updateUser(data)),
    clearAuth: () => dispatch(clearAuth()),
  };
};