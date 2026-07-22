import { useState } from "react";
import { cn } from "../../utils/cn";

type OtpInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
};

export function OtpInput({
  id,
  value,
  onChange,
  invalid = false,
  describedBy,
}: OtpInputProps) {
  const [focused, setFocused] = useState(false);
  const digits = Array.from({ length: 6 }, (_, index) => value[index] ?? "");
  const activeIndex = Math.min(value.length, 5);

  return (
    <div className="relative">
      <input
        className="absolute inset-0 z-10 size-full cursor-text opacity-0 outline-none focus-visible:outline-none"
        id={id}
        type="text"
        name="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        value={value}
        maxLength={6}
        pattern="[0-9]{6}"
        aria-label="6-digit verification code"
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(event) =>
          onChange(event.target.value.replace(/\D/g, "").slice(0, 6))
        }
      />

      <div className="grid grid-cols-6 gap-2" aria-hidden="true">
        {digits.map((digit, index) => {
          const active = focused && index === activeIndex;
          return (
            <span
              className={cn(
                "grid h-12 min-w-0 place-items-center rounded-lg border text-xl font-extrabold text-text transition",
                invalid && "border-danger-border bg-danger-surface",
                !invalid && active && "border-brand-active ring-4 ring-brand/15",
                !invalid && !active && digit && "border-border-strong bg-canvas",
                !invalid && !active && !digit && "border-border bg-surface",
              )}
              key={index}
            >
              {digit}
            </span>
          );
        })}
      </div>
    </div>
  );
}
