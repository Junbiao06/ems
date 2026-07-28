import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import type { EmployeeListItem } from "@/types/employee";
import type {
  GeneratePayslipFormData,
  PayslipImportRowResult,
  PayslipRecord,
} from "@/types/payslip";
import {
  parsePayslipFile,
  payslipImportMaxFileSize,
  payslipImportMaxRows,
} from "../../utils/payslipFileParser";
import { validatePayslipImportRows } from "../../utils/payslipImportValidation";
import { CsvImportDropzone } from "../imports/CsvImportDropzone";
import { CsvImportSummary } from "../imports/CsvImportSummary";
import { Modal } from "../ui/Modal";
import { PayslipImportTable } from "./PayslipImportTable";

type ImportPayslipsModalProps = {
  employees: EmployeeListItem[];
  existingPayslips: PayslipRecord[];
  onClose: () => void;
  onImport: (payslips: GeneratePayslipFormData[]) => void;
};

export function ImportPayslipsModal({
  employees,
  existingPayslips,
  onClose,
  onImport,
}: ImportPayslipsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<PayslipImportRowResult[]>([]);
  const [error, setError] = useState("");
  const [parsing, setParsing] = useState(false);
  const validPayslips = useMemo(
    () => rows.flatMap((row) => (row.valid ? [row.data] : [])),
    [rows],
  );
  const invalidRowCount = rows.length - validPayslips.length;

  async function handleFileSelected(selectedFile: File) {
    setFile(selectedFile);
    setRows([]);
    setError("");

    if (selectedFile.size > payslipImportMaxFileSize) {
      setError("The payslip file must not exceed 5 MB.");
      return;
    }

    setParsing(true);

    try {
      const rawRows = await parsePayslipFile(selectedFile);

      if (rawRows.length === 0) {
        throw new Error("The payslip file does not contain any rows.");
      }

      if (rawRows.length > payslipImportMaxRows) {
        throw new Error(
          `A payslip file can contain at most ${payslipImportMaxRows} rows.`,
        );
      }

      setRows(
        validatePayslipImportRows(
          rawRows,
          employees,
          existingPayslips,
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
      title="Import payslips"
      description="Validate salary records locally before adding them."
      onClose={onClose}
    >
      <div className="grid gap-6 p-5 sm:p-7">
        <div className="flex justify-end">
          <a
            className="inline-flex items-center gap-2 text-sm font-bold text-text-muted transition hover:text-text"
            href="/payslip-import-template.csv"
            download
          >
            <Download className="size-4" aria-hidden="true" />
            Download template
          </a>
        </div>

        {rows.length > 0 && file ? (
          <div className="flex justify-end">
            <CsvImportDropzone
              compact
              dataLabel="payslip"
              parsing={parsing}
              onFileSelected={handleFileSelected}
            />
          </div>
        ) : (
          <CsvImportDropzone
            dataLabel="payslip"
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
            <CsvImportSummary
              file={file}
              totalRows={rows.length}
              validRows={validPayslips.length}
              invalidRows={invalidRowCount}
            />
            <PayslipImportTable
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
            onClick={() => onImport(validPayslips)}
          >
            Import {validPayslips.length || ""} payslips
          </button>
        </div>
      </div>
    </Modal>
  );
}
