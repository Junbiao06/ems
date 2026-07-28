import { FileSearch, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { EmployeeDetailsModal } from "../../components/employees/EmployeeDetailsModal";
import { PageHeader } from "../../components/layout/PageHeader";
import { ApplyLeaveModal } from "../../components/leave/ApplyLeaveModal";
import { EmployeeLeaveStats } from "../../components/leave/EmployeeLeaveStats";
import { LeaveDetailsModal } from "../../components/leave/LeaveDetailsModal";
import { LeaveFilters } from "../../components/leave/LeaveFilters";
import { LeaveHistory } from "../../components/leave/LeaveHistory";
import { Pagination } from "../../components/ui/Pagination";
import { getCurrentMockUser } from "../../mocks/auth";
import { leaveDecisionEmailTemplates } from "../../mocks/leaveEmailTemplates";
import { mockEmployees } from "../../mocks/employees";
import {
  mockAnnualLeaveAllowances,
  mockLeaves,
} from "../../mocks/leaves";
import { cn } from "../../utils/cn";
import {
  DepartmentSchema,
  type EmployeeListItem,
} from "@/types/employee";
import {
  LeaveStatusSchema,
  LeaveTypeSchema,
  type CreateLeaveFormData,
  type LeaveRecord,
} from "@/types/leave";

const pageSize = 8;

function currentBusinessDate() {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Shanghai",
  }).format(new Date());
}

