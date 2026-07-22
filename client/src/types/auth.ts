import { z } from "zod";

export const EmailSchema = z
  .string()
  .trim()
  .pipe(z.email("Enter a valid work email."))
  .transform((value) => value.toLowerCase());

export const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must not exceed 128 characters.");

export const LoginFormSchema = z.object({
  email: EmailSchema,
  password: z
    .string()
    .min(1, "Password is required.")
    .max(128, "Password must not exceed 128 characters."),
});

export const PasswordResetRequestFormSchema = z.object({
  email: EmailSchema,
});

export const VerificationCodeFormSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the complete 6-digit code."),
});

export const CompleteRegistrationFormSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .superRefine((value, context) => {
    if (value.password !== value.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

export const ResetPasswordFormSchema = z
  .object({
    newPassword: PasswordSchema,
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .superRefine((value, context) => {
    if (value.newPassword !== value.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

export type LoginFormInput = z.input<typeof LoginFormSchema>;
export type LoginFormData = z.output<typeof LoginFormSchema>;
export type PasswordResetRequestFormInput = z.input<
  typeof PasswordResetRequestFormSchema
>;
export type CompleteRegistrationFormInput = z.input<
  typeof CompleteRegistrationFormSchema
>;
export type ResetPasswordFormInput = z.input<typeof ResetPasswordFormSchema>;
