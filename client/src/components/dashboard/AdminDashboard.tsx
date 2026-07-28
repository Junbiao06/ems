import {
  Building2,
  CalendarClock,
  ClockAlert,
  LogIn,
  UserCheck,
  Users,
} from "lucide-react";
import type { AdminDashboardData } from "@/types/dashboard";
import { AttendanceSummary } from "./AttendanceSummary";
import { DashboardDate } from "./DashboardDate";
import { StatCard } from "./StatCard";
import { TeamActivity } from "./TeamActivity";

type AdminDashboardProps = {
  data: AdminDashboardData;
};

export function AdminDashboard({ data }: AdminDashboardProps) {
  const onLeaveToday = data.teamActivity.onLeave.length;
  const notCheckedInToday = Math.max(
    data.activeEmployees - data.checkedInToday - onLeaveToday,
    0,
  );
  const attendanceRate =
    data.activeEmployees === 0
      ? 0
      : Math.round(
          (data.checkedInToday / data.activeEmployees) * 100,
        );

  return (
    <div className="mx-auto w-full max-w-7xl">
      <header>
        <DashboardDate />
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
          Welcome back, Avery.
        </h1>
        <p className="mt-2 text-sm leading-6 text-text-muted">
          Here&apos;s what&apos;s happening across your team today.
        </p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Employees"
          value={data.totalEmployees}
          icon={Users}
        />
        <StatCard
          label="Departments"
          value={data.totalDepartments}
          icon={Building2}
        />
        <StatCard
          label="Checked in"
          value={data.checkedInToday}
          icon={UserCheck}
        />
        <StatCard
          label="Late today"
          value={data.lateToday}
          icon={ClockAlert}
        />
        <StatCard
          label="Pending leave"
          value={data.pendingLeaves}
          icon={CalendarClock}
        />
        <StatCard
          label="Attendance rate"
          value={`${attendanceRate}%`}
          icon={LogIn}
        />
      </section>

      <section className="mt-6 grid min-w-0 gap-6 xl:grid-cols-3">
        <TeamActivity data={data.teamActivity} />
        <AttendanceSummary
          present={data.checkedInToday}
          onLeave={onLeaveToday}
          late={data.lateToday}
          notCheckedIn={notCheckedInToday}
          attendanceRate={attendanceRate}
        />
      </section>
    </div>
  );
}
