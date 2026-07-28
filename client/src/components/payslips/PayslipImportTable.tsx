import type {
  PayslipImportRowResult,
  RawPayslipImportRow,
} from "@/types/payslip";
import { cn } from "../../utils/cn";
import { Badge } from "../ui/Badge";

type PayslipImportTableProps = {
  rows: PayslipImportRowResult[];
};

const columns = [
  { key: "employeeEmail", label: "Employee" },
  { key: "period", label: "Pay period" },
  { key: "basicSalary", label: "Basic salary" },
  { key: "allowances", label: "Allowances" },
  { key: "deductions", label: "Deductions" },
] as const;

type ColumnKey = keyof RawPayslipImportRow;

function formatMoney(valueMinor: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(valueMinor / 100);
}

function valueFor(row: PayslipImportRowResult, key: ColumnKey) {
  if (!row.valid) {
    return row.raw[key] || "—";
  }

  const values: Record<ColumnKey, string> = {
    employeeEmail: row.raw.employeeEmail,
    period: row.data.period,
    basicSalary: formatMoney(row.data.basicSalaryMinor),
    allowances: formatMoney(row.data.allowancesMinor),
    deductions: formatMoney(row.data.deductionsMinor),
  };

  return values[key];
}

export function PayslipImportTable({ rows }: PayslipImportTableProps) {
  return (
    <div className="max-h-[32rem] overflow-auto rounded-xl border border-border">
      <table className="min-w-[1280px] w-full text-left text-sm">
        <thead className="sticky top-0 z-10 border-b border-border bg-surface-muted text-xs text-text-subtle uppercase shadow-sm">
          <tr>
            <th className="px-4 py-3 font-bold" scope="col">
              Row
            </th>
            {columns.map((column) => (
              <th className="px-4 py-3 font-bold" key={column.key} scope="col">
                {column.label}
              </th>
            ))}
            <th className="px-4 py-3 font-bold" scope="col">
              Net pay
            </th>
            <th className="px-4 py-3 text-center font-bold" scope="col">
              Status
            </th>
            <th className="px-4 py-3 font-bold" scope="col">
              Validation
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => {
            const errorFields = new Set(
              row.valid ? [] : row.errors.map((error) => error.field),
            );
            const netSalaryMinor = row.valid
              ? row.data.basicSalaryMinor +
                row.data.allowancesMinor -
                row.data.deductionsMinor
              : null;

            return (
              <tr
                className={cn(!row.valid && "bg-danger-surface/25")}
                key={row.rowNumber}
              >
                <th className="px-4 py-3 font-bold text-text" scope="row">
                  {row.rowNumber}
                </th>
                {columns.map((column) => (
                  <td
                    className={cn(
                      "max-w-64 px-4 py-3 text-text-muted",
                      errorFields.has(column.key) &&
                        "bg-danger-surface font-semibold text-danger-text",
                    )}
                    key={column.key}
                    title={valueFor(row, column.key)}
                  >
                    {column.key === "employeeEmail" && row.valid ? (
                      <>
                        <span className="block font-bold text-text">
                          {row.employeeName}
                        </span>
                        <span className="block text-xs">
                          {valueFor(row, column.key)}
                        </span>
                      </>
                    ) : (
                      valueFor(row, column.key)
                    )}
                  </td>
                ))}
                <td className="px-4 py-3 font-extrabold text-text">
                  {netSalaryMinor === null
                    ? "—"
                    : formatMoney(netSalaryMinor)}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge tone={row.valid ? "success" : "danger"}>
                    {row.valid ? "Valid" : "Error"}
                  </Badge>
                </td>
                <td className="min-w-80 px-4 py-3 text-xs font-semibold text-danger-text">
                  {row.valid ? (
                    <span className="text-success-text">Ready to import</span>
                  ) : (
                    <ul className="grid gap-1">
                      {row.errors.map((error) => (
                        <li key={`${error.field}-${error.message}`}>
                          {error.field}: {error.message}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
