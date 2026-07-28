import { CircleCheck, CircleX, FileSpreadsheet } from "lucide-react";

type CsvImportSummaryProps = {
  file: File;
  totalRows: number;
  validRows: number;
  invalidRows: number;
};

function formatFileSize(size: number) {
  return `${(size / 1000).toFixed(1)} KB`;
}

export function CsvImportSummary({
  file,
  totalRows,
  validRows,
  invalidRows,
}: CsvImportSummaryProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="min-w-0 rounded-xl border border-border bg-surface-muted p-4">
        <FileSpreadsheet className="size-5 text-text-muted" aria-hidden="true" />
        <p className="mt-3 truncate text-sm font-bold text-text" title={file.name}>
          {file.name}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          {formatFileSize(file.size)} · {totalRows} rows
        </p>
      </div>
      <div className="rounded-xl border border-success-border bg-success-surface p-4">
        <CircleCheck className="size-5 text-success-text" aria-hidden="true" />
        <p className="mt-3 text-2xl font-extrabold text-success-text">
          {validRows}
        </p>
        <p className="mt-1 text-xs font-semibold text-success-text">
          Valid rows
        </p>
      </div>
      <div className="rounded-xl border border-danger-border bg-danger-surface p-4">
        <CircleX className="size-5 text-danger-text" aria-hidden="true" />
        <p className="mt-3 text-2xl font-extrabold text-danger-text">
          {invalidRows}
        </p>
        <p className="mt-1 text-xs font-semibold text-danger-text">
          Rows with errors
        </p>
      </div>
    </div>
  );
}
