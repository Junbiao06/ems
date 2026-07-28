import { useState, type FormEvent } from "react";
import type { EmployeeListItem } from "@/types/employee";
import {
  GeneratePayslipFormSchema,
  type GeneratePayslipFormData,
  type GeneratePayslipFormInput,
  type PayslipRecord,
} from "@/types/payslip";
import { FormErrorSummary } from "../ui/FormErrorSummary";
import { Modal } from "../ui/Modal";

type GeneratePayslipModalProps = {
  employees: EmployeeListItem[];
  existingPayslips: PayslipRecord[];
  onClose: () => void;
  onSubmit: (payslip: GeneratePayslipFormData) => void;
};

const inputClassName =
  "h-11 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm font-normal text-text outline-none transition hover:border-border-strong focus:border-focus focus:ring-2 focus:ring-focus/15";

const fieldClassName = "grid gap-2 text-sm font-bold text-text";

function currentBusinessPeriod() {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    timeZone: "Asia/Shanghai",
  }).format(new Date());
}

function moneyInputValue(valueMinor: number) {
  return String(valueMinor / 100);
}

function previewMoney(value: string) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : 0;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(value);
}

export function GeneratePayslipModal({
  employees,
  existingPayslips,
  onClose,
  onSubmit,
}: GeneratePayslipModalProps) {
  const [values, setValues] = useState<GeneratePayslipFormInput>({
    employeeId: "",
    period: currentBusinessPeriod(),
    basicSalaryMinor: "0",
    allowancesMinor: "0",
    deductionsMinor: "0",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof GeneratePayslipFormInput, string>>
  >({});
  const netPay =
    previewMoney(values.basicSalaryMinor) +
    previewMoney(values.allowancesMinor) -
    previewMoney(values.deductionsMinor);

  function updateField(
    name: keyof GeneratePayslipFormInput,
    value: string,
  ) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
  }

  function updateEmployee(employeeId: string) {
    const employee = employees.find(
      (candidate) => candidate.id === employeeId,
    );

    setValues((currentValues) => ({
      ...currentValues,
      employeeId,
      basicSalaryMinor: employee
        ? moneyInputValue(employee.basicSalaryMinor)
        : "0",
      allowancesMinor: employee
        ? moneyInputValue(employee.allowancesMinor)
        : "0",
      deductionsMinor: employee
        ? moneyInputValue(employee.deductionsMinor)
        : "0",
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      employeeId: undefined,
      basicSalaryMinor: undefined,
      allowancesMinor: undefined,
      deductionsMinor: undefined,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = GeneratePayslipFormSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: Partial<
        Record<keyof GeneratePayslipFormInput, string>
      > = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof GeneratePayslipFormInput;

        if (field && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      return;
    }

    const [year, month] = result.data.period.split("-").map(Number);
    const duplicatePayslip = existingPayslips.some(
      (payslip) =>
        payslip.employee.id === result.data.employeeId &&
        payslip.year === year &&
        payslip.month === month,
    );

    if (duplicatePayslip) {
      setErrors({
        period: "A payslip already exists for this employee and period.",
      });
      return;
    }

    setErrors({});
    onSubmit(result.data);
  }

  return (
    <Modal
      title="Generate payslip"
      description="Create a monthly salary record for an employee."
      onClose={onClose}
    >
      <form className="p-5 sm:p-7" noValidate onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={`${fieldClassName} sm:col-span-2`}>
            <span>Employee</span>
            <select
              className={inputClassName}
              value={values.employeeId}
              onChange={(event) => updateEmployee(event.target.value)}
              autoFocus
            >
              <option value="">Select employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName} ·{" "}
                  {employee.department}
                </option>
              ))}
            </select>
          </label>

          <label className={fieldClassName}>
            <span>Pay period</span>
            <input
              className={inputClassName}
              type="month"
              min="2000-01"
              max="2100-12"
              value={values.period}
              onChange={(event) => updateField("period", event.target.value)}
            />
          </label>

          <label className={fieldClassName}>
            <span>Currency</span>
            <input
              className={inputClassName}
              value="CNY"
              readOnly
              aria-readonly="true"
            />
          </label>

          <label className={fieldClassName}>
            <span>Basic salary</span>
            <input
              className={inputClassName}
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={values.basicSalaryMinor}
              onChange={(event) =>
                updateField("basicSalaryMinor", event.target.value)
              }
            />
          </label>

          <label className={fieldClassName}>
            <span>Allowances</span>
            <input
              className={inputClassName}
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={values.allowancesMinor}
              onChange={(event) =>
                updateField("allowancesMinor", event.target.value)
              }
            />
          </label>

          <label className={fieldClassName}>
            <span>Deductions</span>
            <input
              className={inputClassName}
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={values.deductionsMinor}
              onChange={(event) =>
                updateField("deductionsMinor", event.target.value)
              }
            />
          </label>

          <div className="rounded-xl border border-border bg-brand-soft p-4">
            <p className="text-xs font-bold text-text-muted">Net pay</p>
            <p className="mt-1 text-xl font-extrabold text-text">
              {formatMoney(Math.max(0, netPay))}
            </p>
          </div>
        </div>

        <FormErrorSummary
          className="mt-5"
          items={[
            { field: "Employee", message: errors.employeeId },
            { field: "Pay period", message: errors.period },
            { field: "Basic salary", message: errors.basicSalaryMinor },
            { field: "Allowances", message: errors.allowancesMinor },
            { field: "Deductions", message: errors.deductionsMinor },
          ]}
        />

        <div className="mt-8 flex justify-end gap-3 border-t border-border pt-5">
          <button
            className="h-11 rounded-lg border border-border px-5 text-sm font-bold text-text transition hover:bg-surface-muted"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="h-11 rounded-lg bg-text px-5 text-sm font-bold text-surface transition hover:bg-text/85"
            type="submit"
          >
            Generate payslip
          </button>
        </div>
      </form>
    </Modal>
  );
}
