import type { EmployeeListItem } from "@/types/employee";
import { Badge } from "../ui/Badge";
import { EmployeeActions } from "./EmployeeActions";

type EmployeesTableProps = {
  employees: EmployeeListItem[];
  onDeactivate: (employee: EmployeeListItem) => void;
  onEdit: (employee: EmployeeListItem) => void;
  onResendInvitation: (employee: EmployeeListItem) => void;
};

const statusLabels = {
  ACTIVE: "Active",
  INVITED: "Pending activation",
  INACTIVE: "Inactive",
};

const invitationLabels = {
  NOT_SENT: "Not sent",
  PENDING: "Pending",
  EXPIRED: "Expired",
  CONSUMED: "Accepted",
};

function getInitials(employee: EmployeeListItem) {
  return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`;
}

function formatJoinDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  }).format(new Date(`${value}T00:00:00+08:00`));
}

function EmployeeIdentity({ employee }: { employee: EmployeeListItem }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-xs font-extrabold text-on-brand">
        {getInitials(employee)}
      </span>
      <div className="min-w-0">
        <p className="truncate font-bold text-text">
          {employee.firstName} {employee.lastName}
        </p>
        <p className="truncate text-xs text-text-muted">{employee.email}</p>
      </div>
    </div>
  );
}

function EmployeeStatus({ employee }: { employee: EmployeeListItem }) {
  const statusTone =
    employee.status === "ACTIVE"
      ? "success"
      : employee.status === "INVITED"
        ? "warning"
        : "neutral";

  return <Badge tone={statusTone}>{statusLabels[employee.status]}</Badge>;
}

function InvitationStatus({ employee }: { employee: EmployeeListItem }) {
  const invitationTone =
    employee.invitationStatus === "CONSUMED"
      ? "success"
      : employee.invitationStatus === "PENDING"
        ? "info"
        : employee.invitationStatus === "EXPIRED"
          ? "danger"
          : "neutral";

  return (
    <Badge tone={invitationTone}>
      {invitationLabels[employee.invitationStatus]}
    </Badge>
  );
}

export function EmployeesTable({
  employees,
  onDeactivate,
  onEdit,
  onResendInvitation,
}: EmployeesTableProps) {
  return (
    <>
      <div className="grid gap-3 p-4 md:hidden">
        {employees.map((employee) => (
          <article
            className="rounded-xl border border-border bg-surface-raised p-4"
            key={employee.id}
          >
            <EmployeeIdentity employee={employee} />
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4 text-sm">
              <div className="min-w-0">
                <dt className="text-xs font-semibold text-text-subtle">Department</dt>
                <dd className="mt-1 truncate font-semibold text-text">
                  {employee.department}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-xs font-semibold text-text-subtle">Position</dt>
                <dd className="mt-1 truncate font-semibold text-text">
                  {employee.position}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-text-subtle">Status</dt>
                <dd className="mt-1">
                  <EmployeeStatus employee={employee} />
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-text-subtle">Invitation</dt>
                <dd className="mt-1">
                  <InvitationStatus employee={employee} />
                </dd>
              </div>
            </dl>
            <div className="mt-4 border-t border-border pt-3">
              <EmployeeActions
                employee={employee}
                onDeactivate={onDeactivate}
                onEdit={onEdit}
                onResendInvitation={onResendInvitation}
              />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted text-xs text-text-subtle uppercase">
            <tr>
              <th className="px-6 py-4 font-bold" scope="col">
                Employee
              </th>
              <th className="px-4 py-4 font-bold" scope="col">
                Department
              </th>
              <th className="px-4 py-4 font-bold" scope="col">
                Position
              </th>
              <th className="px-4 py-4 font-bold" scope="col">
                Joined
              </th>
              <th className="px-4 py-4 font-bold" scope="col">
                Status
              </th>
              <th className="px-6 py-4 font-bold" scope="col">
                Invitation
              </th>
              <th className="px-6 py-4 text-right font-bold" scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {employees.map((employee) => (
              <tr className="transition-colors hover:bg-surface-muted/60" key={employee.id}>
                <th className="min-w-64 px-6 py-4" scope="row">
                  <EmployeeIdentity employee={employee} />
                </th>
                <td className="whitespace-nowrap px-4 py-4 font-semibold text-text-muted">
                  {employee.department}
                </td>
                <td className="min-w-48 px-4 py-4 font-semibold text-text-muted">
                  {employee.position}
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-semibold text-text-muted">
                  {formatJoinDate(employee.joinDate)}
                </td>
                <td className="px-4 py-4">
                  <EmployeeStatus employee={employee} />
                </td>
                <td className="px-6 py-4">
                  <InvitationStatus employee={employee} />
                </td>
                <td className="px-6 py-4">
                  <EmployeeActions
                    employee={employee}
                    onDeactivate={onDeactivate}
                    onEdit={onEdit}
                    onResendInvitation={onResendInvitation}
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
