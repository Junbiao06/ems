import { X } from "lucide-react";
import { useState } from "react";

const ApplyLeaveModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onSuccess();
      onClose();
    }, 1000);
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
            <h2 className="text-3xl">Apply for Leave</h2>
            <p className="text-secondary">
              Submit your leave request for approval.
            </p>
          </div>

          <button className="cursor-pointer" onClick={onClose}>
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="">
            <form onSubmit={handleSubmit} className="animate-fade-in space-y-4">
              <div className="mt-4">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label>Leave Type</label>
                    <select name="type" required>
                      <option value="">Select Leave Type</option>
                      <option value={"SICK"}>Sick Leave</option>
                      <option value={"CASUAL"}>Casual Leave</option>
                      <option value={"ANNUAL"}>Annual Leave</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label>Duration</label>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 flex-1">
                        <p>From</p>
                        <input
                          type="date"
                          name="startDate"
                          min={minDate}
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <p>To</p>
                        <input
                          type="date"
                          name="endDate"
                          min={minDate}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label>Reason</label>
                    <textarea
                      name="reason"
                      placeholder="Enter reason for leave"
                      className="min-h-20"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-4 mt-10">
                    <button
                      type="button"
                      className="hover:bg-primary bg-primary-hover rounded-2xl px-4 py-2"
                      disabled={loading}
                      onClick={onClose}
                    >
                      <p>Cancel</p>
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-surface hover:bg-surface/70 rounded-2xl px-4 py-2"
                      onClick={onClose}
                    >
                      {loading ? (
                        <p className="flex justify-center items-center gap-3">
                          <div className="w-6 h-6 border-3 border-border border-t-primary rounded-full animate-spin" />
                          <p>Processing...</p>
                        </p>
                      ) : (
                        <p>Submit</p>
                      )}
                    </button>
                  </div>

                  {/* <div className="flex justify-end gap-4 mt-10">
                    <button
                      type="button"
                      className="hover:bg-primary bg-primary-hover rounded-2xl px-4 py-2"
                      onClick={() => (onCancel ? onCancel() : navigate(-1))}
                    >
                      Cancel
                    </button>
                    {isEditMode ? (
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
                          <p>Update Employee</p>
                        )}
                      </button>
                    ) : (
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
                          <p>Create Employee</p>
                        )}
                      </button>
                    )}
                  </div> */}
                </div>
              </div>
            </form>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;
