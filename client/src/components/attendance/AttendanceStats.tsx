import { CalendarDays, ClockAlert, Timer } from "lucide-react";
import type { AttendanceRecord } from "@/types/attendance";
import { StatCard } from "../dashboard/StatCard";

type AttendanceStatsProps = {
  records: AttendanceRecord[];
};

function formatAverageMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m`;
}

export function AttendanceStats({ records }: AttendanceStatsProps) {
  const lateDays = records.filter((record) => record.status === "LATE").length;
  const completedRecords = records.filter(
    (record): record is AttendanceRecord & { workingMinutes: number } =>
      record.workingMinutes !== null,
  );
  const averageMinutes = completedRecords.length
    ? Math.round(
        completedRecords.reduce(
          (total, record) => total + record.workingMinutes,
          0,
        ) / completedRecords.length,
      )
    : null;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard
        label="Days present"
        value={records.length}
        icon={CalendarDays}
      />
      <StatCard
        label="Late arrivals"
        value={lateDays}
        icon={ClockAlert}
        tone="warning"
      />
      <StatCard
        label="Average workday"
        value={averageMinutes === null ? "—" : formatAverageMinutes(averageMinutes)}
        icon={Timer}
        tone="info"
      />
    </section>
  );
}
