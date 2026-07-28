import { Plus, ReceiptText, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { EmployeeDetailsModal } from "../../components/employees/EmployeeDetailsModal";
import { PageHeader } from "../../components/layout/PageHeader";
import { GeneratePayslipModal } from "../../components/payslips/GeneratePayslipModal";
import { ImportPayslipsModal } from "../../components/payslips/ImportPayslipsModal";
import { PayslipFilters } from "../../components/payslips/PayslipFilters";
import { PayslipList } from "../../components/payslips/PayslipList";
import { Pagination } from "../../components/ui/Pagination";
import { getCurrentMockUser } from "../../mocks/auth";
import { mockEmployees } from "../../mocks/employees";
import {
  addMockPayslip,
  addMockPayslips,
  getMockPayslips,
} from "../../mocks/payslips";
import {
  PayslipPeriodSchema,
  PayslipRecordSchema,
  type GeneratePayslipFormData,
  type PayslipRecord,
} from "@/types/payslip";
import type { EmployeeListItem } from "@/types/employee";

const pageSize = 8;

function currentBusinessPeriod() {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    timeZone: "Asia/Shanghai",
  }).format(new Date());
}

function createPayslipRecord(
  input: GeneratePayslipFormData,
  employees: EmployeeListItem[],
) {
  const employee = employees.find(
    (candidate) => candidate.id === input.employeeId,
  );

  if (!employee) {
    return null;
  }

  const [year, month] = input.period.split("-").map(Number);

  return PayslipRecordSchema.parse({
    id: crypto.randomUUID(),
    employee: {
      id: employee.id,
      fullName: `${employee.firstName} ${employee.lastName}`,
      email: employee.email,
      department: employee.department,
      position: employee.position,
    },
    month,
    year,
    basicSalaryMinor: input.basicSalaryMinor,
    allowancesMinor: input.allowancesMinor,
    deductionsMinor: input.deductionsMinor,
    netSalaryMinor:
      input.basicSalaryMinor +
      input.allowancesMinor -
      input.deductionsMinor,
    currency: "CNY",
    createdAt: new Date().toISOString(),
  });
}

