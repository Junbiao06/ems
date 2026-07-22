import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";

type PasswordResetFormProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function PasswordResetForm({
  onBack,
  onContinue,
}: PasswordResetFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onContinue();
  };

  const passwordsMatch = password === confirmation;
  const canSubmit = password.length >= 12 && passwordsMatch;

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
          Secure your account
        </span>
        <h1 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-text lg:text-4xl">
          Set a new password
        </h1>
        <p className="mt-3 text-sm leading-6 text-text-muted">
          Use at least 12 characters for your new password.
        </p>

        <form className="mt-8 grid min-w-0 gap-5 lg:mt-9" onSubmit={handleSubmit}>
          <label className="grid min-w-0 gap-2 text-sm font-bold text-text">
            <span>New password</span>
            <span className="relative block min-w-0">
              <input
                className="h-12 min-w-0 w-full rounded-lg border border-border bg-surface px-4 pr-14 text-sm font-normal text-text outline-none transition placeholder:text-text-subtle hover:border-border-strong focus:border-brand-active focus:ring-4 focus:ring-brand/15"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                placeholder="Enter a new password"
                value={password}
                minLength={12}
                maxLength={128}
                onChange={(event) => setPassword(event.target.value)}
                required
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
          </label>

          <label className="grid min-w-0 gap-2 text-sm font-bold text-text">
            <span>Confirm password</span>
            <input
              className="h-12 min-w-0 w-full rounded-lg border border-border bg-surface px-4 text-sm font-normal text-text outline-none transition placeholder:text-text-subtle hover:border-border-strong focus:border-brand-active focus:ring-4 focus:ring-brand/15"
              type={showPassword ? "text" : "password"}
              name="confirmation"
              autoComplete="new-password"
              placeholder="Enter the password again"
              value={confirmation}
              minLength={12}
              maxLength={128}
              onChange={(event) => setConfirmation(event.target.value)}
              required
            />
            {confirmation && !passwordsMatch ? (
              <span className="text-xs font-semibold text-danger-text">
                Passwords do not match.
              </span>
            ) : null}
          </label>

          <button
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-text text-sm font-extrabold text-surface shadow-md transition hover:-translate-y-px hover:bg-text/85 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={!canSubmit}
          >
            Reset password
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}
