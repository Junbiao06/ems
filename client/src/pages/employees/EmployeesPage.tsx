import { RotateCcw, Search, Upload, UserPlus, UserSearch } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { CreateEmployeeModal } from "../../components/employees/CreateEmployeeModal";
import { EditEmployeeModal } from "../../components/employees/EditEmployeeModal";
import { ImportEmployeesModal } from "../../components/employees/ImportEmployeesModal";
import { EmployeesTable } from "../../components/employees/EmployeesTable";
import { Pagination } from "../../components/ui/Pagination";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { mockEmployees } from "../../mocks/employees";
import {
  DepartmentSchema,
  EmployeeSortSchema,
  EmployeeStatusSchema,
  departments,
  type EmployeeCreateFormData,
  type EmployeeListItem,
} from "@/types/employee";

const pageSize = 8;

export function EmployeesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");
  const [employees, setEmployees] = useState<EmployeeListItem[]>(() => [
    ...mockEmployees,
  ]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [employeeToDeactivate, setEmployeeToDeactivate] =
    useState<EmployeeListItem | null>(null);
  const [employeeToEdit, setEmployeeToEdit] = useState<EmployeeListItem | null>(
    null,
  );

  const departmentResult = DepartmentSchema.safeParse(searchParams.get("department"));
  const statusResult = EmployeeStatusSchema.safeParse(searchParams.get("status"));
  const sortResult = EmployeeSortSchema.safeParse(searchParams.get("sort"));
  const selectedDepartment = departmentResult.success ? departmentResult.data : "";
  const selectedStatus = statusResult.success ? statusResult.data : "";
  const selectedSort = sortResult.success ? sortResult.data : "joinDate-desc";
  const requestedPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const hasFilters =
    searchParams.has("search") ||
    Boolean(selectedDepartment) ||
    Boolean(selectedStatus) ||
    selectedSort !== "joinDate-desc";

  useEffect(() => {
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
  }, [searchValue, setSearchParams]);

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = (searchParams.get("search") ?? "").toLowerCase();

    const matchingEmployees = employees.filter((employee) => {
      const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        fullName.includes(normalizedSearch) ||
        employee.email.toLowerCase().includes(normalizedSearch) ||
        employee.position.toLowerCase().includes(normalizedSearch);
      const matchesDepartment =
        !selectedDepartment || employee.department === selectedDepartment;
      const matchesStatus = !selectedStatus || employee.status === selectedStatus;

      return matchesSearch && matchesDepartment && matchesStatus;
    });

    return matchingEmployees.sort((firstEmployee, secondEmployee) => {
      const firstName = `${firstEmployee.firstName} ${firstEmployee.lastName}`;
      const secondName = `${secondEmployee.firstName} ${secondEmployee.lastName}`;

      switch (selectedSort) {
        case "joinDate-asc":
          return firstEmployee.joinDate.localeCompare(secondEmployee.joinDate);
        case "name-asc":
          return firstName.localeCompare(secondName);
        case "name-desc":
          return secondName.localeCompare(firstName);
        case "salary-asc":
          return firstEmployee.basicSalaryMinor - secondEmployee.basicSalaryMinor;
        case "salary-desc":
          return secondEmployee.basicSalaryMinor - firstEmployee.basicSalaryMinor;
        case "joinDate-desc":
          return secondEmployee.joinDate.localeCompare(firstEmployee.joinDate);
      }
    });
  }, [employees, searchParams, selectedDepartment, selectedSort, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;
  const visibleEmployees = filteredEmployees.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  function updateFilter(name: "department" | "status" | "sort", value: string) {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (value && !(name === "sort" && value === "joinDate-desc")) {
        nextParams.set(name, value);
      } else {
        nextParams.delete(name);
      }

      nextParams.delete("page");
      return nextParams;
    });
  }

  function updatePage(nextPage: number) {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.set("page", String(nextPage));
      return nextParams;
    });
  }

  function clearFilters() {
    setSearchValue("");
    setSearchParams({});
  }

  function createEmployee(employee: EmployeeCreateFormData) {
    const newEmployee: EmployeeListItem = {
      id: crypto.randomUUID(),
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      joinDate: employee.joinDate,
      basicSalaryMinor: employee.basicSalaryMinor,
      allowancesMinor: employee.allowancesMinor,
      deductionsMinor: employee.deductionsMinor,
      currency: employee.currency,
      bio: employee.bio,
      status: "INVITED",
      invitationStatus: "PENDING",
    };

    setEmployees((currentEmployees) => [newEmployee, ...currentEmployees]);
    setSearchValue("");
    setSearchParams({});
    setCreateModalOpen(false);
    toast.success("Registration invitation will be sent.");
  }

  function updateEmployee(employee: EmployeeCreateFormData) {
    if (!employeeToEdit) {
      return;
    }

    setEmployees((currentEmployees) =>
      currentEmployees.map((currentEmployee) =>
        currentEmployee.id === employeeToEdit.id
          ? { ...currentEmployee, ...employee }
          : currentEmployee,
      ),
    );
    setEmployeeToEdit(null);
  }

  function importEmployees(importedEmployees: EmployeeCreateFormData[]) {
    const newEmployees: EmployeeListItem[] = importedEmployees.map((employee) => ({
      id: crypto.randomUUID(),
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      joinDate: employee.joinDate,
      basicSalaryMinor: employee.basicSalaryMinor,
      allowancesMinor: employee.allowancesMinor,
      deductionsMinor: employee.deductionsMinor,
      currency: employee.currency,
      bio: employee.bio,
      status: "INVITED",
      invitationStatus: "PENDING",
    }));

    setEmployees((currentEmployees) => [...newEmployees, ...currentEmployees]);
    setSearchValue("");
    setSearchParams({});
    setImportModalOpen(false);
    toast.success("Registration invitation will be sent.");
  }

  function resendInvitation(employee: EmployeeListItem) {
    setEmployees((currentEmployees) =>
      currentEmployees.map((currentEmployee) =>
        currentEmployee.id === employee.id
          ? { ...currentEmployee, invitationStatus: "PENDING" }
          : currentEmployee,
      ),
    );
    toast.success("Registration invitation will be sent.");
  }

  function deactivateEmployee() {
    if (!employeeToDeactivate) {
      return;
    }

    setEmployees((currentEmployees) =>
      currentEmployees.map((employee) =>
        employee.id === employeeToDeactivate.id
          ? { ...employee, status: "INACTIVE" }
          : employee,
      ),
    );
    setEmployeeToDeactivate(null);
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold tracking-widest text-text-subtle uppercase">
            Team directory
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
            Employees
          </h1>
          <p className="mt-2 text-sm leading-6 text-text-muted">
            Search and manage everyone in your organization.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-bold text-text transition hover:border-border-strong hover:bg-surface-muted"
            type="button"
            onClick={() => setImportModalOpen(true)}
          >
            <Upload className="size-4" aria-hidden="true" />
            Import
          </button>
          <button
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-text px-4 text-sm font-bold text-surface transition hover:bg-text/85"
            type="button"
            onClick={() => setCreateModalOpen(true)}
          >
            <UserPlus className="size-4" aria-hidden="true" />
            Add employee
          </button>
        </div>
      </header>

      <section className="mt-8 rounded-xl border border-border bg-surface shadow-sm">
        <div className="grid gap-3 border-b border-border p-4 sm:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_200px_160px_190px_auto] sm:p-5">
          <label className="relative sm:col-span-2 xl:col-span-1">
            <span className="sr-only">Search employees</span>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-text-subtle"
              aria-hidden="true"
            />
            <input
              className="h-11 w-full rounded-lg border border-border bg-surface-raised pl-11 pr-4 text-sm text-text outline-none transition placeholder:text-text-subtle focus:border-focus focus:ring-2 focus:ring-focus/15"
              type="search"
              placeholder="Search name, email, or position"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </label>

          <label>
            <span className="sr-only">Filter by department</span>
            <select
              className="h-11 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm font-semibold text-text outline-none focus:border-focus focus:ring-2 focus:ring-focus/15"
              value={selectedDepartment}
              onChange={(event) => updateFilter("department", event.target.value)}
            >
              <option value="">Department</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Filter by status</span>
            <select
              className="h-11 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm font-semibold text-text outline-none focus:border-focus focus:ring-2 focus:ring-focus/15"
              value={selectedStatus}
              onChange={(event) => updateFilter("status", event.target.value)}
            >
              <option value="">Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INVITED">Pending activation</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>

          <label>
            <span className="sr-only">Sort employees</span>
            <select
              className="h-11 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm font-semibold text-text outline-none focus:border-focus focus:ring-2 focus:ring-focus/15"
              value={selectedSort}
              onChange={(event) => updateFilter("sort", event.target.value)}
            >
              <option value="joinDate-desc">Join date: newest</option>
              <option value="joinDate-asc">Join date: oldest</option>
              <option value="name-asc">Name: A–Z</option>
              <option value="name-desc">Name: Z–A</option>
              <option value="salary-desc">Salary: high to low</option>
              <option value="salary-asc">Salary: low to high</option>
            </select>
          </label>

          <button
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-bold text-text transition hover:border-border-strong hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            disabled={!hasFilters}
            onClick={clearFilters}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Clear
          </button>
        </div>

        <div className="px-4 py-3 sm:px-6">
          <p className="text-sm font-semibold text-text-muted">
            {filteredEmployees.length} {filteredEmployees.length === 1 ? "employee" : "employees"}
          </p>
        </div>

        {visibleEmployees.length ? (
          <EmployeesTable
            employees={visibleEmployees}
            onDeactivate={setEmployeeToDeactivate}
            onEdit={setEmployeeToEdit}
            onResendInvitation={resendInvitation}
          />
        ) : (
          <div className="grid min-h-72 place-items-center px-5 py-12 text-center">
            <div>
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-surface-muted text-text-muted">
                <UserSearch className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-extrabold text-text">No employees found</h2>
              <p className="mt-1 text-sm text-text-muted">
                Try changing or clearing your current filters.
              </p>
            </div>
          </div>
        )}

        {filteredEmployees.length > 0 ? (
          <Pagination page={page} totalPages={totalPages} onPageChange={updatePage} />
        ) : null}
      </section>

      {createModalOpen ? (
        <CreateEmployeeModal
          existingEmails={employees.map((employee) => employee.email)}
          onClose={() => setCreateModalOpen(false)}
          onCreate={createEmployee}
        />
      ) : null}

      {importModalOpen ? (
        <ImportEmployeesModal
          existingEmails={employees.map((employee) => employee.email)}
          onClose={() => setImportModalOpen(false)}
          onImport={importEmployees}
        />
      ) : null}

      {employeeToEdit ? (
        <EditEmployeeModal
          employee={employeeToEdit}
          existingEmails={employees
            .filter((employee) => employee.id !== employeeToEdit.id)
            .map((employee) => employee.email)}
          onClose={() => setEmployeeToEdit(null)}
          onUpdate={updateEmployee}
        />
      ) : null}

      {employeeToDeactivate ? (
        <ConfirmDialog
          title="Deactivate employee?"
          description={`${employeeToDeactivate.firstName} ${employeeToDeactivate.lastName} will lose access, but their employment history will be retained.`}
          confirmLabel="Deactivate"
          onCancel={() => setEmployeeToDeactivate(null)}
          onConfirm={deactivateEmployee}
        />
      ) : null}
    </div>
  );
}
