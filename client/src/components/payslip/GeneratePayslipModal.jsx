import { X } from "lucide-react";
import { useState } from "react";

const GeneratePayslipModal = ({ employees, open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
      onClose();
    }, 2000);
  };

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-2xl p-8 w-full max-w-150 shadow-2xl max-h-150 overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-8 ">
          <div className="my-4">
            <h2 className="text-3xl">Generate Monthly Payslip</h2>
            <p className="text-secondary">
              Submit your leave request for approval.
            </p>
          </div>

          <button className="cursor-pointer" onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="animate-fade-in space-y-4">
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1 md:col-span-2">
              <label>Employee</label>
              <select name="employeeId" required>
                <option value="">Select an employee</option>
                {employees.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item?.firstName} {item?.lastName} ({item?.position})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label>Month</label>
              <select name="month" required>
                <option value="">Select a month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {/* {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })} */}
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label>Year</label>
              <input
                type="number"
                defaultValue={new Date().getFullYear()}
                name="year"
              />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label>Basic Salary</label>
              <input
                type="number"
                name="basicSalary"
                placeholder="5000"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label>Allowances</label>
              <input type="number" defaultValue={0} name="allowances" />
            </div>
            <div className="flex flex-col gap-1">
              <label>Deductions</label>
              <input type="number" defaultValue={0} name="deductions" />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-10">
            <button
              type="button"
              className="hover:bg-primary bg-primary-hover rounded-2xl px-4 py-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-surface hover:bg-surface/70 rounded-2xl px-4 py-2"
            >
              {loading ? (
                <p className="flex justify-center items-center gap-3">
                  <div className="w-6 h-6 border-3 border-border border-t-primary rounded-full animate-spin" />
                  <p>Processing...</p>
                </p>
              ) : (
                <p>Generate</p>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneratePayslipModal;
