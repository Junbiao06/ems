import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { dummyPayslipData } from "../assets/assets";
import { ArrowLeft, Printer } from "lucide-react";

const currency = (n) =>
  typeof n === "number"
    ? `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : "-";

const PrintPayslip = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const payslip = useMemo(
    () => dummyPayslipData.find((p) => (p._id || p.id) === id),
    [id],
  );

  if (!payslip) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center space-y-6">
          <h1 className="text-2xl">Payslip not found</h1>
          <button
            className="bg-surface px-4 py-2 rounded-xl"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const employee = payslip.employee || {};
  const period = dayjs(new Date(payslip.year, (payslip.month || 1) - 1)).format(
    "MMMM YYYY",
  );
  const gross = (payslip.basicSalary || 0) + (payslip.allowances || 0);
  const deductions = payslip.deductions || 0;
  const net = payslip.netSalary ?? gross - deductions;

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-200 mx-auto border border-black/20 rounded-2xl overflow-hidden">
        <div className="px-8 py-6 bg-primary/30 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Monthly Payslip</h1>
            <p className="text-secondary"> {period}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-medium">Example Corp</p>
            <p className="text-secondary">123 Main St, City</p>
          </div>
        </div>

        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p>
              <span className="text-secondary mr-2">Employee:</span>
              {employee.firstName} {employee.lastName}
            </p>
            <p>
              <span className="text-secondary mr-2">Position:</span>
              {employee.position || "—"}
            </p>
            <p>
              <span className="text-secondary mr-2">Department:</span>
              {employee.department || "—"}
            </p>
          </div>
          <div className="space-y-1 md:text-right">
            <p>
              <span className="text-secondary mr-2">Employee ID:</span>
              {employee.id || employee._id || "—"}
            </p>
            <p>
              <span className="text-secondary mr-2">Email:</span>
              {employee.email || employee.user?.email || "—"}
            </p>
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="overflow-hidden rounded-2xl border border-black/10">
            <table className="w-full">
              <thead className="bg-primary/50">
                <tr>
                  <th className="text-left px-6 py-4">Description</th>
                  <th className="text-right px-6 py-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="odd:bg-primary/20">
                  <td className="px-6 py-3">Basic Salary</td>
                  <td className="px-6 py-3 text-right">
                    {currency(payslip.basicSalary)}
                  </td>
                </tr>
                <tr className="odd:bg-primary/20">
                  <td className="px-6 py-3">Allowances</td>
                  <td className="px-6 py-3 text-right">
                    {currency(payslip.allowances)}
                  </td>
                </tr>
                <tr className="odd:bg-primary/20">
                  <td className="px-6 py-3">Gross Pay</td>
                  <td className="px-6 py-3 text-right">{currency(gross)}</td>
                </tr>
                <tr className="odd:bg-primary/20">
                  <td className="px-6 py-3">Deductions</td>
                  <td className="px-6 py-3 text-right">
                    {currency(deductions)}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-primary/60">
                  <td className="px-6 py-4 font-medium">Net Salary</td>
                  <td className="px-6 py-4 text-right font-semibold">
                    {currency(net)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="text-secondary text-sm mt-6 print:hidden">
            This is a system generated payslip. If you find any discrepancy,
            please contact HR.
          </div>
        </div>
      </div>

      <div className="print:hidden max-w-200 mx-auto mt-6 flex justify-between items-center">
        <button
          className="bg-surface px-4 py-2 rounded-xl inline-flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex gap-3">
          <button
            className="bg-surface px-4 py-2 rounded-xl inline-flex items-center gap-2"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintPayslip;
