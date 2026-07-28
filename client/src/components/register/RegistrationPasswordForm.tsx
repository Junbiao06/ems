import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import {
  CompleteRegistrationFormSchema,
  type CompleteRegistrationFormInput,
} from "@/types/auth";

type RegistrationPasswordFormProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function RegistrationPasswordForm({
  onBack,
  onContinue,
}: RegistrationPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof CompleteRegistrationFormInput, string>>
  >({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = CompleteRegistrationFormSchema.safeParse({
      password,
      confirmPassword: confirmation,
    });

    if (!result.success) {
      const nextErrors: Partial<
        Record<keyof CompleteRegistrationFormInput, string>
      > = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (
          (field === "password" || field === "confirmPassword") &&
          !nextErrors[field]
        ) {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onContinue();
  };

  const passwordsMatch = password === confirmation;
  const confirmationError =
    errors.confirmPassword ||
    (confirmation && !passwordsMatch ? "Passwords do not match." : "");

  return (
    <section className="grid min-w-0 place-items-center bg-surface p-6 lg:min-h-svh lg:p-12 xl:p-20">
      <div className="w-full min-w-0 max-w-md">
        <button
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-text-muted transition hover:text-text"
          type="button"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to verification
        </button>

        <span className="block text-xs font-extrabold tracking-widest text-text-subtle uppercase">
          Create your password
        </span>
        <h1 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-text lg:text-4xl">
          Secure your new account
        </h1>
        <p className="mt-3 text-sm leading-6 text-text-muted">
          Use at least 8 characters. You will sign in after registration.
        </p>

        <form
          className="mt-8 grid min-w-0 gap-5 lg:mt-9"
          noValidate
          onSubmit={handleSubmit}
        >
          <label className="grid min-w-0 gap-2 text-sm font-bold text-text">
            <span>Password</span>
            <span className="relative block min-w-0">
              <input
                className="h-12 min-w-0 w-full rounded-lg border border-border bg-surface px-4 pr-14 text-sm font-normal text-text outline-none transition placeholder:text-text-subtle hover:border-border-strong focus:border-brand-active focus:ring-4 focus:ring-brand/15"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                placeholder="Create a password"
                value={password}
                minLength={8}
                maxLength={128}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "registration-password-error" : undefined
                }
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrors((current) => ({
                    ...current,
                    password: undefined,
                  }));
                }}
              />
              <button
                type="button"
                className="absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-md text-text-muted transition hover:bg-surface-muted hover:text-text"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide passwords" : "Show passwords"}
              >
                {showPassword ? (
                  <EyeOff className="size-5" aria-hidden="true" />
                ) : (
                  <Eye className="size-5" aria-hidden="true" />
                )}
              </button>
            </span>
            {errors.password ? (
              <span
                className="text-xs font-semibold text-danger-text"
                id="registration-password-error"
              >
                {errors.password}
              </span>
            ) : null}
          </label>

          <label className="grid min-w-0 gap-2 text-sm font-bold text-text">
            <span>Confirm password</span>
            <input
              className="h-12 min-w-0 w-full rounded-lg border border-border bg-surface px-4 text-sm font-normal text-text outline-none transition placeholder:text-text-subtle hover:border-border-strong focus:border-brand-active focus:ring-4 focus:ring-brand/15"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Enter the password again"
              value={confirmation}
              minLength={8}
              maxLength={128}
              aria-invalid={Boolean(confirmationError)}
              aria-describedby={
                confirmationError
                  ? "registration-confirm-password-error"
                  : undefined
              }
              onChange={(event) => {
                setConfirmation(event.target.value);
                setErrors((current) => ({
                  ...current,
                  confirmPassword: undefined,
                }));
              }}
            />
            {confirmationError ? (
              <span
                className="text-xs font-semibold text-danger-text"
                id="registration-confirm-password-error"
              >
                {confirmationError}
              </span>
            ) : null}
          </label>

          <button
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-text text-sm font-extrabold text-surface shadow-md transition hover:bg-text/85 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
          >
            Complete registration
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}
