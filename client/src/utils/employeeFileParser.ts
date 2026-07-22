import {
  CsvEmployeeFileParser,
  type EmployeeFileParser,
  type RawEmployeeImportRow,
} from "./csvEmployeeFileParser";

export const employeeImportMaxFileSize = 5 * 1024 * 1024;
export const employeeImportMaxRows = 1000;

const employeeFileParsers: EmployeeFileParser[] = [
  new CsvEmployeeFileParser(),
];

export async function parseEmployeeFile(
  file: File,
): Promise<RawEmployeeImportRow[]> {
  const parser = employeeFileParsers.find((candidate) => candidate.supports(file));

  if (!parser) {
    throw new Error("Choose a supported CSV file.");
  }

  return parser.parse(file);
}
