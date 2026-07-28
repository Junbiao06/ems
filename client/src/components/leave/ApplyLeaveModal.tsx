import { useState, type FormEvent } from "react";
import {
  CreateLeaveFormSchema,
  type CreateLeaveFormData,
  type CreateLeaveFormInput,
} from "@/types/leave";
import { FormErrorSummary } from "../ui/FormErrorSummary";
import { Modal } from "../ui/Modal";

type ApplyLeaveModalProps = {
  onClose: () => void;
  onSubmit: (leave: CreateLeaveFormData) => void;
};

function currentBusinessDate() {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Shanghai",
  }).format(new Date());
}

const initialValues: CreateLeaveFormInput = {
  type: "ANNUAL",
  startDate: "",
  endDate: "",
  reason: "",
};

export function ApplyLeaveModal({
  onClose,
  onSubmit,
}: ApplyLeaveModalProps) {
  const [values, setValues] = useState<CreateLeaveFormInput>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateLeaveFormInput, string>>
  >({});
  const minimumDate = currentBusinessDate();

  function updateField(
    name: keyof CreateLeaveFormInput,
    value: CreateLeaveFormInput[keyof CreateLeaveFormInput],
  ) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = CreateLeaveFormSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: Partial<
        Record<keyof CreateLeaveFormInput, string>
      > = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (
          (field === "type" ||
            field === "startDate" ||
            field === "endDate" ||
            field === "reason") &&
          !nextErrors[field]
        ) {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      return;
    }

    onSubmit(result.data);
  }

  return (
    <Modal
      title="Apply for leave"
      description="Submit a request for your manager to review."
      size="small"
      onClose={onClose}
    >
      <form className="grid gap-5 p-5 sm:p-6" noValidate onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-bold text-text">
          <span>Leave type</span>
          <select
            className="h-11 rounded-lg border border-border bg-surface px-3 font-normal text-text outline-none focus:border-brand-active focus:ring-4 focus:ring-brand/15"
            value={values.type}
            onChange={(event) => updateField("type", event.target.value)}
          >
            <option value="ANNUAL">Annual</option>
            <option value="SICK">Sick</option>
            <option value="CASUAL">Casual</option>
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-text">
            <span>Start date</span>
            <input
              className="h-11 rounded-lg border border-border bg-surface px-3 font-normal text-text outline-none focus:border-brand-active focus:ring-4 focus:ring-brand/15"
              type="date"
              min={minimumDate}
              value={values.startDate}
              onChange={(event) => updateField("startDate", event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-text">
            <span>End date</span>
            <input
              className="h-11 rounded-lg border border-border bg-surface px-3 font-normal text-text outline-none focus:border-brand-active focus:ring-4 focus:ring-brand/15"
              type="date"
              min={values.startDate || minimumDate}
              value={values.endDate}
              onChange={(event) => updateField("endDate", event.target.value)}
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-bold text-text">
          <span>Reason</span>
          <textarea
            className="min-h-32 resize-y rounded-lg border border-border bg-surface px-4 py-3 font-normal text-text outline-none transition placeholder:text-text-subtle focus:border-brand-active focus:ring-4 focus:ring-brand/15"
            placeholder="Explain why you need time away."
            maxLength={100}
            value={values.reason}
            onChange={(event) => updateField("reason", event.target.value)}
          />
          <span className="text-right text-xs font-semibold text-text-subtle">
            {values.reason.length}/100
          </span>
        </label>

        <FormErrorSummary
          items={[
            { field: "Leave type", message: errors.type },
            { field: "Start date", message: errors.startDate },
            { field: "End date", message: errors.endDate },
            { field: "Reason", message: errors.reason },
          ]}
        />

        <div className="flex justify-end gap-3 border-t border-border pt-5">
          <button
            className="h-11 rounded-lg border border-border px-5 text-sm font-bold text-text transition hover:bg-surface-muted"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="h-11 rounded-lg bg-text px-5 text-sm font-bold text-surface transition hover:bg-text/85"
            type="submit"
          >
            Submit request
          </button>
        </div>
      </form>
    </Modal>
  );
}
