import { CalendarRange, RotateCcw } from "lucide-react";

type AttendanceFiltersProps = {
  month: string;
  dayType: string;
  status: string;
  hasFilters: boolean;
  onChange: (name: "month" | "dayType" | "status", value: string) => void;
  onClear: () => void;
};

export function AttendanceFilters({
  month,
  dayType,
  status,
  hasFilters,
  onChange,
  onClear,
}: AttendanceFiltersProps) {
  return (
    <section className="grid gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[minmax(200px,1fr)_220px_180px_auto] sm:p-5">
      <label className="relative">
        <span className="sr-only">Attendance month</span>
        <CalendarRange
          className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-text-subtle"
          aria-hidden="true"
        />
        <input
          className="h-11 w-full rounded-lg border border-border bg-surface-raised pl-11 pr-3 text-sm font-semibold text-text outline-none focus:border-focus focus:ring-2 focus:ring-focus/15"
          type="month"
          value={month}
          onChange={(event) => onChange("month", event.target.value)}
        />
      </label>

      <label>
        <span className="sr-only">Filter by day type</span>
        <select
          className="h-11 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm font-semibold text-text outline-none focus:border-focus focus:ring-2 focus:ring-focus/15"
          value={dayType}
          onChange={(event) => onChange("dayType", event.target.value)}
        >
          <option value="">Day type</option>
          <option value="FULL_DAY">Full day</option>
          <option value="THREE_QUARTER_DAY">Three-quarter day</option>
          <option value="HALF_DAY">Half day</option>
          <option value="SHORT_DAY">Short day</option>
        </select>
      </label>

      <label>
        <span className="sr-only">Filter by attendance status</span>
        <select
          className="h-11 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm font-semibold text-text outline-none focus:border-focus focus:ring-2 focus:ring-focus/15"
          value={status}
          onChange={(event) => onChange("status", event.target.value)}
        >
          <option value="">Status</option>
          <option value="PRESENT">Present</option>
          <option value="LATE">Late</option>
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
    </section>
  );
}
