import type { EmployeeListItem } from "@/types/employee";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";

type EmployeeDetailsModalProps = {
  employee: EmployeeListItem;
  onClose: () => void;
};

const statusLabels = {
  ACTIVE: "Active",
  INVITED: "Pending activation",
  INACTIVE: "Inactive",
};

function formatJoinDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  }).format(new Date(`${value}T00:00:00+08:00`));
}

function formatMoney(value: number, currency: EmployeeListItem["currency"]) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value / 100);
}

function statusBadge(employee: EmployeeListItem) {
  if (employee.status === "ACTIVE") {
    return <Badge tone="success">{statusLabels[employee.status]}</Badge>;
  }

  if (employee.status === "INVITED") {
    return <Badge tone="warning">{statusLabels[employee.status]}</Badge>;
  }

  return <Badge>{statusLabels[employee.status]}</Badge>;
}

export function EmployeeDetailsModal({
  employee,
  onClose,
}: EmployeeDetailsModalProps) {
  return (
    <Modal
      title="Employee details"
      description="Review work and contact information."
      size="small"
      onClose={onClose}
    >
      <div className="grid gap-5 p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand text-sm font-extrabold text-on-brand">
            {employee.firstName.charAt(0)}
            {employee.lastName.charAt(0)}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-extrabold text-text">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="truncate text-sm text-text-muted">{employee.position}</p>
          </div>
        </div>

        <div>{statusBadge(employee)}</div>

        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-bold text-text-subtle">Department</dt>
            <dd className="mt-1 font-semibold text-text">{employee.department}</dd>
          </div>
          <div>
            <dt className="font-bold text-text-subtle">Joined</dt>
            <dd className="mt-1 font-semibold text-text">
              {formatJoinDate(employee.joinDate)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-bold text-text-subtle">Email</dt>
            <dd className="mt-1 break-all font-semibold text-text">
              {employee.email}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-bold text-text-subtle">Phone</dt>
            <dd className="mt-1 font-semibold text-text">{employee.phone}</dd>
          </div>
          {employee.bio ? (
            <div className="sm:col-span-2">
              <dt className="font-bold text-text-subtle">Bio</dt>
              <dd className="mt-1 whitespace-pre-wrap leading-6 text-text-muted">
                {employee.bio}
              </dd>
            </div>
          ) : null}
        </dl>

        <section className="border-t border-border pt-5">
          <h4 className="font-extrabold text-text">Compensation</h4>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-bold text-text-subtle">Basic salary</dt>
              <dd className="mt-1 font-semibold text-text">
                {formatMoney(employee.basicSalaryMinor, employee.currency)}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-text-subtle">Allowances</dt>
              <dd className="mt-1 font-semibold text-text">
                {formatMoney(employee.allowancesMinor, employee.currency)}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-text-subtle">Deductions</dt>
              <dd className="mt-1 font-semibold text-text">
                {formatMoney(employee.deductionsMinor, employee.currency)}
              </dd>
            </div>
          </dl>
        </section>

        <div className="flex justify-end border-t border-border pt-5">
          <button
            className="h-11 rounded-lg bg-text px-5 text-sm font-bold text-surface transition hover:bg-text/85"
            type="button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
