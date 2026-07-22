import { useSearchParams } from "react-router-dom";
import { AdminDashboard } from "../../components/dashboard/AdminDashboard";
import { EmployeeDashboard } from "../../components/dashboard/EmployeeDashboard";
import {
  mockAdminDashboard,
  mockEmployeeDashboard,
} from "../../mocks/dashboard";

export function DashboardPage() {
  const [searchParams] = useSearchParams();
  const data =
    searchParams.get("role") === "employee"
      ? mockEmployeeDashboard
      : mockAdminDashboard;

  return data.role === "ADMIN" ? (
    <AdminDashboard data={data} />
  ) : (
    <EmployeeDashboard data={data} />
  );
}
