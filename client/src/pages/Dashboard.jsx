import { useEffect, useState } from "react";
import {
  dummyAdminDashboardData,
  dummyEmployeeDashboardData,
} from "../assets/assets";
import Loading from "../components/ui/Loading";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import EmployeeDashboard from "../components/dashboard/EmployeeDashboard";

const Dashboard = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const role = "EMPLOYEE" || "ADMIN";

  useEffect(() => {
    setData(dummyEmployeeDashboardData);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, []);

  if (loading) return <Loading />;
  if (!data) return <p>Fail to load dashboard</p>;

  return (
    <>
      {role === "ADMIN" ? (
        <AdminDashboard data={dummyAdminDashboardData} />
      ) : (
        <EmployeeDashboard data={data} />
      )}
    </>
  );
};

export default Dashboard;
