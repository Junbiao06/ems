import { useEffect, useState } from "react";
import { dummyEmployeeDashboardData } from "../assets/assets";
import Loading from "../components/dashboard/Loading";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import EmployeeDashboard from "../components/dashboard/EmployeeDashboard";

const Dashboard = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const role = "ADMIN";

  useEffect(() => {
    setData(dummyEmployeeDashboardData);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  if (loading) return <Loading />;
  if (!data) return <p>Fail to load dashboard</p>;

  return (
    <div className="p-8">
      {role === "ADMIN" ? (
        <AdminDashboard data={data} />
      ) : (
        <EmployeeDashboard data={data} />
      )}
    </div>
  );
};

export default Dashboard;
