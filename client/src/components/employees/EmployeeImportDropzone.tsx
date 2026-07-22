import { FileUp, LoaderCircle } from "lucide-react";
import { cn } from "../../utils/cn";

type EmployeeImportDropzoneProps = {
  compact?: boolean;
  parsing: boolean;
  onFileSelected: (file: File) => void;
};

export function EmployeeImportDropzone({
  compact = false,
  parsing,
  onFileSelected,
}: EmployeeImportDropzoneProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-center border border-dashed border-border-strong bg-surface-muted text-center transition hover:border-brand-active hover:bg-brand/10",
        compact
          ? "gap-2 rounded-lg px-4 py-2 text-sm font-bold"
          : "min-h-56 flex-col rounded-xl p-8",
        parsing && "pointer-events-none opacity-60",
      )}
    >
      <input
        className="sr-only"
        type="file"
        accept=".csv,text/csv"
        disabled={parsing}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onFileSelected(file);
          }
          event.currentTarget.value = "";
        }}
      />
      {parsing ? (
        <LoaderCircle
          className={cn("animate-spin", compact ? "size-4" : "size-8")}
          aria-hidden="true"
        />
      ) : (
        <FileUp
          className={cn("text-text-muted", compact ? "size-4" : "size-8")}
          aria-hidden="true"
        />
      )}
      {compact ? (
        <span>{parsing ? "Parsing..." : "Choose another CSV"}</span>
      ) : (
        <>
          <p className="mt-4 font-extrabold text-text">
            {parsing ? "Parsing employee data..." : "Choose an employee CSV"}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">
            The file stays in your browser. Maximum 5 MiB and 1,000 employee rows.
          </p>
        </>
      )}
    </label>
  );
}
