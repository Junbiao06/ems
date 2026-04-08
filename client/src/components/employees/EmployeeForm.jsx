import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEPARTMENTS } from "../../assets/assets";

const EmployeeForm = ({ initdata, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!initdata;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 300);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in space-y-4">
      <div className="">
        <h3 className="text-2xl py-8">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label>First Name</label>
            <input
              required
              defaultValue={initdata?.firstName}
              name="firstName"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>Last Name</label>
            <input required defaultValue={initdata?.lastName} name="lastName" />
          </div>
          <div className="flex flex-col gap-1">
            <label>Phone Number</label>
            <input required defaultValue={initdata?.phone} name="phone" />
          </div>
          <div className="flex flex-col gap-1">
            <label>Join Date</label>
            <input
              type="date"
              required
              defaultValue={
                initdata?.joinDate
                  ? new Date(initdata?.joinDate).toISOString().split("T")[0]
                  : ""
              }
              name="joinDate"
            />
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label>Bio (Optional)</label>
            <textarea
              name="bio"
              defaultValue={initdata?.bio}
              rows={3}
              className="resize-none"
              placeholder="Brief description..."
            />
          </div>
        </div>
      </div>
      <div className="">
        <h3 className="text-2xl py-8">Employment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <div className="flex flex-col gap-1">
            <label>Department</label>
            <select defaultValue={initdata?.department} name="department">
              <option value="">Select Department</option>
              {DEPARTMENTS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label>Position</label>
            <input required defaultValue={initdata?.position} name="position" />
          </div>
          <div className="flex flex-col gap-1">
            <label>Basic Salary</label>
            <input
              type="number"
              min={0}
              step={0.01}
              required
              defaultValue={initdata?.basicSalary}
              name="basicSalary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>Allowances</label>
            <input
              type="number"
              min={0}
              step={0.01}
              required
              defaultValue={initdata?.allowances}
              name="allowances"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>Deductions</label>
            <input
              type="number"
              min={0}
              step={0.01}
              required
              defaultValue={initdata?.deductions}
              name="deductions"
            />
          </div>
          {isEditMode && (
            <div className="flex flex-col gap-1">
              <label>Status</label>
              <select
                defaultValue={initdata?.employmentStatus}
                name="employmentStatus"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          )}
        </div>
      </div>
      <div className="">
        <h3 className="text-2xl py-8">Account Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label>Work Email</label>
            <input
              required
              defaultValue={initdata?.email}
              name="email"
              type="email"
            />
          </div>
          {!isEditMode && (
            <div className="flex flex-col gap-1">
              <label>Temporary Password</label>
              <input required name="password" type="password" />
            </div>
          )}
          {isEditMode && (
            <div className="flex flex-col gap-1">
              <label>Change Password (Optional)</label>
              <input
                name="password"
                type="password"
                placeholder="Leave blank to keep current"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label>System Role</label>
            <select name="role" defaultValue={initdata?.user?.role}>
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-10">
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
      </div>
    </form>
  );
};

export default EmployeeForm;
