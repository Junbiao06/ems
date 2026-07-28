import { useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { AttendanceFilters } from "../../components/attendance/AttendanceFilters";
import { AttendanceHistory } from "../../components/attendance/AttendanceHistory";
import { AttendanceStats } from "../../components/attendance/AttendanceStats";
import { TodayAttendance } from "../../components/attendance/TodayAttendance";
import { PageHeader } from "../../components/layout/PageHeader";
import { mockAttendance } from "../../mocks/attendance";
import {
  AttendanceDayTypeSchema,
  AttendanceStatusSchema,
  type AttendanceRecord,
} from "@/types/attendance";

const pageSize = 5;
const businessTimeZone = "Asia/Shanghai";

function currentBusinessDate() {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: businessTimeZone,
  }).format(new Date());
}

function currentBusinessMonth() {
  return currentBusinessDate().slice(0, 7);
}

function isLateCheckIn(date: Date) {
  const timeParts = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: businessTimeZone,
  }).formatToParts(date);
  const hour = Number(timeParts.find((part) => part.type === "hour")?.value);
  const minute = Number(timeParts.find((part) => part.type === "minute")?.value);

  return hour > 9 || (hour === 9 && minute > 0);
}

function attendanceDayType(
  workingMinutes: number,
): NonNullable<AttendanceRecord["dayType"]> {
  if (workingMinutes >= 480) {
    return "FULL_DAY";
  }

  if (workingMinutes >= 360) {
    return "THREE_QUARTER_DAY";
  }

  if (workingMinutes >= 240) {
    return "HALF_DAY";
  }

  return "SHORT_DAY";
}

export function AttendancePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [records, setRecords] = useState<AttendanceRecord[]>(() => [
    ...mockAttendance,
  ]);
  const businessDate = currentBusinessDate();
  const defaultMonth = currentBusinessMonth();
  const requestedMonth = searchParams.get("month") ?? "";
  const selectedMonth = /^\d{4}-\d{2}$/.test(requestedMonth)
    ? requestedMonth
    : defaultMonth;
  const dayTypeResult = AttendanceDayTypeSchema.safeParse(
    searchParams.get("dayType"),
  );
  const statusResult = AttendanceStatusSchema.safeParse(searchParams.get("status"));
  const selectedDayType = dayTypeResult.success ? dayTypeResult.data : "";
  const selectedStatus = statusResult.success ? statusResult.data : "";
  const todayRecord = records.find(
    (record) => record.businessDate === businessDate,
  );
  const monthlyRecords = records.filter((record) =>
    record.businessDate.startsWith(selectedMonth),
  );
  const filteredRecords = monthlyRecords.filter((record) => {
    const matchesDayType =
      !selectedDayType || record.dayType === selectedDayType;
    const matchesStatus = !selectedStatus || record.status === selectedStatus;

    return matchesDayType && matchesStatus;
  });
  const requestedPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;
  const visibleRecords = filteredRecords.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  function updatePage(nextPage: number) {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (nextPage === 1) {
        nextParams.delete("page");
      } else {
        nextParams.set("page", String(nextPage));
      }

      return nextParams;
    });
  }

  function updateFilter(
    name: "month" | "dayType" | "status",
    value: string,
  ) {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (value && !(name === "month" && value === defaultMonth)) {
        nextParams.set(name, value);
      } else {
        nextParams.delete(name);
      }

      nextParams.delete("page");
      return nextParams;
    });
  }

  function clearFilters() {
    setSearchParams({});
  }

  function checkIn() {
    const now = new Date();
    const newRecord: AttendanceRecord = {
      id: crypto.randomUUID(),
      employeeId: "emp_005",
      businessDate,
      checkInAt: now.toISOString(),
      checkOutAt: null,
      status: isLateCheckIn(now) ? "LATE" : "PRESENT",
      workingMinutes: null,
      dayType: null,
      checkoutSource: null,
    };

    setRecords((currentRecords) => [newRecord, ...currentRecords]);
    setSearchParams({});
    toast.success("Checked in successfully.");
  }

  function checkOut() {
    if (!todayRecord || todayRecord.checkOutAt) {
      return;
    }

    const now = new Date();
    const workingMinutes = Math.max(
      0,
      Math.floor((now.getTime() - new Date(todayRecord.checkInAt).getTime()) / 60000),
    );

    setRecords((currentRecords) =>
      currentRecords.map((record) => {
        if (record.id !== todayRecord.id) {
          return record;
        }

        return {
          ...record,
          checkOutAt: now.toISOString(),
          workingMinutes,
          dayType: attendanceDayType(workingMinutes),
          checkoutSource: "EMPLOYEE",
        };
      }),
    );
    toast.success("Checked out successfully.");
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        eyebrow="My workday"
        title="Attendance"
        description="Track your work hours and review recent attendance."
      />

      <div className="mt-8 grid gap-6">
        <TodayAttendance
          record={todayRecord}
          onCheckIn={checkIn}
          onCheckOut={checkOut}
        />
        <AttendanceFilters
          month={selectedMonth}
          dayType={selectedDayType}
          status={selectedStatus}
          hasFilters={
            selectedMonth !== defaultMonth ||
            Boolean(selectedDayType) ||
            Boolean(selectedStatus)
          }
          onChange={updateFilter}
          onClear={clearFilters}
        />
        <AttendanceStats records={monthlyRecords} />
        <AttendanceHistory
          records={visibleRecords}
          page={page}
          totalPages={totalPages}
          onPageChange={updatePage}
        />
      </div>
    </div>
  );
}
