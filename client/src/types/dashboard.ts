export type AdminDashboardData = {
  role: "ADMIN";
  totalEmployees: number;
  invitedEmployees: number;
  activeEmployees: number;
  totalDepartments: number;
  checkedInToday: number;
  lateToday: number;
  pendingLeaves: number;
  attendanceTrend: AttendanceTrendItem[];
};

export type AttendanceTrendItem = {
  dateLabel: string;
  onTime: number;
  late: number;
  absent: number;
};

export type EmployeeDashboardData = {
  role: "EMPLOYEE";
  employee: {
    id: string;
    fullName: string;
    department: string;
    position: string;
  };
  todayAttendance: {
    status: "NOT_CHECKED_IN" | "CHECKED_IN" | "CHECKED_OUT";
    checkIn: string | null;
    checkOut: string | null;
  };
  currentMonthAttendanceDays: number;
  pendingLeaves: number;
  latestPayslip: {
    period: string;
    netPayMinor: number;
    currency: "CNY";
  } | null;
};

export type DashboardData = AdminDashboardData | EmployeeDashboardData;
