import { z } from "zod";

export const DepartmentSchema = z.enum([
  "Engineering",
  "Human Resources",
  "Marketing",
  "Sales",
  "Finance",
  "Operations",
  "IT Support",
  "Customer Success",
  "Product Management",
  "Design",
], "Select a valid department.");

export const EmployeeStatusSchema = z.enum(
  ["INVITED", "ACTIVE", "INACTIVE"],
  "Select a valid employee status.",
);

export const InvitationStatusSchema = z.enum([
  "NOT_SENT",
  "PENDING",
  "EXPIRED",
  "CONSUMED",
], "Select a valid invitation status.");

export const EmployeeSortSchema = z.enum(
  [
    "joinDate-desc",
    "joinDate-asc",
    "name-asc",
    "name-desc",
    "salary-desc",
    "salary-asc",
  ],
  "Select a valid sorting option.",
);

export const EmployeeListItemSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  phone: z.string(),
  position: z.string(),
  department: DepartmentSchema,
  joinDate: z.string(),
  basicSalaryMinor: z.number().int().min(0),
  allowancesMinor: z.number().int().min(0),
  deductionsMinor: z.number().int().min(0),
  currency: z.literal("CNY"),
  bio: z.string(),
  status: EmployeeStatusSchema,
  invitationStatus: InvitationStatusSchema,
});

const MoneyInputSchema = z
  .string()
  .trim()
  .min(1, "Enter an amount.")
  .refine(
    (value) => Number.isFinite(Number(value)) && Number(value) >= 0,
    "Enter a valid non-negative amount.",
  )
  .transform((value) => Math.round(Number(value) * 100));

export const EmployeeCreateFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(80),
  lastName: z.string().trim().min(1, "Last name is required.").max(80),
  email: z
    .string()
    .trim()
    .pipe(z.email("Enter a valid work email."))
    .transform((value) => value.toLowerCase()),
  phone: z
    .string()
    .trim()
    .regex(/^1[3-9]\d{9}$/, "Enter a valid 11-digit Chinese mobile number."),
  department: DepartmentSchema,
  position: z.string().trim().min(1, "Position is required.").max(120),
  joinDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Select a valid join date."),
  basicSalaryMinor: MoneyInputSchema,
  allowancesMinor: MoneyInputSchema,
  deductionsMinor: MoneyInputSchema,
  currency: z.literal("CNY", "Select a valid currency."),
  bio: z.string().trim().max(2000, "Bio must not exceed 2,000 characters."),
});

export const departments = DepartmentSchema.options;

export type EmployeeListItem = z.infer<typeof EmployeeListItemSchema>;
export type EmployeeCreateFormInput = z.input<typeof EmployeeCreateFormSchema>;
export type EmployeeCreateFormData = z.output<typeof EmployeeCreateFormSchema>;

export type EmployeeImportFieldError = {
  field: string;
  message: string;
};

export type EmployeeImportRowResult =
  | {
      rowNumber: number;
      valid: true;
      data: EmployeeCreateFormData;
    }
  | {
      rowNumber: number;
      valid: false;
      raw: Record<string, string>;
      errors: EmployeeImportFieldError[];
    };
