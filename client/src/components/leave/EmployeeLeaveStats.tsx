import { CalendarCheck, CalendarDays, Clock3 } from "lucide-react";
import type { LeaveRecord } from "@/types/leave";
import { StatCard } from "../dashboard/StatCard";

type EmployeeLeaveStatsProps = {
  annualAllowance: number;
  leaves: LeaveRecord[];
};

function leaveDays(startDate: string, endDate: string) {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);

  return Math.floor((end - start) / 86_400_000) + 1;
}

export function EmployeeLeaveStats({
  annualAllowance,
  leaves,
}: EmployeeLeaveStatsProps) {
  const currentYear = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    timeZone: "Asia/Shanghai",
  }).format(new Date());
  const approvedThisYear = leaves.filter(
    (leave) =>
      leave.status === "APPROVED" &&
      leave.startDate.startsWith(currentYear),
  );
  const approvedDays = approvedThisYear.reduce(
    (total, leave) => total + leaveDays(leave.startDate, leave.endDate),
    0,
  );
  const annualLeaveUsed = approvedThisYear
    .filter((leave) => leave.type === "ANNUAL")
    .reduce(
      (total, leave) => total + leaveDays(leave.startDate, leave.endDate),
      0,
    );
  const pendingRequests = leaves.filter(
    (leave) => leave.status === "PENDING",
  ).length;

  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard
        label="Annual balance"
        value={`${Math.max(annualAllowance - annualLeaveUsed, 0)} days`}
        icon={CalendarDays}
      />
      <StatCard
        label="Pending requests"
        value={pendingRequests}
        icon={Clock3}
        tone="warning"
      />
      <StatCard
        label="Approved this year"
        value={`${approvedDays} days`}
        icon={CalendarCheck}
        tone="success"
      />
    </section>
  );
}
