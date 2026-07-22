import type { EmployeeImportRowResult } from "@/types/employee";
import { cn } from "../../utils/cn";
import { Badge } from "../ui/Badge";

type EmployeeImportTableProps = {
  rows: EmployeeImportRowResult[];
};

const columns = [
  { key: "firstName", label: "First name" },
  { key: "lastName", label: "Last name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "department", label: "Department" },
  { key: "position", label: "Position" },
  { key: "joinDate", label: "Join date" },
  { key: "basicSalary", label: "Basic salary" },
  { key: "allowances", label: "Allowances" },
  { key: "deductions", label: "Deductions" },
  { key: "bio", label: "Bio" },
] as const;

type ColumnKey = (typeof columns)[number]["key"];

function valueFor(row: EmployeeImportRowResult, key: ColumnKey) {
  if (!row.valid) {
    return row.raw[key] || "—";
  }

  const values: Record<ColumnKey, string> = {
    firstName: row.data.firstName,
    lastName: row.data.lastName,
    email: row.data.email,
    phone: row.data.phone,
    department: row.data.department,
    position: row.data.position,
    joinDate: row.data.joinDate,
    basicSalary: String(row.data.basicSalaryMinor / 100),
    allowances: String(row.data.allowancesMinor / 100),
    deductions: String(row.data.deductionsMinor / 100),
    bio: row.data.bio || "—",
  };

  return values[key];
}

export function EmployeeImportTable({ rows }: EmployeeImportTableProps) {
  return (
    <div className="max-h-[32rem] overflow-auto rounded-xl border border-border">
      <table className="min-w-[1680px] w-full text-left text-sm">
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
                    <span className="line-clamp-2">{valueFor(row, column.key)}</span>
                  </td>
                ))}
                <td className="px-4 py-3">
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
