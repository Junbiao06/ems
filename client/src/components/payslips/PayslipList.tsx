import type { PayslipRecord } from "@/types/payslip";
import { cn } from "../../utils/cn";
import { PayslipActions } from "./PayslipActions";

type PayslipListProps = {
  payslips: PayslipRecord[];
  showEmployee: boolean;
  onViewEmployee: (payslip: PayslipRecord) => void;
};

function formatMoney(valueMinor: number, currency: PayslipRecord["currency"]) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(valueMinor / 100);
}

function formatPeriod(month: number, year: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

function employeeInitials(payslip: PayslipRecord) {
  return payslip.employee.fullName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2);
}

function EmployeeIdentity({ payslip }: { payslip: PayslipRecord }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-xs font-extrabold text-on-brand">
        {employeeInitials(payslip)}
      </span>
      <div className="min-w-0">
        <p className="truncate font-bold text-text">
          {payslip.employee.fullName}
        </p>
        <p className="truncate text-xs text-text-muted">
          {payslip.employee.email}
        </p>
      </div>
    </div>
  );
}

export function PayslipList({
  payslips,
  showEmployee,
  onViewEmployee,
}: PayslipListProps) {
  return (
    <>
      <div className="grid gap-3 p-4 md:hidden">
        {payslips.map((payslip) => (
          <article
            className="rounded-xl border border-border bg-surface-raised p-4"
            key={payslip.id}
          >
            <div className="flex items-start justify-between gap-4">
              {showEmployee ? (
                <EmployeeIdentity payslip={payslip} />
              ) : (
                <p className="text-lg font-extrabold text-text">
                  {formatPeriod(payslip.month, payslip.year)}
                </p>
              )}
              <PayslipActions
                payslip={payslip}
                showViewEmployee={showEmployee}
                onViewEmployee={onViewEmployee}
              />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4 text-sm">
              {showEmployee ? (
                <div className="col-span-2">
                  <dt className="text-xs font-semibold text-text-subtle">
                    Pay period
                  </dt>
                  <dd className="mt-1 font-semibold text-text">
                    {formatPeriod(payslip.month, payslip.year)}
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs font-semibold text-text-subtle">
                  Basic salary
                </dt>
                <dd className="mt-1 font-semibold text-text">
                  {formatMoney(
                    payslip.basicSalaryMinor,
                    payslip.currency,
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-text-subtle">
                  Allowances
                </dt>
                <dd className="mt-1 font-semibold text-text">
                  {formatMoney(
                    payslip.allowancesMinor,
                    payslip.currency,
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-text-subtle">
                  Deductions
                </dt>
                <dd className="mt-1 font-semibold text-text">
                  {formatMoney(
                    payslip.deductionsMinor,
                    payslip.currency,
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-text-subtle">
                  Net pay
                </dt>
                <dd className="mt-1 font-extrabold text-text">
                  {formatMoney(payslip.netSalaryMinor, payslip.currency)}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table
          className={cn(
            "w-full table-fixed text-left text-sm",
            showEmployee ? "min-w-[1060px]" : "min-w-[820px]",
          )}
        >
          {showEmployee ? (
            <colgroup>
              <col className="w-[23%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
              <col className="w-[13%]" />
              <col className="w-[13%]" />
              <col className="w-[13%]" />
              <col className="w-[10%]" />
            </colgroup>
          ) : (
            <colgroup>
              <col className="w-[18%]" />
              <col className="w-[18%]" />
              <col className="w-[18%]" />
              <col className="w-[18%]" />
              <col className="w-[18%]" />
              <col className="w-[10%]" />
            </colgroup>
          )}
          <thead className="border-b border-border bg-surface-muted text-xs text-text-subtle uppercase">
            <tr>
              {showEmployee ? (
                <th className="px-6 py-4 font-bold" scope="col">
                  Employee
                </th>
              ) : null}
              <th className="px-4 py-4 font-bold" scope="col">
                Pay period
              </th>
              <th className="px-4 py-4 font-bold" scope="col">
                Basic salary
              </th>
              <th className="px-4 py-4 font-bold" scope="col">
                Allowances
              </th>
              <th className="px-4 py-4 font-bold" scope="col">
                Deductions
              </th>
              <th className="px-4 py-4 font-bold" scope="col">
                Net pay
              </th>
              <th className="px-4 py-4 text-center font-bold" scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payslips.map((payslip) => (
              <tr
                className="transition-colors hover:bg-surface-muted/60"
                key={payslip.id}
              >
                {showEmployee ? (
                  <th className="px-6 py-4 align-middle" scope="row">
                    <EmployeeIdentity payslip={payslip} />
                  </th>
                ) : null}
                <td className="px-4 py-4 align-middle font-semibold text-text">
                  {formatPeriod(payslip.month, payslip.year)}
                </td>
                <td className="px-4 py-4 align-middle font-semibold text-text-muted">
                  {formatMoney(
                    payslip.basicSalaryMinor,
                    payslip.currency,
                  )}
                </td>
                <td className="px-4 py-4 align-middle font-semibold text-text-muted">
                  {formatMoney(
                    payslip.allowancesMinor,
                    payslip.currency,
                  )}
                </td>
                <td className="px-4 py-4 align-middle font-semibold text-text-muted">
                  {formatMoney(
                    payslip.deductionsMinor,
                    payslip.currency,
                  )}
                </td>
                <td className="px-4 py-4 align-middle font-extrabold text-text">
                  {formatMoney(payslip.netSalaryMinor, payslip.currency)}
                </td>
                <td className="px-4 py-4 align-middle">
                  <PayslipActions
                    payslip={payslip}
                    showViewEmployee={showEmployee}
                    onViewEmployee={onViewEmployee}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
