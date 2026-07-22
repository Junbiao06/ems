import {
  Banknote,
  CalendarCheck,
  Clock3,
  FileText,
  LogIn,
} from "lucide-react";
import type { EmployeeDashboardData } from "../../types/dashboard";
import { Badge } from "../ui/Badge";
import { StatCard } from "./StatCard";

type EmployeeDashboardProps = {
  data: EmployeeDashboardData;
};

export function EmployeeDashboard({ data }: EmployeeDashboardProps) {
  const attendanceLabel = {
    NOT_CHECKED_IN: "Not checked in",
    CHECKED_IN: "Checked in",
    CHECKED_OUT: "Checked out",
  }[data.todayAttendance.status];

  const payslipAmount = data.latestPayslip
    ? new Intl.NumberFormat("zh-CN", {
        style: "currency",
        currency: data.latestPayslip.currency,
      }).format(data.latestPayslip.netPayMinor / 100)
    : "Not available";

  return (
    <div className="mx-auto w-full max-w-7xl">
      <header>
        <p className="text-xs font-extrabold tracking-widest text-text-subtle uppercase">
          Personal dashboard
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
          Welcome back, {data.employee.fullName}.
        </h1>
        <p className="mt-2 text-sm leading-6 text-text-muted">
          {data.employee.position} · {data.employee.department}
        </p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Attendance this month"
          value={`${data.currentMonthAttendanceDays} days`}
          icon={CalendarCheck}
          tone="success"
        />
        <StatCard
          label="Pending leave"
          value={data.pendingLeaves}
          icon={Clock3}
          tone="warning"
        />
        <StatCard
          label="Latest net pay"
          value={payslipAmount}
          icon={Banknote}
          tone="info"
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <article className="rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-extrabold tracking-widest text-text-subtle uppercase">
                Today&apos;s attendance
              </p>
              <h2 className="mt-2 text-xl font-extrabold text-text">
                {attendanceLabel}
              </h2>
            </div>
            <Badge tone={data.todayAttendance.status === "CHECKED_IN" ? "success" : "neutral"}>
              {attendanceLabel}
            </Badge>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-surface-muted p-4">
              <dt className="text-xs font-bold text-text-subtle">Check in</dt>
              <dd className="mt-2 text-lg font-extrabold text-text">
                {data.todayAttendance.checkIn ?? "—"}
              </dd>
            </div>
            <div className="rounded-lg bg-surface-muted p-4">
              <dt className="text-xs font-bold text-text-subtle">Check out</dt>
              <dd className="mt-2 text-lg font-extrabold text-text">
                {data.todayAttendance.checkOut ?? "—"}
              </dd>
            </div>
          </dl>

          <button
            className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-text text-sm font-extrabold text-surface shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            disabled={data.todayAttendance.status === "CHECKED_IN"}
          >
            <LogIn className="size-5" aria-hidden="true" />
            {data.todayAttendance.status === "CHECKED_IN" ? "Currently checked in" : "Check in"}
          </button>
        </article>

        <article className="rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <p className="text-xs font-extrabold tracking-widest text-text-subtle uppercase">
            Quick access
          </p>
          <h2 className="mt-2 text-xl font-extrabold text-text">Your workspace</h2>
          <div className="mt-6 grid gap-3">
            <button
              className="flex items-center gap-4 rounded-lg border border-border p-4 text-left text-sm font-bold text-text transition hover:border-border-strong hover:bg-surface-muted"
              type="button"
            >
              <CalendarCheck className="size-5 text-warning-text" aria-hidden="true" />
              Request leave
            </button>
            <button
              className="flex items-center gap-4 rounded-lg border border-border p-4 text-left text-sm font-bold text-text transition hover:border-border-strong hover:bg-surface-muted"
              type="button"
            >
              <FileText className="size-5 text-info-text" aria-hidden="true" />
              View latest payslip
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}
