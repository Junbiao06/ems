import { Ellipsis, FileText, UserRound } from "lucide-react";
import type { LeaveRecord } from "@/types/leave";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";

type LeaveActionsProps = {
  leave: LeaveRecord;
  showViewEmployee: boolean;
  onViewDetails: (leave: LeaveRecord) => void;
  onViewEmployee: (leave: LeaveRecord) => void;
};

export function LeaveActions({
  leave,
  showViewEmployee,
  onViewDetails,
  onViewEmployee,
}: LeaveActionsProps) {
  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="grid size-9 place-items-center rounded-lg border border-border text-text-muted transition hover:border-border-strong hover:bg-surface-muted hover:text-text data-[state=open]:border-border-strong data-[state=open]:bg-surface-muted"
            type="button"
            aria-label={`Open actions for ${leave.employee.fullName}'s leave request`}
          >
            <Ellipsis className="size-5" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {showViewEmployee ? (
            <DropdownMenuItem onSelect={() => onViewEmployee(leave)}>
              <UserRound className="size-4" aria-hidden="true" />
              View employee
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem onSelect={() => onViewDetails(leave)}>
            <FileText className="size-4" aria-hidden="true" />
            View request
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
