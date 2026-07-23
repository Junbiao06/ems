import { useState, type FormEvent } from "react";
import {
  AdminProfileUpdateSchema,
  EmployeeProfileUpdateSchema,
  type Profile,
} from "@/types/profile";

type ProfileFormProps = {
  profile: Profile;
  onSubmit: (profile: Profile) => void;
};

const inputClassName =
  "h-11 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm font-normal text-text outline-none transition hover:border-border-strong focus:border-focus focus:ring-2 focus:ring-focus/15";

const readOnlyInputClassName =
  "h-11 w-full cursor-not-allowed rounded-lg border border-border bg-surface-muted px-3 text-sm font-semibold text-text-muted outline-none";

const fieldClassName = "grid gap-2 text-sm font-bold text-text";

export function ProfileForm({ profile, onSubmit }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(
    profile.kind === "ADMIN" ? profile.displayName : "",
  );
  const [phone, setPhone] = useState(
    profile.kind === "EMPLOYEE" ? profile.phone : "",
  );
  const [bio, setBio] = useState(
    profile.kind === "EMPLOYEE" ? profile.bio : "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (profile.kind === "ADMIN") {
      const result = AdminProfileUpdateSchema.safeParse({ displayName });

      if (!result.success) {
        setErrors({
          displayName:
            result.error.issues[0]?.message ?? "Enter a valid display name.",
        });
        return;
      }

      setErrors({});
      onSubmit({ ...profile, ...result.data });
      return;
    }

    const result = EmployeeProfileUpdateSchema.safeParse({ phone, bio });

    if (!result.success) {
      const nextErrors: Record<string, string> = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (typeof field === "string" && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onSubmit({ ...profile, ...result.data });
  }

  if (profile.kind === "ADMIN") {
    return (
      <form className="p-5 sm:p-7" noValidate onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={fieldClassName}>
            <span>Display name</span>
            <input
              className={inputClassName}
              value={displayName}
              maxLength={80}
              onChange={(event) => {
                setDisplayName(event.target.value);
                setErrors({});
              }}
            />
            {errors.displayName ? (
              <span className="text-xs font-semibold text-danger-text">
                {errors.displayName}
              </span>
            ) : null}
          </label>
          <label className={fieldClassName}>
            <span>Email</span>
            <input
              className={readOnlyInputClassName}
              value={profile.email}
              readOnly
            />
          </label>
          <label className={fieldClassName}>
            <span>Role</span>
            <input
              className={readOnlyInputClassName}
              value="Administrator"
              readOnly
            />
          </label>
        </div>

        <div className="mt-8 flex justify-end border-t border-border pt-5">
          <button
            className="h-11 rounded-lg bg-text px-5 text-sm font-bold text-surface transition hover:bg-text/85"
            type="submit"
          >
            Save profile
          </button>
        </div>
      </form>
    );
  }

  return (
    <form className="p-5 sm:p-7" noValidate onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={fieldClassName}>
          <span>Name</span>
          <input
            className={readOnlyInputClassName}
            value={`${profile.firstName} ${profile.lastName}`}
            readOnly
          />
        </label>
        <label className={fieldClassName}>
          <span>Email</span>
          <input
            className={readOnlyInputClassName}
            value={profile.email}
            readOnly
          />
        </label>
        <label className={fieldClassName}>
          <span>Department</span>
          <input
            className={readOnlyInputClassName}
            value={profile.department}
            readOnly
          />
        </label>
        <label className={fieldClassName}>
          <span>Position</span>
          <input
            className={readOnlyInputClassName}
            value={profile.position}
            readOnly
          />
        </label>
        <label className={fieldClassName}>
          <span>Phone number</span>
          <input
            className={inputClassName}
            type="tel"
            inputMode="numeric"
            pattern="1[3-9][0-9]{9}"
            maxLength={11}
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setErrors((currentErrors) => ({
                ...currentErrors,
                phone: "",
              }));
            }}
          />
          {errors.phone ? (
            <span className="text-xs font-semibold text-danger-text">
              {errors.phone}
            </span>
          ) : null}
        </label>
        <label className={`${fieldClassName} sm:col-span-2`}>
          <span>Bio</span>
          <textarea
            className="min-h-28 w-full resize-y rounded-lg border border-border bg-surface-raised px-3 py-3 text-sm font-normal text-text outline-none transition placeholder:text-text-subtle hover:border-border-strong focus:border-focus focus:ring-2 focus:ring-focus/15"
            placeholder="Write a short introduction."
            maxLength={100}
            value={bio}
            onChange={(event) => {
              setBio(event.target.value);
              setErrors((currentErrors) => ({
                ...currentErrors,
                bio: "",
              }));
            }}
          />
          <span className="flex items-center justify-between gap-4">
            {errors.bio ? (
              <span className="text-xs font-semibold text-danger-text">
                {errors.bio}
              </span>
            ) : (
              <span />
            )}
            <span className="text-xs font-semibold text-text-subtle">
              {bio.length}/100
            </span>
          </span>
        </label>
      </div>

      <div className="mt-8 flex justify-end border-t border-border pt-5">
        <button
          className="h-11 rounded-lg bg-text px-5 text-sm font-bold text-surface transition hover:bg-text/85"
          type="submit"
        >
          Save profile
        </button>
      </div>
    </form>
  );
}
