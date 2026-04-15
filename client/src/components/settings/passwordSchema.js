import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Must include an uppercase letter (A-Z)")
      .regex(/[a-z]/, "Must include a lowercase letter (a-z)")
      .regex(/[0-9]/, "Must include a number (0-9)")
      .regex(/[^A-Za-z0-9]/, "Must include a symbol (!@#$...)")
      .trim(),
    confirmPassword: z.string().min(1, "Please confirm the new password").trim(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword === data.currentPassword) {
      ctx.addIssue({
        path: ["newPassword"],
        message: "New password must be different from current password",
      });
    }
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });
