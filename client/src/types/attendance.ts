import { z } from "zod";

export const AttendanceStatusSchema = z.enum(
  ["PRESENT", "LATE"],
  "Select a valid attendance status.",
);

export const AttendanceDayTypeSchema = z.enum(
  ["FULL_DAY", "THREE_QUARTER_DAY", "HALF_DAY", "SHORT_DAY"],
  "Select a valid attendance day type.",
);

export const AttendanceRecordSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  businessDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the YYYY-MM-DD date format."),
  checkInAt: z.iso.datetime({ offset: true }),
  checkOutAt: z.iso.datetime({ offset: true }).nullable(),
  status: AttendanceStatusSchema,
  workingMinutes: z.number().int().min(0).nullable(),
  dayType: AttendanceDayTypeSchema.nullable(),
  checkoutSource: z.enum(["EMPLOYEE", "AUTO"]).nullable(),
});

export const AdminAttendanceRecordSchema = AttendanceRecordSchema.extend({
  employee: z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.email(),
    department: z.string(),
    position: z.string(),
  }),
});

export type AttendanceRecord = z.infer<typeof AttendanceRecordSchema>;
export type AdminAttendanceRecord = z.infer<typeof AdminAttendanceRecordSchema>;
