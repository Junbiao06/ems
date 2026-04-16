import { AlertCircle, Calendar, Clock10Icon } from "lucide-react";

const AttendanceStats = ({ history }) => {
  const totalPresent = history.filter(
    (item) => item.status === "PRESENT" || item.status === "LATE",
  ).length;

  const totalLate = history.filter((item) => item.status === "LATE").length;

  const stats = [
    { label: "Days Present", value: totalPresent, icon: Calendar },
    { label: "Late Arrivals", value: totalLate, icon: AlertCircle },
    {
      label: "Avg. Working Hours",
      value: "8.5h",
      icon: Clock10Icon,
    },
  ];
  return (
    <div className="">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {stats.map((item, index) => (
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
    </div>
  );
};

export default AttendanceStats;
