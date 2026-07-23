import { AdminDashboard } from "../../components/dashboard/AdminDashboard";
import { EmployeeDashboard } from "../../components/dashboard/EmployeeDashboard";
import { getCurrentMockUser } from "../../mocks/auth";
import {
  mockAdminDashboard,
  mockEmployeeDashboard,
} from "../../mocks/dashboard";

export function DashboardPage() {
  const user = getCurrentMockUser();
  const data =
    user.role === "EMPLOYEE" ? mockEmployeeDashboard : mockAdminDashboard;

  return data.role === "ADMIN" ? (
    <AdminDashboard data={data} />
  ) : (
    <EmployeeDashboard data={data} />
  );
}
