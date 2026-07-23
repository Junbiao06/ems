import { Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  ChangePasswordFormSchema,
  type ChangePasswordFormData,
  type ChangePasswordFormInput,
} from "@/types/auth";

type ChangePasswordFormProps = {
  onSubmit: (password: ChangePasswordFormData) => boolean;
};

type PasswordFieldProps = {
  label: string;
  name: keyof ChangePasswordFormInput;
  value: string;
  error?: string;
  autoComplete: "current-password" | "new-password";
  visible: boolean;
  onChange: (value: string) => void;
  onVisibilityChange: () => void;
};

function PasswordField({
  label,
  name,
  value,
  error,
  autoComplete,
  visible,
  onChange,
  onVisibilityChange,
}: PasswordFieldProps) {
  const errorId = `${name}-error`;

  return (
    <label className="grid gap-2 text-sm font-bold text-text">
      <span>{label}</span>
      <span className="relative block">
        <input
          className="h-11 w-full rounded-lg border border-border bg-surface-raised px-3 pr-12 text-sm font-normal text-text outline-none transition hover:border-border-strong focus:border-focus focus:ring-2 focus:ring-focus/15"
          type={visible ? "text" : "password"}
          name={name}
          autoComplete={autoComplete}
          maxLength={128}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          className="absolute top-1/2 right-1 grid size-9 -translate-y-1/2 place-items-center rounded-md text-text-muted transition hover:bg-surface-muted hover:text-text"
          type="button"
          onClick={onVisibilityChange}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
        >
          {visible ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </span>
      {error ? (
        <span
          className="text-xs font-semibold text-danger-text"
          id={errorId}
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}

const initialValues: ChangePasswordFormInput = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function ChangePasswordForm({
  onSubmit,
}: ChangePasswordFormProps) {
  const [values, setValues] =
    useState<ChangePasswordFormInput>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ChangePasswordFormInput, string>>
  >({});
  const [visibleFields, setVisibleFields] = useState<
    Partial<Record<keyof ChangePasswordFormInput, boolean>>
  >({});

  function updateField(
    name: keyof ChangePasswordFormInput,
    value: string,
  ) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
  }

  function toggleVisibility(name: keyof ChangePasswordFormInput) {
    setVisibleFields((currentFields) => ({
      ...currentFields,
      [name]: !currentFields[name],
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = ChangePasswordFormSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: Partial<
        Record<keyof ChangePasswordFormInput, string>
      > = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ChangePasswordFormInput;

        if (field && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      return;
    }

    if (!onSubmit(result.data)) {
      setErrors({
        currentPassword: "Current password is incorrect.",
      });
    }
  }

  return (
    <form className="p-5 sm:p-7" noValidate onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2 sm:w-[calc(50%_-_0.625rem)]">
          <PasswordField
            label="Current password"
            name="currentPassword"
            value={values.currentPassword}
            error={errors.currentPassword}
            autoComplete="current-password"
            visible={Boolean(visibleFields.currentPassword)}
            onChange={(value) => updateField("currentPassword", value)}
            onVisibilityChange={() => toggleVisibility("currentPassword")}
          />
        </div>
        <PasswordField
          label="New password"
          name="newPassword"
          value={values.newPassword}
          error={errors.newPassword}
          autoComplete="new-password"
          visible={Boolean(visibleFields.newPassword)}
          onChange={(value) => updateField("newPassword", value)}
          onVisibilityChange={() => toggleVisibility("newPassword")}
        />
        <PasswordField
          label="Confirm new password"
          name="confirmPassword"
          value={values.confirmPassword}
          error={errors.confirmPassword}
          autoComplete="new-password"
          visible={Boolean(visibleFields.confirmPassword)}
          onChange={(value) => updateField("confirmPassword", value)}
          onVisibilityChange={() => toggleVisibility("confirmPassword")}
        />
      </div>

      <p className="mt-5 text-xs font-semibold text-text-muted">
        Use at least 8 characters. You will be signed out after the password
        is changed.
      </p>

      <div className="mt-8 flex justify-end border-t border-border pt-5">
        <button
          className="h-11 rounded-lg bg-text px-5 text-sm font-bold text-surface transition hover:bg-text/85"
          type="submit"
        >
          Change password
        </button>
      </div>
    </form>
  );
}
