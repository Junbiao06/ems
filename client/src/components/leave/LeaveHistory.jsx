import { useState } from "react";
import dayjs from "dayjs";
import { Check, X } from "lucide-react";

const LeaveHistory = ({ leaves, isAdmin, onUpdate }) => {
  const [processing, setProcessing] = useState(null);

  const th = [
    ...(isAdmin ? ["Employee"] : []),
    "Type",
    "Dates",
    "Reason",
    "Status",
    ...(isAdmin ? ["Actions"] : []),
  ];
  const handleStatusChange = async (id, newStatus) => {
    setProcessing(id);
  };

  return (
    <div className="">
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
            {leaves.length === 0 ? (
              <tr>
                <td colSpan={th.length} className="text-center py-6">
                  No leave records found.
                </td>
              </tr>
            ) : (
              leaves.map((item, index) => (
                <tr
                  key={item._id || item.id}
                  className={`border-b border-secondary/20 hover:bg-primary-hover transition-colors text-center ${index % 2 === 0 ? "bg-primary/30" : "bg-primary/80"}`}
                >
                  {isAdmin && (
                    <td className="px-4 py-4 border-l border-secondary/20 border-dashed">
                      {item.employee?.firstName + " " + item.employee?.lastName}
                    </td>
                  )}
                  <td
                    className={`px-4 py-4 ${!isAdmin && "border-l border-secondary/20 border-dashed"}`}
                  >
                    {item.type}
                  </td>
                  <td className="px-4 py-4">
                    {item?.startDate && item?.endDate
                      ? `${dayjs(item.startDate).format("MMM DD")} - ${dayjs(item.endDate).format("MMM DD")}`
                      : item?.startDate
                        ? dayjs(item.startDate).format("MMM DD")
                        : "-"}
                  </td>
                  <td className="px-4 py-4">{item.reason || "-"}</td>
                  <td
                    className={`px-4 py-4 ${!isAdmin && "border-r border-secondary/20 border-dashed"}`}
                  >
                    <span
                      className={`px-2 py-1 rounded-2xl ${item.status === "APPROVED" ? "bg-success" : item.status === "REJECTED" ? "bg-warning" : "bg-surface"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-4 border-r border-secondary/20 border-dashed">
                      {item.status === "PENDING" && (
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() =>
                              handleStatusChange(
                                item._id || item.id,
                                "APPROVED",
                              )
                            }
                            disabled={!!processing}
                            className="bg-success rounded-2xl p-1"
                          >
                            {processing === (item._id || item.id) ? (
                              <p className="flex justify-center items-center gap-3">
                                <div className="w-6 h-6 border-3 border-border border-t-primary rounded-full animate-spin" />
                              </p>
                            ) : (
                              <Check />
                            )}
                          </button>

                          <button
                            onClick={() =>
                              handleStatusChange(
                                item._id || item.id,
                                "REJECTED",
                              )
                            }
                            disabled={!!processing}
                            className="bg-warning rounded-2xl p-1"
                          >
                            {processing === (item._id || item.id) ? (
                              <p className="flex justify-center items-center gap-3">
                                <div className="w-6 h-6 border-3 border-border border-t-primary rounded-full animate-spin" />
                              </p>
                            ) : (
                              <X />
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="bg-primary text-center ">
            <tr>
              <td colSpan={6} className=" py-4">
                Total Records: {leaves.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-32" />
    </div>
  );
};

export default LeaveHistory;
