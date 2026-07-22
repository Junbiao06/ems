import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type RegistrationCodeFormProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function RegistrationCodeForm({
  onBack,
  onContinue,
}: RegistrationCodeFormProps) {
  const [code, setCode] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onContinue();
  };

  return (
    <section className="grid min-w-0 place-items-center bg-surface p-6 lg:min-h-svh lg:p-12 xl:p-20">
      <div className="w-full min-w-0 max-w-md">
        <button
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-text-muted transition hover:text-text"
          type="button"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to invitation
        </button>

        <span className="block text-xs font-extrabold tracking-widest text-text-subtle uppercase">
          Verify your email
        </span>
        <h1 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-text lg:text-4xl">
          Enter verification code
        </h1>
        <p className="mt-3 text-sm leading-6 text-text-muted">
          Enter the 6-digit code sent to your invited email address.
        </p>

        <form className="mt-8 grid min-w-0 gap-5 lg:mt-9" onSubmit={handleSubmit}>
          <label className="grid min-w-0 gap-2 text-sm font-bold text-text">
            <span>Verification code</span>
            <input
              className="h-12 min-w-0 w-full rounded-lg border border-border bg-surface px-4 text-center text-lg font-bold tracking-widest text-text outline-none transition placeholder:text-text-subtle hover:border-border-strong focus:border-brand-active focus:ring-4 focus:ring-brand/15"
              type="text"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              value={code}
              maxLength={6}
              pattern="[0-9]{6}"
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              required
            />
          </label>

          <button
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-text text-sm font-extrabold text-surface shadow-md transition hover:-translate-y-px hover:bg-text/85 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={code.length !== 6}
          >
            Verify code
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}
