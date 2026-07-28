import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type AttendanceSummaryProps = {
  present: number;
  onLeave: number;
  late: number;
  notCheckedIn: number;
  attendanceRate: number;
};

export function AttendanceSummary({
  present,
  onLeave,
  late,
  notCheckedIn,
  attendanceRate,
}: AttendanceSummaryProps) {
  const rows = [
    { label: "Present", value: present },
    { label: "On leave", value: onLeave },
    { label: "Late arrivals", value: late },
    { label: "Not checked in", value: notCheckedIn },
    { label: "Attendance rate", value: `${attendanceRate}%` },
  ];

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <header className="border-b border-border px-5 py-4 sm:px-6">
        <h2 className="font-extrabold text-text">Today&apos;s attendance</h2>
        <p className="mt-1 text-sm text-text-muted">
          A current overview of your workforce.
        </p>
      </header>

      <dl className="flex flex-1 flex-col divide-y divide-border">
        {rows.map((row) => (
          <div
            className="flex flex-1 items-center justify-between gap-4 px-5 py-4 sm:px-6"
            key={row.label}
          >
            <dt className="text-sm font-semibold text-text-muted">
              {row.label}
            </dt>
            <dd className="text-sm font-extrabold text-text tabular-nums">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex justify-end border-t border-border px-5 py-4">
        <Link
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-bold text-text transition hover:border-border-strong hover:bg-surface-muted"
          to="/attendance"
        >
          View attendance
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
