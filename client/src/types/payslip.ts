import { z } from "zod";

export const PayslipEmployeeSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.email(),
  department: z.string(),
  position: z.string(),
});

export const PayslipPeriodSchema = z
  .string()
  .regex(
    /^(?:20\d{2}|2100)-(?:0[1-9]|1[0-2])$/,
    "Select a valid pay period.",
  );

const PayslipMoneyInputSchema = z
  .string()
  .trim()
  .min(1, "Enter an amount.")
  .refine(
    (value) => Number.isFinite(Number(value)) && Number(value) >= 0,
    "Enter a valid non-negative amount.",
  )
  .transform((value) => Math.round(Number(value) * 100));

export const GeneratePayslipFormSchema = z
  .object({
    employeeId: z.string().min(1, "Select an employee."),
    period: PayslipPeriodSchema,
    basicSalaryMinor: PayslipMoneyInputSchema,
    allowancesMinor: PayslipMoneyInputSchema,
    deductionsMinor: PayslipMoneyInputSchema,
  })
  .superRefine((value, context) => {
    if (
      value.deductionsMinor >
      value.basicSalaryMinor + value.allowancesMinor
    ) {
      context.addIssue({
        code: "custom",
        path: ["deductionsMinor"],
        message: "Deductions cannot exceed gross pay.",
      });
    }
  });

export const PayslipRecordSchema = z.object({
  id: z.string(),
  employee: PayslipEmployeeSchema,
  month: z
    .number()
    .int("Month must be a whole number.")
    .min(1, "Month must be between 1 and 12.")
    .max(12, "Month must be between 1 and 12."),
  year: z
    .number()
    .int("Year must be a whole number.")
    .min(2000, "Enter a valid year.")
    .max(2100, "Enter a valid year."),
  basicSalaryMinor: z.number().int().nonnegative(),
  allowancesMinor: z.number().int().nonnegative(),
  deductionsMinor: z.number().int().nonnegative(),
  netSalaryMinor: z.number().int().nonnegative(),
  currency: z.literal("CNY"),
  createdAt: z.iso.datetime({ offset: true }),
});

export type PayslipEmployee = z.infer<typeof PayslipEmployeeSchema>;
export type PayslipRecord = z.infer<typeof PayslipRecordSchema>;
export type GeneratePayslipFormInput = z.input<
  typeof GeneratePayslipFormSchema
>;
export type GeneratePayslipFormData = z.output<
  typeof GeneratePayslipFormSchema
>;
