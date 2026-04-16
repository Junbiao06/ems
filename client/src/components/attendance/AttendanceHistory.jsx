import dayjs from "dayjs";

const th = [
  "Date",
  "Check In",
  "Check Out",
  "Working Hours",
  "Day Type",
  "status",
];

const AttendanceHistory = ({ history }) => {
  return (
    <div className="-mt-6">
      <h3 className="text-xl font-semibold px-6 py-4">Recent Activity</h3>
      <div className="rounded-4xl overflow-hidden">
        <table className="w-full pt-6">
          <thead className="bg-primary">
            <tr className="">
              {th.map((item, index) => (
                <th key={index} className="px-4 py-6">
                  {item.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="">
            {history.length === 0 ? (
              <tr>
                <td colSpan={th.length} className="text-center py-6">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              history.map((item, index) => (
                <tr
                  key={item._id || item.id}
                  className={`border-b border-secondary/20 hover:bg-primary-hover transition-colors text-center ${index % 2 === 0 ? "bg-primary/30" : "bg-primary/80"}`}
                >
                  <td className="px-4 py-4 border-l border-secondary/20 border-dashed">
                    {dayjs(item.date).format("MMM D, YYYY")}
                  </td>
                  <td className="px-4 py-4">
                    {dayjs(item.checkIn).format("HH:mm:ss") || "-"}
                  </td>
                  <td className="px-4 py-4">
                    {dayjs(item.checkOut).format("HH:mm:ss") || "-"}
                  </td>
                  <td className="px-4 py-4">
                    {item.workingHours + "h" || "-"}
                  </td>
                  <td className="px-4 py-4">{item.dayType}</td>
                  <td className="px-4 py-4 border-r border-secondary/20 border-dashed">
                    <span
                      className={`px-2 py-1 rounded-2xl ${item.status === "PRESENT" ? "bg-success" : "bg-warning"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="bg-primary text-center ">
            <tr>
              <td colSpan={6} className=" py-4">
                Total Records: {history.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-32" />
    </div>
  );
};

export default AttendanceHistory;
