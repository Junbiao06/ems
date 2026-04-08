import {
  ArrowRight,
  Building2Icon,
  Calendar1Icon,
  FileText,
  Footprints,
  Link,
  UserIcon,
} from "lucide-react";

const AdminDashboard = ({ data }) => {
  const stat = [
    {
      icon: UserIcon,
      value: data.totalEmployees,
      label: "Total Employees",
      description: "Active workforce",
    },
    {
      icon: Building2Icon,
      value: data.totalDepartments,
      label: "Departments",
      description: "Organization structure",
    },
    {
      icon: Calendar1Icon,
      value: data.totalAttandance,
      label: "Today's Attendance",
      description: "Checked in today",
    },
    {
      icon: FileText,
      value: data.pendingLeaves,
      label: "Pending Leaves",
      description: "Awaiting approval",
    },
  ];
  return (
    <div className="animate-fade-in space-y-12">
      <div className="space-y-1">
        <h1 className="text-3xl flex items-baseline gap-2">
          Dashboard
          <p className="text-sm px-2 rounded-full bg-surface">admin</p>
        </h1>
        <div className="text-secondary">
          Employee Management System created by junbiao.
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {stat.map((item, index) => (
          <div
            className="flex items-center justify-between gap-4 rounded-2xl p-6 relative bg-primary transition-all hover:-translate-y-2 duration-200 group overflow-hidden"
            key={index}
          >
            <div className="absolute inset-0 bottom-0 w-2 bg-secondary rounded-l-full group-hover:bg-surface" />
            <div className="flex flex-col">
              <div className="tracking-wider">{item.label}</div>
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

export default AdminDashboard;
