import {
  parseCsvText,
  rowsToObjects as mapCsvRowsToObjects,
} from "./csvFileParser";

export type RawEmployeeImportRow = Record<string, string>;

export interface EmployeeFileParser {
  supports(file: File): boolean;
  parse(file: File): Promise<RawEmployeeImportRow[]>;
}

const employeeCsvHeaders = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "department",
  "position",
  "joinDate",
  "basicSalary",
  "allowances",
  "deductions",
  "bio",
] as const;

function rowsToObjects(rows: string[][]): RawEmployeeImportRow[] {
  return mapCsvRowsToObjects(rows, employeeCsvHeaders, "employee");
}

export class CsvEmployeeFileParser implements EmployeeFileParser {
  supports(file: File) {
    const allowedMimeTypes = new Set(["", "text/csv", "application/vnd.ms-excel"]);
    return (
      file.name.toLowerCase().endsWith(".csv") && allowedMimeTypes.has(file.type)
    );
  }

  async parse(file: File) {
    return rowsToObjects(parseCsvText(await file.text()));
  }
}
