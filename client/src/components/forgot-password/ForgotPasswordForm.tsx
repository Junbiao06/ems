import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  PasswordResetRequestFormSchema,
  type PasswordResetRequestFormInput,
} from "@/types/auth";

type ForgotPasswordFormProps = {
  onContinue: () => void;
};

export function ForgotPasswordForm({ onContinue }: ForgotPasswordFormProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof PasswordResetRequestFormInput, string>>
  >({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const result = PasswordResetRequestFormSchema.safeParse({
      email: formData.get("email"),
    });

    if (!result.success) {
      const emailError = result.error.issues.find(
        (issue) => issue.path[0] === "email",
      );
      setErrors({ email: emailError?.message ?? "Enter a valid email." });
      return;
    }

    setErrors({});
    onContinue();
  };

  return (
    <section className="grid min-w-0 place-items-center bg-surface p-6 lg:min-h-svh lg:p-12 xl:p-20">
      <div className="w-full min-w-0 max-w-md">
        <Link
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-text-muted transition hover:text-text"
          to="/login"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to sign in
        </Link>

        <span className="block text-xs font-extrabold tracking-widest text-text-subtle uppercase">
          Password recovery
        </span>
        <h1 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-text lg:text-4xl">
          Forgot your password?
        </h1>
        <p className="mt-3 text-sm leading-6 text-text-muted">
          Enter your work email and we will send you a verification code.
        </p>

        <form
          className="mt-8 grid min-w-0 gap-5 lg:mt-9"
          noValidate
          onSubmit={handleSubmit}
        >
          <label className="grid min-w-0 gap-2 text-sm font-bold text-text">
            <span>Work email</span>
            <input
              className="h-12 min-w-0 w-full rounded-lg border border-border bg-surface px-4 text-sm font-normal text-text outline-none transition placeholder:text-text-subtle hover:border-border-strong focus:border-brand-active focus:ring-4 focus:ring-brand/15"
              id="password-reset-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="name@company.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "password-reset-email-error" : undefined}
              onChange={() => setErrors({})}
            />
            {errors.email ? (
              <span
                className="text-xs font-semibold text-danger-text"
                id="password-reset-email-error"
              >
                {errors.email}
              </span>
            ) : null}
          </label>

          <button
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-text text-sm font-extrabold text-surface shadow-md transition hover:-translate-y-px hover:bg-text/85"
            type="submit"
          >
            Send verification code
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}
