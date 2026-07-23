import { z } from "zod";

export const EmployeeProfileSchema = z.object({
  kind: z.literal("EMPLOYEE"),
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  phone: z.string(),
  department: z.string(),
  position: z.string(),
  bio: z.string().max(100, "Bio must not exceed 100 characters."),
});

export const AdminProfileSchema = z.object({
  kind: z.literal("ADMIN"),
  id: z.string(),
  email: z.email(),
  displayName: z.string(),
});

export const ProfileSchema = z.discriminatedUnion("kind", [
  EmployeeProfileSchema,
  AdminProfileSchema,
]);

export const EmployeeProfileUpdateSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^1[3-9]\d{9}$/, "Enter a valid 11-digit Chinese mobile number."),
  bio: z.string().trim().max(100, "Bio must not exceed 100 characters."),
});

export const AdminProfileUpdateSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required.")
    .max(80, "Display name must not exceed 80 characters."),
});

export type Profile = z.infer<typeof ProfileSchema>;
export type EmployeeProfileUpdateData = z.output<
  typeof EmployeeProfileUpdateSchema
>;
export type AdminProfileUpdateData = z.output<
  typeof AdminProfileUpdateSchema
>;
