import { Ellipsis, ReceiptText, UserRound } from "lucide-react";
import type { PayslipRecord } from "@/types/payslip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";

type PayslipActionsProps = {
  payslip: PayslipRecord;
  showViewEmployee: boolean;
  onViewEmployee: (payslip: PayslipRecord) => void;
};

export function PayslipActions({
  payslip,
  showViewEmployee,
  onViewEmployee,
}: PayslipActionsProps) {
  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="grid size-9 place-items-center rounded-lg border border-border text-text-muted transition hover:border-border-strong hover:bg-surface-muted hover:text-text data-[state=open]:border-border-strong data-[state=open]:bg-surface-muted"
            type="button"
            aria-label={`Open actions for ${payslip.employee.fullName}'s payslip`}
          >
            <Ellipsis className="size-5" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {showViewEmployee ? (
            <DropdownMenuItem onSelect={() => onViewEmployee(payslip)}>
              <UserRound className="size-4" aria-hidden="true" />
              View employee
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem asChild>
            <a
              href={`/payslips/${payslip.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ReceiptText className="size-4" aria-hidden="true" />
              View payslip
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
