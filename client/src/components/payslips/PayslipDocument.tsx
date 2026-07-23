import type { PayslipRecord } from "@/types/payslip";

type PayslipDocumentProps = {
  payslip: PayslipRecord;
};

function formatMoney(valueMinor: number, currency: PayslipRecord["currency"]) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(valueMinor / 100);
}

function formatPeriod(payslip: PayslipRecord) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(payslip.year, payslip.month - 1, 1)));
}

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  }).format(new Date(value));
}

export function PayslipDocument({ payslip }: PayslipDocumentProps) {
  const totalEarnings =
    payslip.basicSalaryMinor + payslip.allowancesMinor;

  return (
    <article className="border border-border-strong bg-surface shadow-xl print:border-0 print:shadow-none">
      <header className="flex flex-col gap-8 border-b-2 border-text px-5 py-8 sm:flex-row sm:items-start sm:justify-between sm:px-10 sm:py-10">
        <div>
          <p className="text-sm font-extrabold tracking-[0.18em] text-text uppercase">
            Employee Management System
          </p>
          <p className="mt-2 text-xs font-semibold tracking-wider text-text-muted uppercase">
            Payroll department
          </p>
        </div>
        <div className="sm:text-right">
          <h1 className="text-3xl font-extrabold tracking-[0.12em] text-text uppercase sm:text-4xl">
            Payslip
          </h1>
          <p className="mt-2 text-sm font-bold text-text-muted">
            {formatPeriod(payslip)}
          </p>
        </div>
      </header>

      <section className="border-b border-border-strong px-5 py-6 sm:px-10 sm:py-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xs font-extrabold tracking-[0.16em] text-text uppercase">
            Employee details
          </h2>
          <p className="text-xs font-bold tracking-wider text-text-subtle uppercase">
            Confidential
          </p>
        </div>

        <dl className="mt-5 grid border-t border-l border-border-strong text-sm sm:grid-cols-2">
          <div className="border-r border-b border-border-strong p-4">
            <dt className="text-xs font-bold tracking-wide text-text-subtle uppercase">
              Employee name
            </dt>
            <dd className="mt-1.5 font-extrabold text-text">
              {payslip.employee.fullName}
            </dd>
          </div>
          <div className="border-r border-b border-border-strong p-4">
            <dt className="text-xs font-bold tracking-wide text-text-subtle uppercase">
              Employee ID
            </dt>
            <dd className="mt-1.5 font-semibold text-text">
              {payslip.employee.id}
            </dd>
          </div>
          <div className="border-r border-b border-border-strong p-4">
            <dt className="text-xs font-bold tracking-wide text-text-subtle uppercase">
              Department
            </dt>
            <dd className="mt-1.5 font-semibold text-text">
              {payslip.employee.department}
            </dd>
          </div>
          <div className="border-r border-b border-border-strong p-4">
            <dt className="text-xs font-bold tracking-wide text-text-subtle uppercase">
              Position
            </dt>
            <dd className="mt-1.5 font-semibold text-text">
              {payslip.employee.position}
            </dd>
          </div>
          <div className="border-r border-b border-border-strong p-4">
            <dt className="text-xs font-bold tracking-wide text-text-subtle uppercase">
              Email
            </dt>
            <dd className="mt-1.5 break-all font-semibold text-text">
              {payslip.employee.email}
            </dd>
          </div>
          <div className="border-r border-b border-border-strong p-4">
            <dt className="text-xs font-bold tracking-wide text-text-subtle uppercase">
              Pay period
            </dt>
            <dd className="mt-1.5 font-semibold text-text">
              {formatPeriod(payslip)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="px-5 py-6 sm:px-10 sm:py-8">
        <h2 className="text-xs font-extrabold tracking-[0.16em] text-text uppercase">
          Salary statement
        </h2>

        <div className="mt-5 border-t border-l border-border-strong">
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(92px,0.34fr)_minmax(92px,0.34fr)] bg-surface-muted text-[11px] font-extrabold tracking-wide text-text uppercase sm:text-xs">
            <div className="border-r border-b border-border-strong px-3 py-3 sm:px-4">
              Description
            </div>
            <div className="border-r border-b border-border-strong px-3 py-3 text-right sm:px-4">
              Earnings
            </div>
            <div className="border-r border-b border-border-strong px-3 py-3 text-right sm:px-4">
              Deductions
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_minmax(92px,0.34fr)_minmax(92px,0.34fr)] text-xs sm:text-sm">
            <div className="border-r border-b border-border-strong px-3 py-4 font-semibold text-text sm:px-4">
              Basic salary
            </div>
            <div className="border-r border-b border-border-strong px-3 py-4 text-right font-semibold text-text tabular-nums sm:px-4">
              {formatMoney(payslip.basicSalaryMinor, payslip.currency)}
            </div>
            <div className="border-r border-b border-border-strong px-3 py-4 text-right text-text-subtle sm:px-4">
              —
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_minmax(92px,0.34fr)_minmax(92px,0.34fr)] text-xs sm:text-sm">
            <div className="border-r border-b border-border-strong px-3 py-4 font-semibold text-text sm:px-4">
              Allowances
            </div>
            <div className="border-r border-b border-border-strong px-3 py-4 text-right font-semibold text-text tabular-nums sm:px-4">
              {formatMoney(payslip.allowancesMinor, payslip.currency)}
            </div>
            <div className="border-r border-b border-border-strong px-3 py-4 text-right text-text-subtle sm:px-4">
              —
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_minmax(92px,0.34fr)_minmax(92px,0.34fr)] text-xs sm:text-sm">
            <div className="border-r border-b border-border-strong px-3 py-4 font-semibold text-text sm:px-4">
              Payroll deductions
            </div>
            <div className="border-r border-b border-border-strong px-3 py-4 text-right text-text-subtle sm:px-4">
              —
            </div>
            <div className="border-r border-b border-border-strong px-3 py-4 text-right font-semibold text-text tabular-nums sm:px-4">
              {formatMoney(payslip.deductionsMinor, payslip.currency)}
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_minmax(92px,0.34fr)_minmax(92px,0.34fr)] bg-surface-muted text-xs sm:text-sm">
            <div className="border-r border-b border-border-strong px-3 py-4 font-extrabold text-text sm:px-4">
              Totals
            </div>
            <div className="border-r border-b border-border-strong px-3 py-4 text-right font-extrabold text-text tabular-nums sm:px-4">
              {formatMoney(totalEarnings, payslip.currency)}
            </div>
            <div className="border-r border-b border-border-strong px-3 py-4 text-right font-extrabold text-text tabular-nums sm:px-4">
              {formatMoney(payslip.deductionsMinor, payslip.currency)}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-y-2 border-text py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-extrabold tracking-wider text-text uppercase">
              Net pay
            </h2>
            <p className="mt-1 text-xs font-semibold text-text-muted">
              Total earnings less deductions · {payslip.currency}
            </p>
          </div>
          <p className="text-2xl font-extrabold text-text tabular-nums sm:text-3xl">
            {formatMoney(payslip.netSalaryMinor, payslip.currency)}
          </p>
        </div>

        <dl className="mt-8 grid gap-5 text-xs text-text-muted sm:grid-cols-2">
          <div>
            <dt className="font-bold tracking-wide text-text-subtle uppercase">
              Payslip ID
            </dt>
            <dd className="mt-1 break-all font-semibold">{payslip.id}</dd>
          </div>
          <div className="sm:text-right">
            <dt className="font-bold tracking-wide text-text-subtle uppercase">
              Generated on
            </dt>
            <dd className="mt-1 font-semibold">
              {formatCreatedAt(payslip.createdAt)}
            </dd>
          </div>
        </dl>
      </section>

      <footer className="border-t border-border-strong px-5 py-5 text-xs leading-5 text-text-muted sm:px-10">
        <p className="font-semibold">
          This is a system-generated payslip and does not require a signature.
        </p>
        <p>Please contact Human Resources if any information is incorrect.</p>
      </footer>
    </article>
  );
}
