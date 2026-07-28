import { RotateCcw, Search } from "lucide-react";
import { departments } from "@/types/employee";
import { cn } from "../../utils/cn";

type LeaveFiltersProps = {
  showEmployeeFilters: boolean;
  searchValue: string;
  department: string;
  type: string;
  status: string;
  hasFilters: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (
    name: "department" | "type" | "status",
    value: string,
  ) => void;
  onClear: () => void;
};

export function LeaveFilters({
  showEmployeeFilters,
  searchValue,
  department,
  type,
  status,
  hasFilters,
  onSearchChange,
  onFilterChange,
  onClear,
}: LeaveFiltersProps) {
  return (
    <div
      className={cn(
        "grid gap-3 border-b border-border p-4 sm:grid-cols-2 sm:p-5",
        showEmployeeFilters
          ? "xl:grid-cols-[minmax(240px,1fr)_200px_160px_160px_auto]"
          : "lg:grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_auto]",
      )}
    >
      {showEmployeeFilters ? (
        <>
          <label className="relative sm:col-span-2 xl:col-span-1">
            <span className="sr-only">Search employees</span>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-text-subtle"
              aria-hidden="true"
            />
            <input
              className="h-11 w-full rounded-lg border border-border bg-surface-raised pl-11 pr-4 text-sm text-text outline-none transition placeholder:text-text-subtle focus:border-focus focus:ring-2 focus:ring-focus/15"
              type="search"
              placeholder="Search employee"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </label>

          <label>
            <span className="sr-only">Filter by department</span>
            <select
              className="h-11 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm font-semibold text-text outline-none focus:border-focus focus:ring-2 focus:ring-focus/15"
              value={department}
              onChange={(event) =>
                onFilterChange("department", event.target.value)
              }
            >
              <option value="">Department</option>
              {departments.map((departmentOption) => (
                <option key={departmentOption} value={departmentOption}>
                  {departmentOption}
                </option>
              ))}
            </select>
          </label>
        </>
      ) : null}

      <label>
        <span className="sr-only">Filter by leave type</span>
        <select
          className="h-11 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm font-semibold text-text outline-none focus:border-focus focus:ring-2 focus:ring-focus/15"
          value={type}
          onChange={(event) => onFilterChange("type", event.target.value)}
        >
          <option value="">Type</option>
          <option value="ANNUAL">Annual</option>
          <option value="SICK">Sick</option>
          <option value="CASUAL">Casual</option>
        </select>
      </label>

      <label>
        <span className="sr-only">Filter by leave status</span>
        <select
          className="h-11 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm font-semibold text-text outline-none focus:border-focus focus:ring-2 focus:ring-focus/15"
          value={status}
          onChange={(event) => onFilterChange("status", event.target.value)}
        >
          <option value="">Status</option>
          {showEmployeeFilters ? (
            <option value="ACTIVE_TODAY">On leave today</option>
          ) : null}
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </label>

      <button
        className="flex h-11 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-bold text-text transition hover:border-border-strong hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-2 lg:col-span-1"
        type="button"
        disabled={!hasFilters}
        onClick={onClear}
      >
        <RotateCcw className="size-4" aria-hidden="true" />
        Clear
      </button>
    </div>
  );
}
