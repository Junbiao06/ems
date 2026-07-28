import { ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { mockRegistrationInvitation } from "../../mocks/auth";

type InvitationDetailsProps = {
  onContinue: () => void;
};

export function InvitationDetails({ onContinue }: InvitationDetailsProps) {
  const invitation = mockRegistrationInvitation;

  return (
    <section className="grid min-w-0 place-items-center bg-surface p-6 lg:min-h-svh lg:p-12 xl:p-20">
      <div className="w-full min-w-0 max-w-md">
        <Link
          className="mb-8 inline-flex text-sm font-bold text-text-muted transition hover:text-text"
          to="/login"
        >
          Back to sign in
        </Link>

        <span className="block text-xs font-extrabold tracking-widest text-text-subtle uppercase">
          Employee invitation
        </span>
        <h1 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-text lg:text-4xl">
          Finish setting up your account
        </h1>
        <p className="mt-3 text-sm leading-6 text-text-muted">
          Confirm your invitation details before verifying your email.
        </p>

        <div className="mt-8 rounded-xl border border-border bg-surface-muted p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand text-on-brand">
              <Mail className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-text">{invitation.employeeName}</p>
              <p className="mt-1 break-all text-sm text-text-muted">
                {invitation.email}
              </p>
              <p className="mt-1 text-sm text-text-subtle">
                {invitation.department}
              </p>
            </div>
          </div>
        </div>

        <button
          className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-text text-sm font-extrabold text-surface shadow-md transition hover:bg-text/85"
          type="button"
          onClick={onContinue}
        >
          Send verification code
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
