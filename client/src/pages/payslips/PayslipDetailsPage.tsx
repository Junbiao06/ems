import { ArrowLeft, Printer, ReceiptText } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { PayslipDocument } from "../../components/payslips/PayslipDocument";
import { getCurrentMockUser } from "../../mocks/auth";
import { getMockPayslipById } from "../../mocks/payslips";

export function PayslipDetailsPage() {
  const { payslipId = "" } = useParams();
  const currentUser = getCurrentMockUser();
  const payslip = getMockPayslipById(payslipId);
  const canViewPayslip =
    Boolean(payslip) &&
    (currentUser.role === "ADMIN" ||
      payslip?.employee.fullName === currentUser.fullName);

  if (!payslip || !canViewPayslip) {
    return (
      <main className="grid min-h-svh bg-canvas p-4 sm:p-8">
        <div className="mx-auto grid w-full max-w-3xl place-items-center text-center">
          <div>
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-surface-muted text-text-muted">
              <ReceiptText className="size-7" aria-hidden="true" />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold text-text">
              Payslip not found
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              This payslip is unavailable or you do not have access to it.
            </p>
            <Link
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-text px-5 text-sm font-bold text-surface transition hover:bg-text/85"
              to="/payslips"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to payslips
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-svh bg-canvas p-4 print:min-h-0 print:bg-white print:p-0 sm:p-8">
      <div className="mx-auto w-full max-w-5xl print:max-w-none">
        <div className="mb-6 flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
          <Link
            className="inline-flex h-10 items-center gap-2 rounded-lg px-2 text-sm font-bold text-text-muted transition hover:bg-surface-muted hover:text-text"
            to="/payslips"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to payslips
          </Link>
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-text px-5 text-sm font-bold text-surface transition hover:bg-text/85"
            type="button"
            onClick={() => window.print()}
          >
            <Printer className="size-4" aria-hidden="true" />
            Print / Save PDF
          </button>
        </div>
        <PayslipDocument payslip={payslip} />
      </div>
    </main>
  );
}
