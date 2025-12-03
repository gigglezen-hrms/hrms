import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Refresh Token Schema
export const refreshSchema = z.object({
  refreshToken: z.string({ required_error: "Refresh token is required" }),
});

export type RefreshTokenInput = z.infer<typeof refreshSchema>;

// Logout Schema
export const logoutSchema = z.object({
  refreshToken: z.string().optional(),
});

export type LogoutInput = z.infer<typeof logoutSchema>;

// Forgot Password Schema
export const forgotSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),
});

export type ForgotPasswordInput = z.infer<typeof forgotSchema>;

// Reset Password Schema
export const resetSchema = z
  .object({
    token: z.string({ required_error: "Reset token is required" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string({ required_error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetSchema>;

// Auth Response Type
export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export type User = {
  id: string;
  email: string;
  name?: string;
  role: string;
  tenant_id?: string;
  employee_id?: string;
};

export type AuthResponse = TokenResponse & {
  user?: User;
};

// Session Type
export type Session = {
  id: string;
  deviceName: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
};

// API Response Types
export type ListSessionsResponse = {
  sessions: Session[];
};

export type GetCurrentUserResponse = {
  user: User;
};
