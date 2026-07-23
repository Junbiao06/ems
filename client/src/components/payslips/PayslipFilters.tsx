import { RotateCcw, Search } from "lucide-react";

type PayslipFiltersProps = {
  searchValue: string;
  period: string;
  hasFilters: boolean;
  onSearchChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onClear: () => void;
};

export function PayslipFilters({
  searchValue,
  period,
  hasFilters,
  onSearchChange,
  onPeriodChange,
  onClear,
}: PayslipFiltersProps) {
  return (
    <div className="grid gap-3 border-b border-border p-4 sm:grid-cols-[minmax(240px,1fr)_200px_auto] sm:p-5">
      <label className="relative">
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
        <span className="sr-only">Filter by pay period</span>
        <input
          className="h-11 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm font-semibold text-text outline-none focus:border-focus focus:ring-2 focus:ring-focus/15"
          type="month"
          min="2000-01"
          max="2100-12"
          value={period}
          onChange={(event) => onPeriodChange(event.target.value)}
          aria-label="Pay period"
        />
      </label>

      <button
        className="flex h-11 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-bold text-text transition hover:border-border-strong hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
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
