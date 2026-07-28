import {
  CsvPayslipFileParser,
  type PayslipFileParser,
} from "./csvPayslipFileParser";
import type { RawPayslipImportRow } from "@/types/payslip";

export const payslipImportMaxFileSize = 5 * 1024 * 1024;
export const payslipImportMaxRows = 1000;

const payslipFileParsers: PayslipFileParser[] = [
  new CsvPayslipFileParser(),
];

export async function parsePayslipFile(
  file: File,
): Promise<RawPayslipImportRow[]> {
  const parser = payslipFileParsers.find((candidate) =>
    candidate.supports(file),
  );

  if (!parser) {
    throw new Error("Choose a supported CSV file.");
  }

  return parser.parse(file);
}
