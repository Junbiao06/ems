import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section className="grid min-w-0 place-items-center bg-surface p-6 sm:p-10 lg:min-h-svh lg:p-12 xl:p-20">
      <div className="w-full min-w-0 max-w-md">
        <div>
          <span className="text-xs font-extrabold tracking-widest text-text-subtle uppercase">
            Welcome back
          </span>
          <h2 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-text sm:text-4xl">
            Sign in to your account
          </h2>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            Enter your work email and password to continue.
          </p>
        </div>

        <form className="mt-8 grid min-w-0 gap-5 sm:mt-9" onSubmit={handleSubmit}>
          <label className="grid min-w-0 gap-2 text-sm font-bold text-text">
            <span>Work email</span>
            <input
              className="h-12 min-w-0 w-full rounded-lg border border-border bg-surface px-4 text-sm font-normal text-text outline-none transition placeholder:text-text-subtle hover:border-border-strong focus:border-brand-active focus:ring-4 focus:ring-brand/15"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="name@company.com"
              required
            />
          </label>

          <label className="grid min-w-0 gap-2 text-sm font-bold text-text">
            <span>Password</span>
            <span className="relative block min-w-0">
              <input
                className="h-12 min-w-0 w-full rounded-lg border border-border bg-surface px-4 pr-14 text-sm font-normal text-text outline-none transition placeholder:text-text-subtle hover:border-border-strong focus:border-brand-active focus:ring-4 focus:ring-brand/15"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                required
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
          </label>

          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
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

        <p className="mt-6 text-center text-xs leading-5 text-text-subtle">
          Authentication will be connected after the backend is ready.
        </p>
      </div>
    </section>
  );
}
