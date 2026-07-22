import {
  EmployeeCreateFormSchema,
  type EmployeeImportFieldError,
  type EmployeeImportRowResult,
} from "@/types/employee";
import type { RawEmployeeImportRow } from "./csvEmployeeFileParser";

export function validateEmployeeImportRows(
  rows: RawEmployeeImportRow[],
  existingEmails: Set<string>,
): EmployeeImportRowResult[] {
  const results: EmployeeImportRowResult[] = rows.map((raw, index) => {
    const parsed = EmployeeCreateFormSchema.safeParse({
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      phone: raw.phone,
      department: raw.department,
      position: raw.position,
      joinDate: raw.joinDate,
      basicSalaryMinor: raw.basicSalary,
      allowancesMinor: raw.allowances?.trim() || "0",
      deductionsMinor: raw.deductions?.trim() || "0",
      currency: "CNY",
      bio: raw.bio ?? "",
    });

    if (parsed.success) {
      return {
        rowNumber: index + 2,
        valid: true,
        data: parsed.data,
      };
    }

    const errors: EmployeeImportFieldError[] = parsed.error.issues.map(
      (issue) => ({
        field: String(issue.path[0] ?? "row"),
        message: issue.message,
      }),
    );

    return {
      rowNumber: index + 2,
      valid: false,
      raw,
      errors,
    };
  });

  const emailRows = new Map<string, number[]>();

  results.forEach((result, index) => {
    if (!result.valid) {
      return;
    }

    const indexes = emailRows.get(result.data.email) ?? [];
    indexes.push(index);
    emailRows.set(result.data.email, indexes);
  });

  for (const [email, indexes] of emailRows) {
    const duplicateRows = indexes.map((index) => results[index].rowNumber);
    const duplicate = indexes.length > 1;
    const alreadyExists = existingEmails.has(email);

    if (!duplicate && !alreadyExists) {
      continue;
    }

    for (const index of indexes) {
      const result = results[index];

      if (!result.valid) {
        continue;
      }

      results[index] = {
        rowNumber: result.rowNumber,
        valid: false,
        raw: rows[index],
        errors: [
          {
            field: "email",
            message: alreadyExists
              ? "An employee with this email already exists."
              : `Duplicate email in rows ${duplicateRows.join(", ")}.`,
          },
        ],
      };
    }
  }

  return results;
}
