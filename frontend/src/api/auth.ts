import axios, { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loginSchema,
  refreshSchema,
  logoutSchema,
  forgotSchema,
  resetSchema,
  AuthResponse,
  LoginInput,
  RefreshTokenInput,
  LogoutInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ListSessionsResponse,
} from "../lib/validations/auth";

// Create axios instance
const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: parseInt((import.meta as any).env.VITE_API_TIMEOUT || "30000"),
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(
          `${(import.meta as any).env.VITE_API_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (error) {
        // Redirect to login on refresh failure
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// ============ API ENDPOINTS ============

// Login
export const login = async (data: LoginInput): Promise<AuthResponse> => {
  const validatedData = loginSchema.parse(data);
  const response = await api.post<AuthResponse>("/auth/login", validatedData);
  return response.data;
};

// Refresh Token
export const refreshToken = async (
  data: RefreshTokenInput
): Promise<AuthResponse> => {
  const validatedData = refreshSchema.parse(data);
  const response = await api.post<AuthResponse>(
    "/auth/refresh-token",
    validatedData
  );
  return response.data;
};

// Logout
export const logout = async (data?: LogoutInput): Promise<void> => {
  const validatedData = logoutSchema.parse(data || {});
  await api.post("/auth/logout", validatedData);
};

// Logout All Other Devices
export const logoutAllOtherDevices = async (): Promise<void> => {
  await api.post("/auth/logout-all");
};

// Forgot Password
export const forgotPassword = async (
  data: ForgotPasswordInput
): Promise<{ message: string }> => {
  const validatedData = forgotSchema.parse(data);
  const response = await api.post("/auth/forgot-password", validatedData);
  return response.data;
};

// Reset Password
export const resetPassword = async (
  data: ResetPasswordInput
): Promise<{ message: string }> => {
  const validatedData = resetSchema.parse(data);
  const response = await api.post("/auth/reset-password", validatedData);
  return response.data;
};

// List Active Sessions
export const listActiveSessions = async (): Promise<ListSessionsResponse> => {
  const response = await api.get<ListSessionsResponse>("/auth/sessions");
  return response.data;
};

// // Get Current User
// export const getCurrentUser = async (): Promise<AuthResponse["user"]> => {
//   const response = await api.get<{ user: AuthResponse["user"] }>("/auth/me");
//   return response.data.user;
// };

// ============ TANSTACK QUERY HOOKS ============

// Login Hook
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      // First, login and get tokens
      const tokenData = await login(credentials);
      
      // Store tokens immediately
      localStorage.setItem("accessToken", tokenData.accessToken);
      localStorage.setItem("refreshToken", tokenData.refreshToken);
      console.log("Tokens stored:", { accessToken: tokenData.accessToken.substring(0, 20) + "..." });
      
      // Then fetch user data using the new tokens (interceptor will add the token)
      try {
        const user = await login(credentials)
        localStorage.setItem("user", JSON.stringify(user));
        return { ...tokenData, user };
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Even if user fetch fails, we have tokens, so return what we got
        return tokenData;
      }
    },
    onSuccess: (data) => {
      console.log("useLogin onSuccess:", { data });
      if (data.user) {
        queryClient.setQueryData(["user"], data.user);
      }
    },
    onError: (error: AxiosError) => {
      console.error("Login error:", error.response?.data || error.message);
    },
  });
};

// Refresh Token Hook
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: refreshToken,
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    },
    onError: (error: AxiosError) => {
      console.error("Token refresh error:", error.response?.data || error.message);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  });
};

// Logout Hook
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      queryClient.removeQueries();
    },
    onError: (error: AxiosError) => {
      console.error("Logout error:", error.response?.data || error.message);
    },
  });
};

// Logout All Other Devices Hook
export const useLogoutAllOtherDevices = () => {
  return useMutation({
    mutationFn: logoutAllOtherDevices,
    onError: (error: AxiosError) => {
      console.error(
        "Logout all devices error:",
        error.response?.data || error.message
      );
    },
  });
};

// Forgot Password Hook
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onError: (error: AxiosError) => {
      console.error(
        "Forgot password error:",
        error.response?.data || error.message
      );
    },
  });
};

// Reset Password Hook
export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
    onError: (error: AxiosError) => {
      console.error("Reset password error:", error.response?.data || error.message);
    },
  });
};

// List Active Sessions Hook
export const useListActiveSessions = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: listActiveSessions,
  });
};

// Re-export validation schemas for use in components
export { loginSchema, refreshSchema, logoutSchema, forgotSchema, resetSchema } from "../lib/validations/auth";
export type { LoginInput, RefreshTokenInput, LogoutInput, ForgotPasswordInput, ResetPasswordInput } from "../lib/validations/auth";

export default api;
