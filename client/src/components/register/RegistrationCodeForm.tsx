import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { VerificationCodeFormSchema } from "@/types/auth";
import { OtpInput } from "../ui/OtpInput";

type RegistrationCodeFormProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function RegistrationCodeForm({
  onBack,
  onContinue,
}: RegistrationCodeFormProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = VerificationCodeFormSchema.safeParse({ code });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Enter a valid code.");
      return;
    }

    setError("");
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

        <form
          className="mt-8 grid min-w-0 gap-5 lg:mt-9"
          noValidate
          onSubmit={handleSubmit}
        >
          <label className="grid min-w-0 gap-2 text-sm font-bold text-text">
            <span>Verification code</span>
            <OtpInput
              id="registration-code"
              value={code}
              invalid={Boolean(error)}
              describedBy={error ? "registration-code-error" : undefined}
              onChange={(value) => {
                setCode(value);
                setError("");
              }}
            />
            {error ? (
              <span
                className="text-xs font-semibold text-danger-text"
                id="registration-code-error"
              >
                {error}
              </span>
            ) : null}
          </label>

          <button
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-text text-sm font-extrabold text-surface shadow-md transition hover:-translate-y-px hover:bg-text/85"
            type="submit"
          >
            Verify code
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}
