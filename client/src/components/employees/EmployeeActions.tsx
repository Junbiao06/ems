import {
  Ellipsis,
  MailPlus,
  Pencil,
  UserRound,
  UserRoundX,
} from "lucide-react";
import type { EmployeeListItem } from "@/types/employee";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";

type EmployeeActionsProps = {
  employee: EmployeeListItem;
  onDeactivate: (employee: EmployeeListItem) => void;
  onEdit: (employee: EmployeeListItem) => void;
  onResendInvitation: (employee: EmployeeListItem) => void;
  onViewEmployee: (employee: EmployeeListItem) => void;
};

export function EmployeeActions({
  employee,
  onDeactivate,
  onEdit,
  onResendInvitation,
  onViewEmployee,
}: EmployeeActionsProps) {
  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="grid size-9 place-items-center rounded-lg border border-border text-text-muted transition hover:border-border-strong hover:bg-surface-muted hover:text-text data-[state=open]:border-border-strong data-[state=open]:bg-surface-muted"
            type="button"
            aria-label={`Open actions for ${employee.firstName} ${employee.lastName}`}
          >
            <Ellipsis className="size-5" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => onViewEmployee(employee)}>
            <UserRound className="size-4" aria-hidden="true" />
            View employee
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => onEdit(employee)}>
            <Pencil className="size-4" aria-hidden="true" />
            Edit employee
          </DropdownMenuItem>

          {employee.status === "INVITED" ? (
            <DropdownMenuItem onSelect={() => onResendInvitation(employee)}>
              <MailPlus className="size-4" aria-hidden="true" />
              Resend invitation
            </DropdownMenuItem>
          ) : null}

          {employee.status === "ACTIVE" ? (
            <DropdownMenuItem
              variant="danger"
              onSelect={() => onDeactivate(employee)}
            >
              <UserRoundX className="size-4" aria-hidden="true" />
              Deactivate employee
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
