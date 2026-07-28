import type { EmployeeListItem } from "@/types/employee";
import {
  GeneratePayslipFormSchema,
  type PayslipImportFieldError,
  type PayslipImportRowResult,
  type PayslipRecord,
  type RawPayslipImportRow,
} from "@/types/payslip";

const fieldNames = {
  employeeId: "employeeEmail",
  period: "period",
  basicSalaryMinor: "basicSalary",
  allowancesMinor: "allowances",
  deductionsMinor: "deductions",
} as const;

function importKey(employeeId: string, period: string) {
  return `${employeeId}:${period}`;
}

function invalidRow(
  rowNumber: number,
  raw: RawPayslipImportRow,
  errors: PayslipImportFieldError[],
): PayslipImportRowResult {
  return {
    rowNumber,
    valid: false,
    raw,
    errors,
  };
}

export function validatePayslipImportRows(
  rows: RawPayslipImportRow[],
  employees: EmployeeListItem[],
  existingPayslips: PayslipRecord[],
): PayslipImportRowResult[] {
  const activeEmployeesByEmail = new Map(
    employees
      .filter((employee) => employee.status === "ACTIVE")
      .map((employee) => [employee.email.toLowerCase(), employee]),
  );
  const existingKeys = new Set(
    existingPayslips.map((payslip) =>
      importKey(
        payslip.employee.id,
        `${payslip.year}-${String(payslip.month).padStart(2, "0")}`,
      ),
    ),
  );

  const results = rows.map<PayslipImportRowResult>((raw, index) => {
    const rowNumber = index + 2;
    const employeeEmail = raw.employeeEmail.trim().toLowerCase();
    const employee = activeEmployeesByEmail.get(employeeEmail);

    if (!employee) {
      return invalidRow(rowNumber, raw, [
        {
          field: "employeeEmail",
          message: "No active employee matches this email.",
        },
      ]);
    }

    const parsed = GeneratePayslipFormSchema.safeParse({
      employeeId: employee.id,
      period: raw.period,
      basicSalaryMinor: raw.basicSalary,
      allowancesMinor: raw.allowances.trim() || "0",
      deductionsMinor: raw.deductions.trim() || "0",
    });

    if (!parsed.success) {
      return invalidRow(
        rowNumber,
        raw,
        parsed.error.issues.map((issue) => ({
          field:
            fieldNames[issue.path[0] as keyof typeof fieldNames] ?? "row",
          message: issue.message,
        })),
      );
    }

    return {
      rowNumber,
      valid: true,
      raw,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      data: parsed.data,
    };
  });

  const keyRows = new Map<string, number[]>();

  results.forEach((result, index) => {
    if (!result.valid) {
      return;
    }

    const key = importKey(result.data.employeeId, result.data.period);
    const indexes = keyRows.get(key) ?? [];
    indexes.push(index);
    keyRows.set(key, indexes);
  });

  for (const [key, indexes] of keyRows) {
    const duplicate = indexes.length > 1;
    const alreadyExists = existingKeys.has(key);

    if (!duplicate && !alreadyExists) {
      continue;
    }

    const duplicateRows = indexes.map((index) => results[index].rowNumber);

    for (const index of indexes) {
      const result = results[index];

      if (!result.valid) {
        continue;
      }

      results[index] = invalidRow(result.rowNumber, result.raw, [
        {
          field: "period",
          message: alreadyExists
            ? "A payslip already exists for this employee and period."
            : `Duplicate payslip in rows ${duplicateRows.join(", ")}.`,
        },
      ]);
    }
  }

  return results;
}
