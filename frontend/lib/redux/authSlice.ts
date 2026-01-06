// lib/redux/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../service/api";
import {
  AuthState,
  LoginRequest,
  OTPRequest,
  User,
  AuthResponse,
} from "@/types/auth";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const handleError = (err: any) =>
  err.response?.data?.message || err.message || "An error occurred";

// --- Thunks ---

// Login
export const loginUser = createAsyncThunk<AuthResponse, LoginRequest>(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await apiService.post("/api/auth/login", credentials);
      if (!result.success) return rejectWithValue(result.message);
      return result;
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

// Send OTP
export const sendOTP = createAsyncThunk<AuthResponse, OTPRequest>(
  "auth/sendOTP",
  async (data, { rejectWithValue }) => {
    try {
      const result = await apiService.post("/api/auth/send-otp", data);
      if (!result.success) return rejectWithValue(result.message);
      return result;
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

// Verify OTP and Register
export const verifyOtpAndRegister = createAsyncThunk<AuthResponse, FormData>(
  "auth/verifyOtpAndRegister",
  async (formData, { rejectWithValue }) => {
    try {
      const result = await apiService.post("/api/auth/verify-otp", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!result.success) return rejectWithValue(result.message);
      return result;
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

// Get current user - Updated with better error handling
export const getCurrentUser = createAsyncThunk<AuthResponse>(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const result = await apiService.get("/api/auth/me");
      if (!result.success) return rejectWithValue(result.message);
      return result;
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

// Refresh token
export const refreshToken = createAsyncThunk<AuthResponse>(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const result = await apiService.post("/api/auth/refresh");
      if (!result.success) return rejectWithValue(result.message);
      return result;
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk<void, void>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await apiService.post("/api/auth/logout");
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

// --- Slice ---
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) state.user = { ...state.user, ...action.payload };
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    // New reducer for setting auth state from external sources
    setAuthState: (
      state,
      action: PayloadAction<{ user: User; isAuthenticated: boolean }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setPending = (state: AuthState) => {
      state.loading = true;
      state.error = null;
    };
    const setRejected = (state: AuthState, action: any) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    // Login
    builder
      .addCase(loginUser.pending, setPending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, setRejected);

    // Send OTP
    builder
      .addCase(sendOTP.pending, setPending)
      .addCase(sendOTP.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(sendOTP.rejected, setRejected);

    // Verify OTP and Register
    builder
      .addCase(verifyOtpAndRegister.pending, setPending)
      .addCase(verifyOtpAndRegister.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyOtpAndRegister.rejected, setRejected);

    // Get Current User
    builder
      .addCase(getCurrentUser.pending, setPending)
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = null; // Don't show error for failed auth checks
        state.isAuthenticated = false;
        state.user = null;
      });

    // Refresh Token
    builder
      .addCase(refreshToken.pending, (state) => {
        // Don't set loading for silent refresh
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload.data || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Still clear auth state even if logout failed
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setError, updateUser, clearAuth, clearAuthError, setAuthState } =
  authSlice.actions;
export default authSlice.reducer;
