import { ArrowRight, CircleCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function PasswordResetComplete() {
  return (
    <section className="grid min-w-0 place-items-center bg-surface p-6 lg:min-h-svh lg:p-12 xl:p-20">
      <div className="w-full min-w-0 max-w-md">
        <span className="grid size-12 place-items-center rounded-full bg-success-surface text-success-text">
          <CircleCheck className="size-6" aria-hidden="true" />
        </span>

        <span className="mt-8 block text-xs font-extrabold tracking-widest text-text-subtle uppercase">
          Password updated
        </span>
        <h1 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-text lg:text-4xl">
          Your password has been reset
        </h1>
        <p className="mt-3 text-sm leading-6 text-text-muted">
          Sign in again with your new password to continue.
        </p>

        <Link
          className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-text text-sm font-extrabold text-surface shadow-md transition hover:-translate-y-px hover:bg-text/85"
          to="/login"
        >
          Back to sign in
          <ArrowRight className="size-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
