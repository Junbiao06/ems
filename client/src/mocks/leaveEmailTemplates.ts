// TODO(server): Create and publish the approval and rejection templates in
// Resend, then send them from the leave review service with validated variables
// and a decision-specific idempotency key. These aliases only support the
// current frontend mock.
export const leaveDecisionEmailTemplates = {
  APPROVED: {
    alias: "leave-approved",
    subject: "Your leave request was approved",
    notificationLabel: "Approval email will be sent.",
  },
  REJECTED: {
    alias: "leave-rejected",
    subject: "Your leave request was not approved",
    notificationLabel: "Rejection email will be sent.",
  },
} as const;

export const leaveDecisionEmailVariableKeys = [
  "EMPLOYEE_NAME",
  "LEAVE_TYPE",
  "START_DATE",
  "END_DATE",
  "MESSAGE",
] as const;
