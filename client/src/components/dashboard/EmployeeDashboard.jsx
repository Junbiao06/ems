import {
  ArrowRight,
  CalendarIcon,
  DollarSignIcon,
  FileTextIcon,
  Footprints,
} from "lucide-react";
import { Link } from "react-router-dom";

const EmployeeDashboard = ({ data }) => {
  const employee = data.employee;

  const card = [
    {
      icon: CalendarIcon,
      value: data.currentMonthAttendance,
      title: "Days Present",
      subtitle: "This month",
    },
    {
      icon: FileTextIcon,
      value: data.pendingLeaves,
      title: "Pending Leaves",
      subtitle: "Awaiting approval",
    },
    {
      icon: DollarSignIcon,
      value: data.latestPayslip
        ? `$${data.latestPayslip.netSalary.toLocaleString()}`
        : "N/A",
      title: "Latest Payslip",
      subtitle: "Most recent payout",
    },
  ];

  return (
    <div className="animate-fade-in space-y-12">
      <div className="space-y-1">
        <h1 className="text-3xl font-playwrite">
          Welcome, {employee?.firstName}!
        </h1>
        <div className="text-secondary">
          {employee?.position} - {employee?.department || "No Department"}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {card.map((item, index) => (
          <div
            className="flex items-center justify-between gap-4 rounded-2xl p-6 relative bg-primary transition-all hover:-translate-y-2 duration-200 group overflow-hidden"
            key={index}
          >
            <div className="absolute inset-0 bottom-0 w-2 bg-secondary rounded-l-full group-hover:bg-surface" />
            <div className="flex flex-col">
              <div className="tracking-wider">{item.title}</div>
              <div className="text-2xl font-semibold">{item.value}</div>
            </div>
            <div className="bg-primary-hover rounded-full p-3 group-hover:bg-surface">
              <item.icon />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to={"/attendance"}
          className="bg-surface flex p-4 rounded-2xl gap-4 items-center"
        >
          Mark Attendance <ArrowRight />
        </Link>
        <Link
          to={"/leave"}
          className="bg-primary flex p-4 rounded-2xl gap-4 items-center"
        >
          Apply Leave
          <Footprints />
        </Link>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
