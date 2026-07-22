import type { EmployeeCreateFormData } from "@/types/employee";
import { Modal } from "../ui/Modal";
import { EmployeeForm } from "./EmployeeForm";

type CreateEmployeeModalProps = {
  existingEmails: string[];
  onClose: () => void;
  onCreate: (employee: EmployeeCreateFormData) => void;
};

export function CreateEmployeeModal({
  existingEmails,
  onClose,
  onCreate,
}: CreateEmployeeModalProps) {
  return (
    <Modal
      title="Add employee"
      description="Create an employee profile and send a registration invitation."
      onClose={onClose}
    >
      <EmployeeForm
        existingEmails={existingEmails}
        submitLabel="Create employee"
        onCancel={onClose}
        onSubmit={onCreate}
      />
    </Modal>
  );
}
