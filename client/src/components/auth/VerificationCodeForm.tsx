import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import toast from "react-hot-toast";
import { VerificationCodeFormSchema } from "@/types/auth";
import { OtpInput } from "../ui/OtpInput";

type VerificationCodeFormProps = {
  backLabel: string;
  description: string;
  inputId: string;
  onBack: () => void;
  onContinue: () => void;
};

const resendDelaySeconds = 60;

function formatCountdown(seconds: number) {
  return `00:${String(seconds).padStart(2, "0")}`;
}

export function VerificationCodeForm({
  backLabel,
  description,
  inputId,
  onBack,
  onContinue,
}: VerificationCodeFormProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [remainingSeconds, setRemainingSeconds] =
    useState(resendDelaySeconds);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (remainingSeconds === 0) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setRemainingSeconds((currentSeconds) =>
        Math.max(0, currentSeconds - 1),
      );
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [remainingSeconds]);

  function focusInput() {
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = VerificationCodeFormSchema.safeParse({ code });

    if (!result.success) {
      setCode("");
      setError(result.error.issues[0]?.message ?? "Enter a valid code.");
      focusInput();
      return;
    }

    setError("");
    onContinue();
  }

  function resendCode() {
    setCode("");
    setError("");
    setRemainingSeconds(resendDelaySeconds);
    focusInput();
    toast.success("Verification code sent.");
  }

  return (
    <section className="grid min-w-0 place-items-center bg-surface p-6 lg:min-h-svh lg:p-12 xl:p-20">
      <div className="w-full min-w-0 max-w-md">
        <button
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-text-muted transition hover:text-text"
          type="button"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {backLabel}
        </button>

        <span className="block text-xs font-extrabold tracking-widest text-text-subtle uppercase">
          Verify your email
        </span>
        <h1 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-text lg:text-4xl">
          Enter verification code
        </h1>
        <p className="mt-3 text-sm leading-6 text-text-muted">{description}</p>

        <form
          className="mt-8 grid min-w-0 gap-5 lg:mt-9"
          noValidate
          onSubmit={handleSubmit}
        >
          <label className="grid min-w-0 gap-2 text-sm font-bold text-text">
            <span>Verification code</span>
            <OtpInput
              ref={inputRef}
              id={inputId}
              value={code}
              invalid={Boolean(error)}
              describedBy={error ? `${inputId}-error` : undefined}
              onChange={(value) => {
                setCode(value);
                setError("");
              }}
            />
            {error ? (
              <span
                className="text-xs font-semibold text-danger-text"
                id={`${inputId}-error`}
              >
                {error}
              </span>
            ) : null}
          </label>

          <div className="flex min-h-10 items-center justify-between gap-4 text-xs font-semibold">
            <span className="text-text-muted">
              {remainingSeconds > 0
                ? `Resend available in ${formatCountdown(remainingSeconds)}`
                : "Didn’t receive the code?"}
            </span>
            <button
              className="inline-flex shrink-0 items-center gap-2 rounded-md px-2 py-1.5 font-bold text-text transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:text-text-subtle disabled:hover:bg-transparent"
              type="button"
              disabled={remainingSeconds > 0}
              onClick={resendCode}
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Resend code
            </button>
          </div>

          <button
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-text text-sm font-extrabold text-surface shadow-md transition hover:bg-text/85"
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
