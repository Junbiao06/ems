import {
  Building2,
  CalendarClock,
  ClockAlert,
  LogIn,
  UserCheck,
  Users,
} from "lucide-react";
import { lazy, Suspense } from "react";
import type { AdminDashboardData } from "../../types/dashboard";
import { AttendanceTable } from "./AttendanceTable";
import { StatCard } from "./StatCard";

const AttendanceChart = lazy(async () => {
  const chartModule = await import("./AttendanceChart");

  return { default: chartModule.AttendanceChart };
});

type AdminDashboardProps = {
  data: AdminDashboardData;
};

export function AdminDashboard({ data }: AdminDashboardProps) {
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeZone: "Asia/Shanghai",
  }).format(new Date());

  return (
    <div className="mx-auto w-full max-w-7xl">
      <header>
        <p className="text-xs font-extrabold tracking-widest text-text-subtle uppercase">
          {dateLabel}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
          Good morning, Avery.
        </h1>
        <p className="mt-2 text-sm leading-6 text-text-muted">
          Here is today&apos;s overview of your organization.
        </p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total employees"
          value={data.totalEmployees}
          icon={Users}
        />
        <StatCard
          label="Departments"
          value={data.totalDepartments}
          icon={Building2}
          tone="info"
        />
        <StatCard
          label="Checked in today"
          value={data.checkedInToday}
          icon={UserCheck}
          tone="success"
        />
        <StatCard
          label="Late arrivals"
          value={data.lateToday}
          icon={ClockAlert}
          tone="warning"
        />
        <StatCard
          label="Pending leave"
          value={data.pendingLeaves}
          icon={CalendarClock}
          tone="warning"
        />
        <StatCard
          label="Attendance rate"
          value={`${Math.round((data.checkedInToday / data.activeEmployees) * 100)}%`}
          icon={LogIn}
          tone="success"
        />
      </section>

      <section className="mt-6 grid min-w-0 gap-6 xl:grid-cols-3">
        <Suspense
          fallback={
            <div className="h-[444px] animate-pulse rounded-xl border border-border bg-surface-muted xl:col-span-2" />
          }
        >
          <AttendanceChart data={data.attendanceTrend} />
        </Suspense>
        <AttendanceTable data={data.attendanceTrend} />
      </section>
    </div>
  );
}
