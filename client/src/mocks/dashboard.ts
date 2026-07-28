import type {
  AdminDashboardData,
  EmployeeDashboardData,
} from "@/types/dashboard";
import { mockAdminAttendance } from "./adminAttendance";
import { mockLeaves } from "./leaves";

const businessTimeZone = "Asia/Shanghai";

function currentBusinessDate() {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: businessTimeZone,
  }).format(new Date());
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: businessTimeZone,
  }).format(new Date(`${value}T00:00:00+08:00`));
}

function formatLeaveDates(startDate: string, endDate: string) {
  const start = formatShortDate(startDate);
  const end = formatShortDate(endDate);

  return startDate === endDate ? start : `${start} – ${end}`;
}

function formatCheckInTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: businessTimeZone,
  }).format(new Date(value));
}

const businessDate = currentBusinessDate();
const leaveTypeLabels = {
  SICK: "Sick",
  CASUAL: "Casual",
  ANNUAL: "Annual",
};

export const mockAdminDashboard: AdminDashboardData = {
  role: "ADMIN",
  totalEmployees: 148,
  invitedEmployees: 12,
  activeEmployees: 136,
  totalDepartments: 10,
  checkedInToday: 121,
  lateToday: 15,
  pendingLeaves: 15,
  teamActivity: {
    onLeave: mockLeaves
      .filter(
        (leave) =>
          leave.status === "APPROVED" &&
          leave.startDate <= businessDate &&
          leave.endDate >= businessDate,
      )
      .map((leave) => ({
        employeeId: leave.employee.id,
        fullName: leave.employee.fullName,
        note: formatLeaveDates(leave.startDate, leave.endDate),
      })),
    leaveRequests: mockLeaves
      .filter((leave) => leave.status === "PENDING")
      .map((leave) => ({
        employeeId: leave.employee.id,
        fullName: leave.employee.fullName,
        note: `${leaveTypeLabels[leave.type]} · ${formatLeaveDates(
          leave.startDate,
          leave.endDate,
        )}`,
      })),
    lateArrivals: mockAdminAttendance
      .filter(
        (record) =>
          record.businessDate === businessDate && record.status === "LATE",
      )
      .map((record) => ({
        employeeId: record.employee.id,
        fullName: record.employee.fullName,
        note: `Checked in at ${formatCheckInTime(record.checkInAt)}`,
      })),
  },
};

export const mockEmployeeDashboard: EmployeeDashboardData = {
  role: "EMPLOYEE",
  employee: {
    id: "emp_005",
    fullName: "Jordan Lee",
    department: "Operations",
    position: "Operations Coordinator",
  },
  todayAttendance: {
    status: "CHECKED_IN",
    checkIn: "08:52",
    checkOut: null,
  },
  currentMonthAttendanceDays: 17,
  pendingLeaves: 1,
  latestPayslip: {
    period: "June 2026",
    netPayMinor: 1265000,
    currency: "CNY",
  },
};
