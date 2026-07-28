export type AdminDashboardData = {
  role: "ADMIN";
  totalEmployees: number;
  invitedEmployees: number;
  activeEmployees: number;
  totalDepartments: number;
  checkedInToday: number;
  lateToday: number;
  pendingLeaves: number;
  teamActivity: AdminTeamActivity;
};

export type TeamActivityItem = {
  employeeId: string;
  fullName: string;
  note: string;
};

export type AdminTeamActivity = {
  onLeave: TeamActivityItem[];
  leaveRequests: TeamActivityItem[];
  lateArrivals: TeamActivityItem[];
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