export function PayslipsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") ?? "",
  );
  const [payslips, setPayslips] = useState<PayslipRecord[]>(() => [
    ...getMockPayslips(),
  ]);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeListItem | null>(null);
  const currentUser = getCurrentMockUser();
  const isAdmin = currentUser.role === "ADMIN";
  const eligibleEmployees = mockEmployees.filter(
    (employee) => employee.status === "ACTIVE",
  );
  const defaultPeriod = currentBusinessPeriod();
  const periodResult = PayslipPeriodSchema.safeParse(
    searchParams.get("period"),
  );
  const selectedPeriod = periodResult.success
    ? periodResult.data
    : defaultPeriod;
  const rolePayslips = isAdmin
    ? payslips
    : payslips.filter(
        (payslip) => payslip.employee.fullName === currentUser.fullName,
      );
  const hasFilters =
    isAdmin &&
    (searchParams.has("search") || selectedPeriod !== defaultPeriod);

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

  const filteredPayslips = useMemo(() => {
    if (!isAdmin) {
      return rolePayslips;
    }

    const normalizedSearch = (
      searchParams.get("search") ?? ""
    ).toLowerCase();

    return rolePayslips.filter((payslip) => {
      const matchesSearch =
        !normalizedSearch ||
        payslip.employee.fullName.toLowerCase().includes(normalizedSearch) ||
        payslip.employee.email.toLowerCase().includes(normalizedSearch) ||
        payslip.employee.department.toLowerCase().includes(normalizedSearch) ||
        payslip.employee.position.toLowerCase().includes(normalizedSearch);
      const matchesPeriod =
        !selectedPeriod ||
        `${payslip.year}-${String(payslip.month).padStart(2, "0")}` ===
          selectedPeriod;

      return matchesSearch && matchesPeriod;
    });
  }, [isAdmin, rolePayslips, searchParams, selectedPeriod]);
  const requestedPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const totalPages = Math.max(1, Math.ceil(filteredPayslips.length / pageSize));
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;
  const visiblePayslips = filteredPayslips.slice(
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

  function updatePeriod(value: string) {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (value && value !== defaultPeriod) {
        nextParams.set("period", value);
      } else {
        nextParams.delete("period");
      }

      nextParams.delete("page");
      return nextParams;
    });
  }

  function clearFilters() {
    setSearchValue("");
    setSearchParams({});
  }

  function generatePayslip(input: GeneratePayslipFormData) {
    const newPayslip = createPayslipRecord(input, eligibleEmployees);

    if (!newPayslip) {
      return;
    }

    addMockPayslip(newPayslip);
    setPayslips((currentPayslips) => [newPayslip, ...currentPayslips]);
    setSearchValue("");
    setSearchParams({});
    setGenerateModalOpen(false);
    toast.success("Payslip generated successfully.");
  }

  function importPayslips(inputs: GeneratePayslipFormData[]) {
    const newPayslips = inputs.flatMap((input) => {
      const payslip = createPayslipRecord(input, eligibleEmployees);
      return payslip ? [payslip] : [];
    });

    if (newPayslips.length === 0) {
      return;
    }

    addMockPayslips(newPayslips);
    setPayslips((currentPayslips) => [
      ...newPayslips,
      ...currentPayslips,
    ]);
    setSearchValue("");

    const importedPeriod = inputs[0].period;
    setSearchParams(
      importedPeriod === defaultPeriod
        ? {}
        : { period: importedPeriod },
    );
    setImportModalOpen(false);
    toast.success(
      `${newPayslips.length} ${
        newPayslips.length === 1 ? "payslip" : "payslips"
      } imported successfully.`,
    );
  }

  function viewEmployee(payslip: PayslipRecord) {
    const employee = mockEmployees.find(
      (candidate) => candidate.id === payslip.employee.id,
    );

    if (employee) {
      setSelectedEmployee(employee);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        eyebrow={isAdmin ? "Team payroll" : "My payroll"}
        title="Payslips"
        description={
          isAdmin
            ? "Review monthly salary records across the organization."
            : "Review your monthly salary and deduction history."
        }
        actions={
          isAdmin ? (
            <div className="grid grid-cols-2 gap-3 md:flex">
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
                onClick={() => setGenerateModalOpen(true)}
              >
                <Plus className="size-4" aria-hidden="true" />
                Generate payslip
              </button>
            </div>
          ) : null
        }
      />

      <section className="mt-8 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <header className="border-b border-border px-5 py-5 sm:px-6">
          <h2 className="text-xl font-extrabold text-text">
            {isAdmin ? "Employee payslips" : "My payslips"}
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            {filteredPayslips.length}{" "}
            {filteredPayslips.length === 1 ? "payslip" : "payslips"}
          </p>
        </header>

        {isAdmin ? (
          <PayslipFilters
            searchValue={searchValue}
            period={selectedPeriod}
            hasFilters={hasFilters}
            onSearchChange={setSearchValue}
            onPeriodChange={updatePeriod}
            onClear={clearFilters}
          />
        ) : null}

        {visiblePayslips.length > 0 ? (
          <PayslipList
            payslips={visiblePayslips}
            showEmployee={isAdmin}
            onViewEmployee={viewEmployee}
          />
        ) : (
          <div className="grid min-h-72 place-items-center px-5 py-12 text-center">
            <div>
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-surface-muted text-text-muted">
                <ReceiptText className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-extrabold text-text">
                No payslips found
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                {hasFilters
                  ? "Try changing or clearing the current filters."
                  : "Payslips will appear here after they are generated."}
              </p>
            </div>
          </div>
        )}

        {filteredPayslips.length > 0 ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={updatePage}
          />
        ) : null}
      </section>

      {generateModalOpen ? (
        <GeneratePayslipModal
          employees={eligibleEmployees}
          existingPayslips={payslips}
          onClose={() => setGenerateModalOpen(false)}
          onSubmit={generatePayslip}
        />
      ) : null}

      {importModalOpen ? (
        <ImportPayslipsModal
          employees={mockEmployees}
          existingPayslips={payslips}
          onClose={() => setImportModalOpen(false)}
          onImport={importPayslips}
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
