import { CircleCheck, Clock3, LogIn, LogOut } from "lucide-react";
import type { AttendanceRecord } from "@/types/attendance";
import { Badge } from "../ui/Badge";

type TodayAttendanceProps = {
  record?: AttendanceRecord;
  onCheckIn: () => void;
  onCheckOut: () => void;
};

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

export function TodayAttendance({
  record,
  onCheckIn,
  onCheckOut,
}: TodayAttendanceProps) {
  if (!record) {
    return (
      <section className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand text-on-brand">
            <Clock3 className="size-5" aria-hidden="true" />
          </span>
          <div>
            <Badge>Not started</Badge>
            <h2 className="mt-3 text-xl font-extrabold text-text">Ready for today?</h2>
            <p className="mt-1 text-sm text-text-muted">
              Check in to begin tracking your workday.
            </p>
          </div>
        </div>
        <button
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-text px-5 text-sm font-bold text-surface transition hover:bg-text/85"
          type="button"
          onClick={onCheckIn}
        >
          <LogIn className="size-4" aria-hidden="true" />
          Check in
        </button>
      </section>
    );
  }

  if (!record.checkOutAt) {
    return (
      <section className="flex flex-col gap-5 rounded-xl border border-success-border bg-success-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-success-text text-surface">
            <Clock3 className="size-5" aria-hidden="true" />
          </span>
          <div>
            <Badge tone="success">Checked in</Badge>
            <h2 className="mt-3 text-xl font-extrabold text-text">
              Workday in progress
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              You checked in at {formatTime(record.checkInAt)}.
            </p>
          </div>
        </div>
        <button
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-text px-5 text-sm font-bold text-surface transition hover:bg-text/85"
          type="button"
          onClick={onCheckOut}
        >
          <LogOut className="size-4" aria-hidden="true" />
          Check out
        </button>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-5 rounded-xl border border-info-border bg-info-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-info-text text-surface">
          <CircleCheck className="size-5" aria-hidden="true" />
        </span>
        <div>
          <Badge tone="info">Completed</Badge>
          <h2 className="mt-3 text-xl font-extrabold text-text">Workday completed</h2>
          <p className="mt-1 text-sm text-text-muted">
            {formatTime(record.checkInAt)}–{formatTime(record.checkOutAt)} ·{" "}
            {formatWorkingTime(record.workingMinutes)}
          </p>
        </div>
      </div>
    </section>
  );
}
