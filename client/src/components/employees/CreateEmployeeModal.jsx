import { X } from "lucide-react";
import EmployeeForm from "./EmployeeForm";

const CreateEmployeeModal = ({
  editEmployee,
  setEditEmployee,
  setShowCreateModal,
  fetchEmployees,
}) => {
  return (
    <div className="">
      <div
        className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
        onClick={() => setShowCreateModal(false)}
      >
        <div
          className="bg-background rounded-2xl p-8 w-full max-w-150 shadow-2xl max-h-150 overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-8 ">
            <div className="my-4">
              <h2 className="text-3xl">Add New Employee</h2>
              <p className="text-secondary">
                Create a user account and employee profile.
              </p>
            </div>

            <button
              className="cursor-pointer"
              onClick={() => setShowCreateModal(false)}
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
            onCancel={() => setShowCreateModal(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateEmployeeModal;
