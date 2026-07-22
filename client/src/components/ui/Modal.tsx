import { X } from "lucide-react";
import { useEffect, useId, type ReactNode } from "react";
import { cn } from "../../utils/cn";

type ModalProps = {
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
  size?: "small" | "large";
};

export function Modal({
  title,
  description,
  children,
  onClose,
  size = "large",
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-70 flex justify-center",
        size === "small"
          ? "items-center p-4"
          : "items-end p-0 sm:items-center sm:p-5",
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <button
        className="absolute inset-0 bg-text/50 backdrop-blur-sm"
        type="button"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div
        className={cn(
          "relative flex w-full flex-col overflow-hidden bg-surface shadow-2xl sm:rounded-2xl",
          size === "small"
            ? "max-w-md rounded-2xl"
            : "h-svh max-w-3xl sm:h-auto sm:max-h-[90svh]",
        )}
      >
        <header className="flex items-start justify-between gap-5 border-b border-border px-5 py-5 sm:px-7">
          <div>
            <h2 className="text-xl font-extrabold text-text sm:text-2xl" id={titleId}>
              {title}
            </h2>
            <p className="mt-1 text-sm text-text-muted" id={descriptionId}>
              {description}
            </p>
          </div>
          <button
            className="grid size-10 shrink-0 place-items-center rounded-lg text-text-muted transition hover:bg-surface-muted hover:text-text"
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
