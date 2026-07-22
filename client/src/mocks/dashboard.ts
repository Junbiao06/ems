import type {
  AdminDashboardData,
  EmployeeDashboardData,
} from "@/types/dashboard";

export const mockAdminDashboard: AdminDashboardData = {
  role: "ADMIN",
  totalEmployees: 148,
  invitedEmployees: 12,
  activeEmployees: 136,
  totalDepartments: 10,
  checkedInToday: 121,
  lateToday: 7,
  pendingLeaves: 9,
  attendanceTrend: [
    {
      dateLabel: "Jul 14",
      onTime: 121,
      late: 5,
      absent: 10,
    },
    {
      dateLabel: "Jul 15",
      onTime: 123,
      late: 6,
      absent: 7,
    },
    {
      dateLabel: "Jul 16",
      onTime: 119,
      late: 8,
      absent: 9,
    },
    {
      dateLabel: "Jul 17",
      onTime: 124,
      late: 4,
      absent: 8,
    },
    {
      dateLabel: "Jul 20",
      onTime: 122,
      late: 5,
      absent: 9,
    },
    {
      dateLabel: "Jul 21",
      onTime: 126,
      late: 3,
      absent: 7,
    },
    {
      dateLabel: "Jul 22",
      onTime: 114,
      late: 7,
      absent: 15,
    },
  ],
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
