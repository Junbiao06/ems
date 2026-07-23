import { z } from "zod";

export const LeaveTypeSchema = z.enum(
  ["SICK", "CASUAL", "ANNUAL"],
  "Select a valid leave type.",
);

export const LeaveStatusSchema = z.enum(
  ["PENDING", "APPROVED", "REJECTED"],
  "Select a valid leave status.",
);

const DateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the YYYY-MM-DD date format.");

export const LeaveRecordSchema = z.object({
  id: z.string(),
  employee: z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.email(),
    department: z.string(),
    position: z.string(),
  }),
  type: LeaveTypeSchema,
  startDate: DateOnlySchema,
  endDate: DateOnlySchema,
  reason: z.string(),
  status: LeaveStatusSchema,
  reviewComment: z.string(),
  reviewedAt: z.iso.datetime({ offset: true }).nullable(),
  createdAt: z.iso.datetime({ offset: true }),
});

export const ReviewLeaveFormSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Enter a message for the employee.")
    .max(100, "Message must not exceed 100 characters."),
});

function currentBusinessDate() {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Shanghai",
  }).format(new Date());
}

export const CreateLeaveFormSchema = z
  .object({
    type: LeaveTypeSchema,
    startDate: DateOnlySchema,
    endDate: DateOnlySchema,
    reason: z
      .string()
      .trim()
      .min(1, "Reason is required.")
      .max(100, "Reason must not exceed 100 characters."),
  })
  .superRefine((value, context) => {
    if (value.startDate < currentBusinessDate()) {
      context.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "Start date cannot be in the past.",
      });
    }

    if (value.endDate < value.startDate) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date cannot be before start date.",
      });
    }
  });

export type LeaveRecord = z.infer<typeof LeaveRecordSchema>;
export type ReviewLeaveFormInput = z.input<typeof ReviewLeaveFormSchema>;
export type CreateLeaveFormInput = z.input<typeof CreateLeaveFormSchema>;
export type CreateLeaveFormData = z.output<typeof CreateLeaveFormSchema>;
