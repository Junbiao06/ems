import { useState, type FormEvent } from "react";
import {
  departments,
  EmployeeCreateFormSchema,
  type EmployeeCreateFormData,
  type EmployeeCreateFormInput,
  type EmployeeListItem,
} from "@/types/employee";
import { cn } from "../../utils/cn";

type EmployeeFormProps = {
  existingEmails: string[];
  initialEmployee?: EmployeeListItem;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (employee: EmployeeCreateFormData) => void;
};

const inputClassName =
  "h-11 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm font-normal text-text outline-none transition placeholder:text-text-subtle hover:border-border-strong focus:border-focus focus:ring-2 focus:ring-focus/15";

const fieldClassName = "grid gap-2 text-sm font-bold text-text";

function moneyInputValue(value?: number) {
  return value === undefined ? "0" : String(value / 100);
}

export function EmployeeForm({
  existingEmails,
  initialEmployee,
  submitLabel,
  onCancel,
  onSubmit,
}: EmployeeFormProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof EmployeeCreateFormInput, string>>
  >({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = EmployeeCreateFormSchema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      department: formData.get("department"),
      position: formData.get("position"),
      joinDate: formData.get("joinDate"),
      basicSalaryMinor: formData.get("basicSalaryMinor"),
      allowancesMinor: formData.get("allowancesMinor"),
      deductionsMinor: formData.get("deductionsMinor"),
      currency: formData.get("currency"),
      bio: formData.get("bio"),
    });

    if (!result.success) {
      const nextErrors: Partial<
        Record<keyof EmployeeCreateFormInput, string>
      > = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof EmployeeCreateFormInput;
        if (field && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      return;
    }

    if (existingEmails.includes(result.data.email)) {
      setErrors({ email: "An employee with this email already exists." });
      return;
    }

    setErrors({});
    onSubmit(result.data);
  }

  function errorFor(field: keyof EmployeeCreateFormInput) {
    return errors[field] ? (
      <span className="text-xs font-semibold text-danger-text">{errors[field]}</span>
    ) : null;
  }

  return (
    <form className="p-5 sm:p-7" noValidate onSubmit={handleSubmit}>
      <section>
        <h3 className="text-xs font-extrabold tracking-widest text-text-subtle uppercase">
          Personal information
        </h3>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <label className={fieldClassName}>
            <span>First name</span>
            <input
              className={inputClassName}
              defaultValue={initialEmployee?.firstName}
              name="firstName"
              autoFocus
            />
            {errorFor("firstName")}
          </label>
          <label className={fieldClassName}>
            <span>Last name</span>
            <input
              className={inputClassName}
              defaultValue={initialEmployee?.lastName}
              name="lastName"
            />
            {errorFor("lastName")}
          </label>
          <label className={cn(fieldClassName, "sm:col-span-2")}>
            <span>Work email</span>
            <input
              className={inputClassName}
              defaultValue={initialEmployee?.email}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
            />
            {errorFor("email")}
          </label>
          <label className={fieldClassName}>
            <span>Phone number</span>
            <input
              className={inputClassName}
              defaultValue={initialEmployee?.phone}
              name="phone"
              type="tel"
              inputMode="numeric"
              pattern="1[3-9][0-9]{9}"
              maxLength={11}
              autoComplete="tel"
              placeholder="13500000000"
            />
            {errorFor("phone")}
          </label>
          <label className={fieldClassName}>
            <span>Join date</span>
            <input
              className={inputClassName}
              defaultValue={initialEmployee?.joinDate}
              name="joinDate"
              type="date"
            />
            {errorFor("joinDate")}
          </label>
        </div>
      </section>

      <section className="mt-8 border-t border-border pt-7">
        <h3 className="text-xs font-extrabold tracking-widest text-text-subtle uppercase">
          Employment details
        </h3>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <label className={fieldClassName}>
            <span>Department</span>
            <select
              className={inputClassName}
              defaultValue={initialEmployee?.department ?? ""}
              name="department"
            >
              <option disabled value="">
                Select department
              </option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
            {errorFor("department")}
          </label>
          <label className={fieldClassName}>
            <span>Position</span>
            <input
              className={inputClassName}
              defaultValue={initialEmployee?.position}
              name="position"
            />
            {errorFor("position")}
          </label>
          <label className={fieldClassName}>
            <span>Basic salary</span>
            <input
              className={inputClassName}
              defaultValue={moneyInputValue(initialEmployee?.basicSalaryMinor)}
              name="basicSalaryMinor"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
            />
            {errorFor("basicSalaryMinor")}
          </label>
          <label className={fieldClassName}>
            <span>Currency</span>
            <select
              className={inputClassName}
              defaultValue={initialEmployee?.currency ?? "CNY"}
              name="currency"
            >
              <option value="CNY">CNY</option>
            </select>
            {errorFor("currency")}
          </label>
          <label className={fieldClassName}>
            <span>Allowances</span>
            <input
              className={inputClassName}
              defaultValue={moneyInputValue(initialEmployee?.allowancesMinor)}
              name="allowancesMinor"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
            />
            {errorFor("allowancesMinor")}
          </label>
          <label className={fieldClassName}>
            <span>Deductions</span>
            <input
              className={inputClassName}
              defaultValue={moneyInputValue(initialEmployee?.deductionsMinor)}
              name="deductionsMinor"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
            />
            {errorFor("deductionsMinor")}
          </label>
          <label className={cn(fieldClassName, "sm:col-span-2")}>
            <span>Bio (optional)</span>
            <textarea
              className="min-h-24 w-full resize-y rounded-lg border border-border bg-surface-raised px-3 py-3 text-sm font-normal text-text outline-none transition placeholder:text-text-subtle hover:border-border-strong focus:border-focus focus:ring-2 focus:ring-focus/15"
              defaultValue={initialEmployee?.bio}
              name="bio"
              maxLength={2000}
            />
            {errorFor("bio")}
          </label>
        </div>
      </section>

      <div className="sticky bottom-0 mt-8 flex justify-end gap-3 border-t border-border bg-surface py-5">
        <button
          className="h-11 rounded-lg border border-border px-5 text-sm font-bold text-text transition hover:bg-surface-muted"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="h-11 rounded-lg bg-text px-5 text-sm font-bold text-surface transition hover:bg-text/85"
          type="submit"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
