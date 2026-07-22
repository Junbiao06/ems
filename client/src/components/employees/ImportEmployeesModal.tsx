import { useMemo, useState } from "react";
import type {
  EmployeeCreateFormData,
  EmployeeImportRowResult,
} from "@/types/employee";
import {
  employeeImportMaxFileSize,
  employeeImportMaxRows,
  parseEmployeeFile,
} from "../../utils/employeeFileParser";
import { validateEmployeeImportRows } from "../../utils/employeeImportValidation";
import { Modal } from "../ui/Modal";
import { EmployeeImportDropzone } from "./EmployeeImportDropzone";
import { EmployeeImportSummary } from "./EmployeeImportSummary";
import { EmployeeImportTable } from "./EmployeeImportTable";

type ImportEmployeesModalProps = {
  existingEmails: string[];
  onClose: () => void;
  onImport: (employees: EmployeeCreateFormData[]) => void;
};

export function ImportEmployeesModal({
  existingEmails,
  onClose,
  onImport,
}: ImportEmployeesModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<EmployeeImportRowResult[]>([]);
  const [error, setError] = useState("");
  const [parsing, setParsing] = useState(false);

  const validEmployees = useMemo(
    () => rows.flatMap((row) => (row.valid ? [row.data] : [])),
    [rows],
  );
  const invalidRowCount = rows.length - validEmployees.length;

  async function handleFileSelected(selectedFile: File) {
    setFile(selectedFile);
    setRows([]);
    setError("");

    if (selectedFile.size > employeeImportMaxFileSize) {
      setError("The employee file must not exceed 5 MiB.");
      return;
    }

    setParsing(true);

    try {
      const rawRows = await parseEmployeeFile(selectedFile);

      if (rawRows.length === 0) {
        throw new Error("The employee file does not contain any rows.");
      }

      if (rawRows.length > employeeImportMaxRows) {
        throw new Error(
          `An employee file can contain at most ${employeeImportMaxRows} rows.`,
        );
      }

      setRows(
        validateEmployeeImportRows(
          rawRows,
          new Set(existingEmails.map((email) => email.toLowerCase())),
        ),
      );
    } catch (parseError) {
      setError(
        parseError instanceof Error
          ? parseError.message
          : "The CSV file could not be processed.",
      );
    } finally {
      setParsing(false);
    }
  }

  return (
    <Modal
      title="Import employees"
      description="Validate an employee CSV locally before creating any records."
      onClose={onClose}
    >
      <div className="grid gap-6 p-5 sm:p-7">
        {rows.length > 0 && file ? (
          <div className="flex justify-end">
            <EmployeeImportDropzone
              compact
              parsing={parsing}
              onFileSelected={handleFileSelected}
            />
          </div>
        ) : (
          <EmployeeImportDropzone
            parsing={parsing}
            onFileSelected={handleFileSelected}
          />
        )}

        {error ? (
          <div
            className="rounded-xl border border-danger-border bg-danger-surface px-4 py-3 text-sm font-semibold text-danger-text"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        {rows.length > 0 && file ? (
          <>
            <EmployeeImportSummary
              file={file}
              totalRows={rows.length}
              validRows={validEmployees.length}
              invalidRows={invalidRowCount}
            />
            <EmployeeImportTable
              key={`${file.name}-${file.size}-${file.lastModified}`}
              rows={rows}
            />
          </>
        ) : null}

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-border bg-surface py-5">
          <button
            className="h-11 rounded-lg border border-border px-5 text-sm font-bold text-text transition hover:bg-surface-muted"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="h-11 rounded-lg bg-text px-5 text-sm font-bold text-surface transition hover:bg-text/85 disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            disabled={rows.length === 0 || invalidRowCount > 0 || parsing}
            onClick={() => onImport(validEmployees)}
          >
            Create {validEmployees.length || ""} employees
          </button>
        </div>
      </div>
    </Modal>
  );
}