export function LeavePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") ?? "",
  );
  const [leaves, setLeaves] = useState<LeaveRecord[]>(() => [...mockLeaves]);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRecord | null>(null);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeListItem | null>(null);
  const currentUser = getCurrentMockUser();
  const isAdmin = currentUser.role === "ADMIN";
  const currentEmployee = mockEmployees.find(
    (employee) => employee.firstName + " " + employee.lastName === currentUser.fullName,
  );
  const departmentResult = DepartmentSchema.safeParse(
    searchParams.get("department"),
  );
  const typeResult = LeaveTypeSchema.safeParse(searchParams.get("type"));
  const statusResult = LeaveStatusSchema.safeParse(searchParams.get("status"));
  const selectedDepartment = departmentResult.success
    ? departmentResult.data
    : "";
  const selectedType = typeResult.success ? typeResult.data : "";
  const selectedStatus = statusResult.success ? statusResult.data : "";
  const activeToday =
    isAdmin && searchParams.get("active") === "today";
  const businessDate = currentBusinessDate();
  const selectedStatusFilter = activeToday
    ? "ACTIVE_TODAY"
    : selectedStatus;
  const visibleRoleLeaves = isAdmin
    ? leaves
    : leaves.filter(
        (leave) => leave.employee.fullName === currentUser.fullName,
      );
  const hasFilters =
    (isAdmin && searchParams.has("search")) ||
    (isAdmin && Boolean(selectedDepartment)) ||
    Boolean(selectedType) ||
    Boolean(selectedStatus) ||
    activeToday;

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const normalizedSearch = searchValue.trim();

      setSearchParams((currentParams) => {
        if ((currentParams.get("search") ?? "") === normalizedSearch) {
          return currentParams;
        }

        const nextParams = new URLSearchParams(currentParams);

        if (normalizedSearch) {
          nextParams.set("search", normalizedSearch);
        } else {
          nextParams.delete("search");
        }

        nextParams.delete("page");
        return nextParams;
      });
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [isAdmin, searchValue, setSearchParams]);

  const filteredLeaves = useMemo(() => {
    const normalizedSearch = (searchParams.get("search") ?? "").toLowerCase();

    return visibleRoleLeaves.filter((leave) => {
      const matchesSearch =
        !isAdmin ||
        !normalizedSearch ||
        leave.employee.fullName.toLowerCase().includes(normalizedSearch) ||
        leave.employee.email.toLowerCase().includes(normalizedSearch);
      const matchesDepartment =
        !isAdmin ||
        !selectedDepartment ||
        leave.employee.department === selectedDepartment;
      const matchesType = !selectedType || leave.type === selectedType;
      const matchesStatus =
        activeToday || !selectedStatus || leave.status === selectedStatus;
      const matchesActiveToday =
        !activeToday ||
        (leave.status === "APPROVED" &&
          leave.startDate <= businessDate &&
          leave.endDate >= businessDate);

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesType &&
        matchesStatus &&
        matchesActiveToday
      );
    });
  }, [
    isAdmin,
    activeToday,
    businessDate,
    searchParams,
    selectedDepartment,
    selectedStatus,
    selectedType,
    visibleRoleLeaves,
  ]);
  const requestedPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const totalPages = Math.max(1, Math.ceil(filteredLeaves.length / pageSize));
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;
  const visibleLeaves = filteredLeaves.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  function updatePage(nextPage: number) {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (nextPage === 1) {
        nextParams.delete("page");
      } else {
        nextParams.set("page", String(nextPage));
      }

      return nextParams;
    });
  }

  function updateFilter(
    name: "department" | "type" | "status",
    value: string,
  ) {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (name === "status" && value === "ACTIVE_TODAY") {
        nextParams.delete("status");
        nextParams.set("active", "today");
      } else if (value) {
        nextParams.set(name, value);
        if (name === "status") {
          nextParams.delete("active");
        }
      } else {
        nextParams.delete(name);
        if (name === "status") {
          nextParams.delete("active");
        }
      }

      nextParams.delete("page");
      return nextParams;
    });
  }

  function clearFilters() {
    setSearchValue("");
    setSearchParams({});
  }

  function createLeaveRequest(request: CreateLeaveFormData) {
    if (!currentEmployee) {
      return;
    }

    const newLeave: LeaveRecord = {
      id: crypto.randomUUID(),
      employee: {
        id: currentEmployee.id,
        fullName: `${currentEmployee.firstName} ${currentEmployee.lastName}`,
        email: currentEmployee.email,
        department: currentEmployee.department,
        position: currentEmployee.position,
      },
      type: request.type,
      startDate: request.startDate,
      endDate: request.endDate,
      reason: request.reason,
      status: "PENDING",
      reviewComment: "",
      reviewedAt: null,
      createdAt: new Date().toISOString(),
    };

    setLeaves((currentLeaves) => [newLeave, ...currentLeaves]);
    setSearchValue("");
    setSearchParams({});
    setApplyModalOpen(false);
    toast.success("Leave request submitted.");
  }

  function reviewLeave(
    leave: LeaveRecord,
    status: "APPROVED" | "REJECTED",
    message: string,
  ) {
    setLeaves((currentLeaves) =>
      currentLeaves.map((currentLeave) => {
        if (currentLeave.id !== leave.id || currentLeave.status !== "PENDING") {
          return currentLeave;
        }

        return {
          ...currentLeave,
          status,
          reviewComment: message,
          reviewedAt: new Date().toISOString(),
        };
      }),
    );
    setSelectedLeave(null);

    const emailTemplate = leaveDecisionEmailTemplates[status];
    toast.success(
      `Leave ${status.toLowerCase()}. ${emailTemplate.notificationLabel}`,
    );
  }

  function viewEmployee(leave: LeaveRecord) {
    const employee = mockEmployees.find(
      (candidate) => candidate.id === leave.employee.id,
    );

    if (employee) {
      setSelectedEmployee(employee);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        eyebrow={isAdmin ? "Team requests" : "Time away"}
        title="Leave"
        description={
          isAdmin
            ? "Review employee leave requests and their current status."
            : "Review your leave requests and approval history."
        }
        actions={
          !isAdmin && currentEmployee ? (
            <button
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-text px-4 text-sm font-bold text-surface transition hover:bg-text/85 md:w-auto"
              type="button"
              onClick={() => setApplyModalOpen(true)}
            >
              <Plus className="size-4" aria-hidden="true" />
              Apply for leave
            </button>
          ) : null
        }
      />

      {!isAdmin && currentEmployee ? (
        <EmployeeLeaveStats
          annualAllowance={
            mockAnnualLeaveAllowances[currentEmployee.id] ?? 0
          }
          leaves={visibleRoleLeaves}
        />
      ) : null}

      <section
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-surface shadow-sm",
          isAdmin ? "mt-8" : "mt-6",
        )}
      >
        <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-xl font-extrabold text-text">Leave requests</h2>
            <p className="mt-1 text-sm text-text-muted">
              {filteredLeaves.length}{" "}
              {filteredLeaves.length === 1 ? "request" : "requests"}
            </p>
          </div>
        </header>

        <LeaveFilters
          showEmployeeFilters={isAdmin}
          searchValue={searchValue}
          department={selectedDepartment}
          type={selectedType}
          status={selectedStatusFilter}
          hasFilters={hasFilters}
          onSearchChange={setSearchValue}
          onFilterChange={updateFilter}
          onClear={clearFilters}
        />

        {visibleLeaves.length > 0 ? (
          <LeaveHistory
            leaves={visibleLeaves}
            showEmployee={isAdmin}
            onViewDetails={setSelectedLeave}
            onViewEmployee={viewEmployee}
          />
        ) : (
          <div className="grid min-h-72 place-items-center px-5 py-12 text-center">
            <div>
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-surface-muted text-text-muted">
                <FileSearch className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-extrabold text-text">
                No leave requests found
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                Try changing or clearing the current filters.
              </p>
            </div>
          </div>
        )}

        {totalPages > 1 ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={updatePage}
          />
        ) : null}
      </section>

      {selectedLeave ? (
        <LeaveDetailsModal
          leave={selectedLeave}
          canReview={isAdmin}
          onClose={() => setSelectedLeave(null)}
          onReview={reviewLeave}
        />
      ) : null}

      {applyModalOpen ? (
        <ApplyLeaveModal
          onClose={() => setApplyModalOpen(false)}
          onSubmit={createLeaveRequest}
        />
      ) : null}

      {selectedEmployee ? (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      ) : null}
    </div>
  );
}
