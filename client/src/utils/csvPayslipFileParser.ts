import type { RawPayslipImportRow } from "@/types/payslip";
import { parseCsvText, rowsToObjects } from "./csvFileParser";

export interface PayslipFileParser {
  supports(file: File): boolean;
  parse(file: File): Promise<RawPayslipImportRow[]>;
}

const payslipCsvHeaders = [
  "employeeEmail",
  "period",
  "basicSalary",
  "allowances",
  "deductions",
] as const;

export class CsvPayslipFileParser implements PayslipFileParser {
  supports(file: File) {
    const allowedMimeTypes = new Set([
      "",
      "text/csv",
      "application/vnd.ms-excel",
    ]);

    return (
      file.name.toLowerCase().endsWith(".csv") &&
      allowedMimeTypes.has(file.type)
    );
  }

  async parse(file: File) {
    return rowsToObjects(
      parseCsvText(await file.text()),
      payslipCsvHeaders,
      "payslip",
    ) as RawPayslipImportRow[];
  }
}
