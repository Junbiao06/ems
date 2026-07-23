import type { AttendanceRecord } from "@/types/attendance";
import { Badge } from "../ui/Badge";
import { Pagination } from "../ui/Pagination";

type AttendanceHistoryProps = {
  records: AttendanceRecord[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const dayTypeLabels = {
  FULL_DAY: "Full day",
  THREE_QUARTER_DAY: "Three-quarter day",
  HALF_DAY: "Half day",
  SHORT_DAY: "Short day",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  }).format(new Date(`${value}T00:00:00+08:00`));
}

function formatTime(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Shanghai",
  }).format(new Date(value));
}

function formatWorkingTime(value: number | null) {
  if (value === null) {
    return "In progress";
  }

  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${hours}h ${minutes}m`;
}

function statusBadge(record: AttendanceRecord) {
  if (record.status === "LATE") {
    return <Badge tone="warning">Late</Badge>;
  }

  return <Badge tone="success">Present</Badge>;
}

function dayTypeBadge(record: AttendanceRecord) {
  if (!record.dayType) {
    return <Badge tone="info">In progress</Badge>;
  }

  if (record.dayType === "FULL_DAY") {
    return <Badge tone="success">{dayTypeLabels[record.dayType]}</Badge>;
  }

  if (record.dayType === "THREE_QUARTER_DAY") {
    return <Badge tone="info">{dayTypeLabels[record.dayType]}</Badge>;
  }

  if (record.dayType === "HALF_DAY") {
    return <Badge tone="warning">{dayTypeLabels[record.dayType]}</Badge>;
  }

  return <Badge tone="danger">{dayTypeLabels[record.dayType]}</Badge>;
}

export function AttendanceHistory({
  records,
  page,
  totalPages,
  onPageChange,
}: AttendanceHistoryProps) {
  if (records.length === 0) {
    return (
      <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <header className="border-b border-border px-5 py-5 sm:px-6">
          <h2 className="text-xl font-extrabold text-text">Recent attendance</h2>
          <p className="mt-1 text-sm text-text-muted">
            Your latest check-ins and completed workdays.
          </p>
        </header>
        <div className="grid min-h-52 place-items-center px-5 py-12 text-center">
          <div>
            <h3 className="font-extrabold text-text">No attendance found</h3>
            <p className="mt-1 text-sm text-text-muted">
              Try changing or clearing the current filters.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <header className="border-b border-border px-5 py-5 sm:px-6">
        <h2 className="text-xl font-extrabold text-text">Recent attendance</h2>
        <p className="mt-1 text-sm text-text-muted">
          Your latest check-ins and completed workdays.
        </p>
      </header>

      <div className="grid gap-3 p-4 md:hidden">
        {records.map((record) => (
          <article
            className="rounded-xl border border-border bg-surface-raised p-4"
            key={record.id}
          >
            <div>
              <p className="font-bold text-text">{formatDate(record.businessDate)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {dayTypeBadge(record)}
                {statusBadge(record)}
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4 text-sm">
              <div>
                <dt className="text-xs font-semibold text-text-subtle">Check in</dt>
                <dd className="mt-1 font-semibold text-text">
                  {formatTime(record.checkInAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-text-subtle">Check out</dt>
                <dd className="mt-1 font-semibold text-text">
                  {formatTime(record.checkOutAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-text-subtle">Working time</dt>
                <dd className="mt-1 font-semibold text-text">
                  {formatWorkingTime(record.workingMinutes)}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted text-xs text-text-subtle uppercase">
            <tr>
              <th className="px-6 py-4 font-bold" scope="col">Date</th>
              <th className="px-4 py-4 font-bold" scope="col">Check in</th>
              <th className="px-4 py-4 font-bold" scope="col">Check out</th>
              <th className="px-4 py-4 font-bold" scope="col">Working time</th>
              <th className="px-4 py-4 text-center font-bold" scope="col">Day type</th>
              <th className="px-6 py-4 text-center font-bold" scope="col">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {records.map((record) => (
              <tr className="transition-colors hover:bg-surface-muted/60" key={record.id}>
                <th className="whitespace-nowrap px-6 py-4 font-bold text-text" scope="row">
                  {formatDate(record.businessDate)}
                </th>
                <td className="whitespace-nowrap px-4 py-4 font-semibold text-text-muted">
                  {formatTime(record.checkInAt)}
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-semibold text-text-muted">
                  {formatTime(record.checkOutAt)}
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-semibold text-text-muted">
                  {formatWorkingTime(record.workingMinutes)}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-center">
                  {dayTypeBadge(record)}
                </td>
                <td className="px-6 py-4 text-center">{statusBadge(record)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </section>
  );
}
