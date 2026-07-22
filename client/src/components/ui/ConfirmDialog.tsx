import { Modal } from "./Modal";

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Modal
      title={title}
      description={description}
      onClose={onCancel}
      size="small"
    >
      <div className="flex justify-end gap-3 p-5 sm:p-6">
        <button
          className="h-11 rounded-lg border border-border px-5 text-sm font-bold text-text transition hover:bg-surface-muted"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="h-11 rounded-lg bg-danger-text px-5 text-sm font-bold text-surface transition hover:bg-danger-text/85"
          type="button"
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
