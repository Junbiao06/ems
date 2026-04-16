import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const PayslipList = ({ payslips, isAdmin }) => {
  const navigate = useNavigate();
  const th = [
    ...(isAdmin ? ["Employee"] : []),
    "Period",
    "Basic Salary",
    "Net Salary",
    "Actions",
  ];
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
            {payslips.length === 0 ? (
              <tr>
                <td colSpan={th.length} className="text-center py-6">
                  No payslips found.
                </td>
              </tr>
            ) : (
              payslips.map((item, index) => (
                <tr
                  key={item._id || item.id}
                  className={`border-b border-secondary/20 hover:bg-primary-hover transition-colors text-center ${index % 2 === 0 ? "bg-primary/30" : "bg-primary/80"}`}
                >
                  {isAdmin && (
                    <td className="px-4 py-4 border-l border-secondary/20 border-dashed">
                      {item.employee?.firstName + " " + item.employee?.lastName}
                    </td>
                  )}

                  <td className="px-4 py-4">
                    {dayjs(new Date(item.year, item.month - 1)).format(
                      "MMM, YYYY",
                    )}
                  </td>
                  <td className="px-4 py-4">
                    ${item.basicSalary.toLocaleString() || "-"}
                  </td>
                  <td className="px-4 py-4">
                    ${item.netSalary.toLocaleString() || "-"}
                  </td>

                  <td className="px-4 py-4">
                    <button
                      className="bg-surface p-2 rounded-xl"
                      onClick={() =>
                        navigate(`/print/payslips/${item._id || item.id}`)
                      }
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="bg-primary text-center ">
            <tr>
              <td colSpan={6} className=" py-4">
                Total Records: {payslips.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-32" />
    </div>
  );
};

export default PayslipList;
