import type {
  EmployeeCreateFormData,
  EmployeeListItem,
} from "@/types/employee";
import { Modal } from "../ui/Modal";
import { EmployeeForm } from "./EmployeeForm";

type EditEmployeeModalProps = {
  employee: EmployeeListItem;
  existingEmails: string[];
  onClose: () => void;
  onUpdate: (employee: EmployeeCreateFormData) => void;
};

export function EditEmployeeModal({
  employee,
  existingEmails,
  onClose,
  onUpdate,
}: EditEmployeeModalProps) {
  return (
    <Modal
      title="Edit employee"
      description={`Update the profile for ${employee.firstName} ${employee.lastName}.`}
      onClose={onClose}
    >
      <EmployeeForm
        existingEmails={existingEmails}
        initialEmployee={employee}
        submitLabel="Save changes"
        onCancel={onClose}
        onSubmit={onUpdate}
      />
    </Modal>
  );
}
