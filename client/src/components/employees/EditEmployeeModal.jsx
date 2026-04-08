import { X } from "lucide-react";
import EmployeeForm from "./EmployeeForm";

const EditEmployeeModal = ({
  editEmployee,
  setEditEmployee,
  fetchEmployees,
}) => {
  return (
    <div className="">
      <div
        className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
        onClick={() => setEditEmployee(null)}
      >
        <div
          className="bg-background rounded-2xl p-8 w-full max-w-150 max-h-150 overflow-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-8 ">
            <div className="my-4">
              <h2 className="text-3xl">Edit Employee</h2>
              <p className="text-secondary">Update employee details.</p>
            </div>

            <button
              className="cursor-pointer"
              onClick={() => setEditEmployee(null)}
            >
              <X />
            </button>
          </div>

          <EmployeeForm
            initdata={editEmployee}
            onSuccess={() => {
              setEditEmployee(null);
              fetchEmployees();
            }}
            onCancel={() => setEditEmployee(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
