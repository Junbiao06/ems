import type { LeaveRecord } from "@/types/leave";
import { cn } from "../../utils/cn";
import { Badge } from "../ui/Badge";
import { LeaveActions } from "./LeaveActions";

type LeaveHistoryProps = {
  leaves: LeaveRecord[];
  showEmployee: boolean;
  onViewDetails: (leave: LeaveRecord) => void;
  onViewEmployee: (leave: LeaveRecord) => void;
};

const leaveTypeLabels = {
  SICK: "Sick leave",
  CASUAL: "Casual leave",
  ANNUAL: "Annual leave",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  }).format(new Date(`${value}T00:00:00+08:00`));
}

function employeeInitials(leave: LeaveRecord) {
  return leave.employee.fullName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2);
}

function leaveTypeBadge(leave: LeaveRecord) {
  if (leave.type === "SICK") {
    return <Badge tone="danger">{leaveTypeLabels[leave.type]}</Badge>;
  }

  if (leave.type === "ANNUAL") {
    return <Badge tone="success">{leaveTypeLabels[leave.type]}</Badge>;
  }

  return <Badge tone="info">{leaveTypeLabels[leave.type]}</Badge>;
}

function leaveStatusBadge(leave: LeaveRecord) {
  if (leave.status === "APPROVED") {
    return <Badge tone="success">Approved</Badge>;
  }

  if (leave.status === "REJECTED") {
    return <Badge tone="danger">Rejected</Badge>;
  }

  return <Badge tone="warning">Pending</Badge>;
}

function EmployeeIdentity({ leave }: { leave: LeaveRecord }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-xs font-extrabold text-on-brand">
        {employeeInitials(leave)}
      </span>
      <div className="min-w-0">
        <p className="truncate font-bold text-text">{leave.employee.fullName}</p>
        <p className="truncate text-xs text-text-muted">{leave.employee.email}</p>
      </div>
    </div>
  );
}

export function LeaveHistory({
  leaves,
  showEmployee,
  onViewDetails,
  onViewEmployee,
}: LeaveHistoryProps) {
  return (
    <>
      <div className="grid gap-3 p-4 md:hidden">
        {leaves.map((leave) => (
          <article
            className="rounded-xl border border-border bg-surface-raised p-4"
            key={leave.id}
          >
            <div className="flex items-start justify-between gap-4">
              {showEmployee ? (
                <EmployeeIdentity leave={leave} />
              ) : (
                <p className="font-bold text-text">
                  {formatDate(leave.startDate)} – {formatDate(leave.endDate)}
                </p>
              )}
              <LeaveActions
                leave={leave}
                showViewEmployee={showEmployee}
                onViewDetails={onViewDetails}
                onViewEmployee={onViewEmployee}
              />
            </div>
            {showEmployee ? (
              <div className="mt-4 grid gap-3 border-t border-border pt-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-text-subtle">Department</p>
                  <p className="mt-1 font-semibold text-text">
                    {leave.employee.department}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-subtle">Dates</p>
                  <p className="mt-1 font-semibold text-text">
                    {formatDate(leave.startDate)} – {formatDate(leave.endDate)}
                  </p>
                </div>
              </div>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {leaveTypeBadge(leave)}
              {leaveStatusBadge(leave)}
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table
          className={cn(
            "w-full table-fixed text-left text-sm",
            showEmployee ? "min-w-[980px]" : "min-w-[680px]",
          )}
        >
          {showEmployee ? (
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[16%]" />
              <col className="w-[24%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
              <col className="w-[10%]" />
            </colgroup>
          ) : (
            <colgroup>
              <col className="w-[38%]" />
              <col className="w-[24%]" />
              <col className="w-[24%]" />
              <col className="w-[14%]" />
            </colgroup>
          )}
          <thead className="border-b border-border bg-surface-muted text-xs text-text-subtle uppercase">
            <tr>
              {showEmployee ? (
                <th className="px-6 py-4 font-bold" scope="col">Employee</th>
              ) : null}
              {showEmployee ? (
                <th className="px-4 py-4 font-bold" scope="col">Department</th>
              ) : null}
              <th className="px-4 py-4 font-bold" scope="col">Dates</th>
              <th className="px-6 py-4 text-center font-bold" scope="col">Type</th>
              <th className="px-6 py-4 text-center font-bold" scope="col">Status</th>
              <th className="px-6 py-4 text-center font-bold" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leaves.map((leave) => (
              <tr className="transition-colors hover:bg-surface-muted/60" key={leave.id}>
                {showEmployee ? (
                  <th className="min-w-60 px-6 py-4 align-middle" scope="row">
                    <EmployeeIdentity leave={leave} />
                  </th>
                ) : null}
                {showEmployee ? (
                  <td className="px-4 py-4 align-middle font-semibold text-text-muted">
                    {leave.employee.department}
                  </td>
                ) : null}
                <td className="min-w-52 px-4 py-4 align-middle font-semibold text-text-muted">
                  {formatDate(leave.startDate)} – {formatDate(leave.endDate)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center align-middle">
                  {leaveTypeBadge(leave)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center align-middle">
                  {leaveStatusBadge(leave)}
                </td>
                <td className="px-6 py-4 align-middle">
                  <LeaveActions
                    leave={leave}
                    showViewEmployee={showEmployee}
                    onViewDetails={onViewDetails}
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
