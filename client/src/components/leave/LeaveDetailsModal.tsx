import { useState } from "react";
import {
  ReviewLeaveFormSchema,
  type LeaveRecord,
} from "@/types/leave";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";

type LeaveDetailsModalProps = {
  leave: LeaveRecord;
  canReview: boolean;
  onClose: () => void;
  onReview: (
    leave: LeaveRecord,
    status: "APPROVED" | "REJECTED",
    message: string,
  ) => void;
};

const leaveTypeLabels = {
  SICK: "Sick leave",
  CASUAL: "Casual leave",
  ANNUAL: "Annual leave",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  }).format(new Date(`${value}T00:00:00+08:00`));
}

function statusBadge(leave: LeaveRecord) {
  if (leave.status === "APPROVED") {
    return <Badge tone="success">Approved</Badge>;
  }

  if (leave.status === "REJECTED") {
    return <Badge tone="danger">Rejected</Badge>;
  }

  return <Badge tone="warning">Pending</Badge>;
}

export function LeaveDetailsModal({
  leave,
  canReview,
  onClose,
  onReview,
}: LeaveDetailsModalProps) {
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const reviewAvailable = canReview && leave.status === "PENDING";

  function review(status: "APPROVED" | "REJECTED") {
    const result = ReviewLeaveFormSchema.safeParse({ message });

    if (!result.success) {
      setMessageError(result.error.issues[0]?.message ?? "Enter a valid message.");
      return;
    }

    onReview(leave, status, result.data.message);
  }

  return (
    <Modal
      title="Leave request details"
      description="Review the complete request and decision information."
      size="small"
      onClose={onClose}
    >
      <div className="grid gap-5 p-5 sm:p-6">
        <dl className="grid gap-5 text-sm">
          <div>
            <dt className="font-bold text-text-subtle">Employee</dt>
            <dd className="mt-1 font-semibold text-text">
              {leave.employee.fullName}
            </dd>
            <dd className="text-text-muted">{leave.employee.department}</dd>
          </div>
          <div>
            <dt className="font-bold text-text-subtle">Dates</dt>
            <dd className="mt-1 font-semibold text-text">
              {formatDate(leave.startDate)} – {formatDate(leave.endDate)}
            </dd>
          </div>
          <div>
            <dt className="font-bold text-text-subtle">Type and status</dt>
            <dd className="mt-2 flex flex-wrap items-center gap-2">
              <Badge tone="info">{leaveTypeLabels[leave.type]}</Badge>
              {statusBadge(leave)}
            </dd>
          </div>
          <div>
            <dt className="font-bold text-text-subtle">Reason</dt>
            <dd className="mt-2 whitespace-pre-wrap leading-6 text-text-muted">
              {leave.reason}
            </dd>
          </div>
          {!reviewAvailable ? (
            <div>
              <dt className="font-bold text-text-subtle">
                Message from administrator
              </dt>
              <dd className="mt-2 whitespace-pre-wrap leading-6 text-text-muted">
                {leave.reviewComment || "Awaiting review."}
              </dd>
            </div>
          ) : null}
        </dl>

        {reviewAvailable ? (
          <div className="grid gap-4 border-t border-border pt-5">
            <label className="grid gap-2 text-sm font-bold text-text">
              <span>Message to employee</span>
              <textarea
                className="min-h-32 w-full resize-y rounded-lg border border-border bg-surface px-4 py-3 font-normal text-text outline-none transition placeholder:text-text-subtle focus:border-brand-active focus:ring-4 focus:ring-brand/15"
                placeholder="Explain the decision to the employee."
                maxLength={100}
                value={message}
                aria-invalid={Boolean(messageError)}
                onChange={(event) => {
                  setMessage(event.target.value);
                  setMessageError("");
                }}
              />
              <span className="flex items-center justify-between gap-4">
                {messageError ? (
                  <span className="text-xs font-semibold text-danger-text">
                    {messageError}
                  </span>
                ) : (
                  <span />
                )}
                <span className="text-xs font-semibold text-text-subtle">
                  {message.length}/100
                </span>
              </span>
              <span className="text-xs font-semibold text-text-subtle">
                This message will be included in the decision email.
              </span>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                className="h-11 rounded-lg bg-danger-text px-5 text-sm font-bold text-surface transition hover:opacity-85"
                type="button"
                onClick={() => review("REJECTED")}
              >
                Reject
              </button>
              <button
                className="h-11 rounded-lg bg-success-text px-5 text-sm font-bold text-surface transition hover:opacity-85"
                type="button"
                onClick={() => review("APPROVED")}
              >
                Approve
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end border-t border-border pt-5">
            <button
              className="h-11 rounded-lg bg-text px-5 text-sm font-bold text-surface transition hover:bg-text/85"
              type="button"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
