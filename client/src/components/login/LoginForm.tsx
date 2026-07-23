import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  authenticateMockUser,
  mockLoginAccounts,
  setCurrentMockUser,
} from "../../mocks/auth";
import { LoginFormSchema, type LoginFormInput } from "@/types/auth";

export function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormInput, string>>
  >({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = LoginFormSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      const nextErrors: Partial<Record<keyof LoginFormInput, string>> = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if ((field === "email" || field === "password") && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      setFormError("");
      return;
    }

    const user = authenticateMockUser(result.data);
    if (!user) {
      setErrors({});
      setFormError("Invalid email or password.");
      return;
    }

    setErrors({});
    setFormError("");
    setCurrentMockUser(user);
    navigate("/dashboard");
  };

  return (
    <section className="grid min-w-0 place-items-center bg-surface p-6 lg:min-h-svh lg:p-12 xl:p-20">
      <div className="w-full min-w-0 max-w-md">
        <div>
          <span className="text-xs font-extrabold tracking-widest text-text-subtle uppercase">
            Welcome back
          </span>
          <h2 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-text lg:text-4xl">
            Sign in to your account
          </h2>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            Enter your work email and password to continue.
          </p>
        </div>

        <form
          className="mt-8 grid min-w-0 gap-5 lg:mt-9"
          noValidate
          onSubmit={handleSubmit}
        >
          {formError ? (
            <div
              className="rounded-lg border border-danger-border bg-danger-surface px-4 py-3 text-sm font-semibold text-danger-text"
              role="alert"
            >
              {formError}
            </div>
          ) : null}

          <label className="grid min-w-0 gap-2 text-sm font-bold text-text">
            <span>Work email</span>
            <input
              className="h-12 min-w-0 w-full rounded-lg border border-border bg-surface px-4 text-sm font-normal text-text outline-none transition placeholder:text-text-subtle hover:border-border-strong focus:border-brand-active focus:ring-4 focus:ring-brand/15"
              id="login-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="name@company.com"
              value={email}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((current) => ({ ...current, email: undefined }));
                setFormError("");
              }}
            />
            {errors.email ? (
              <span
                className="text-xs font-semibold text-danger-text"
                id="login-email-error"
              >
                {errors.email}
              </span>
            ) : null}
          </label>

          <label className="grid min-w-0 gap-2 text-sm font-bold text-text">
            <span>Password</span>
            <span className="relative block min-w-0">
              <input
                className="h-12 min-w-0 w-full rounded-lg border border-border bg-surface px-4 pr-14 text-sm font-normal text-text outline-none transition placeholder:text-text-subtle hover:border-border-strong focus:border-brand-active focus:ring-4 focus:ring-brand/15"
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "login-password-error" : undefined}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrors((current) => ({
                    ...current,
                    password: undefined,
                  }));
                  setFormError("");
                }}
              />
              <button
                type="button"
                className="absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-md text-text-muted transition hover:bg-surface-muted hover:text-text"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
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
                id="login-password-error"
              >
                {errors.password}
              </span>
            ) : null}
          </label>

          <div className="flex flex-col items-start justify-between gap-3 lg:flex-row lg:items-center">
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-text-muted">
              <input className="size-4 accent-brand" type="checkbox" name="remember" />
              <span>Remember me</span>
            </label>
            <Link
              className="p-0 text-xs font-bold text-warning-text underline-offset-4 hover:underline"
              to="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>

          <button
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-text text-sm font-extrabold text-surface shadow-md transition hover:-translate-y-px hover:bg-text/85"
            type="submit"
          >
            Sign in
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-border bg-surface-muted p-4">
          <p className="text-xs font-extrabold tracking-wide text-text-muted uppercase">
            Demo access
          </p>
          <div className="mt-3 grid gap-2">
            {mockLoginAccounts.map((account) => (
              <p className="text-xs text-text-muted" key={account.id}>
                <strong className="text-text">
                  {account.role === "ADMIN" ? "Admin" : "Employee"}:
                </strong>{" "}
                {account.email}
              </p>
            ))}
          </div>
          <p className="mt-3 text-xs text-text-subtle">
            Initial demo password: <strong>demo1234</strong>. A password
            changed during this session uses the new value.
          </p>
        </div>
      </div>
    </section>
  );
}
