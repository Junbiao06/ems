import { X } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";

type ModalProps = {
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
  size?: "small" | "large";
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function focusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelector),
  ).filter(
    (element) =>
      element.getAttribute("aria-hidden") !== "true" &&
      element.getClientRects().length > 0,
  );
}

export function Modal({
  title,
  description,
  children,
  onClose,
  size = "large",
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const scrollPosition = window.scrollY;
    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const body = document.body;
    const root = document.documentElement;
    const previousBodyStyles = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };
    const previousRootOverflow = root.style.overflow;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const bodyPaddingRight =
      Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollPosition}px`;
    body.style.width = "100%";

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${bodyPaddingRight + scrollbarWidth}px`;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current();
      }
    }

    const focusFrame = window.requestAnimationFrame(() => {
      const dialog = dialogRef.current;

      if (!dialog || dialog.contains(document.activeElement)) {
        return;
      }

      const [firstFocusableElement] = focusableElements(dialog);
      (firstFocusableElement ?? dialog).focus();
    });

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyStyles.overflow;
      body.style.position = previousBodyStyles.position;
      body.style.top = previousBodyStyles.top;
      body.style.width = previousBodyStyles.width;
      body.style.paddingRight = previousBodyStyles.paddingRight;
      window.scrollTo(0, scrollPosition);

      if (previouslyFocusedElement?.isConnected) {
        previouslyFocusedElement.focus({ preventScroll: true });
      }
    };
  }, []);

  function trapFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") {
      return;
    }

    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const elements = focusableElements(dialog);
    const firstElement = elements[0];
    const lastElement = elements.at(-1);

    if (!firstElement || !lastElement) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    if (
      event.shiftKey &&
      (document.activeElement === firstElement ||
        !dialog.contains(document.activeElement))
    ) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (
      !event.shiftKey &&
      (document.activeElement === lastElement ||
        !dialog.contains(document.activeElement))
    ) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-70 flex justify-center overscroll-none",
        size === "small"
          ? "items-center p-4"
          : "items-end p-0 sm:items-center sm:p-5",
      )}
    >
      <button
        className="absolute inset-0 bg-text/50 backdrop-blur-sm"
        type="button"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div
        ref={dialogRef}
        className={cn(
          "relative flex w-full flex-col overflow-hidden bg-surface shadow-2xl sm:rounded-2xl",
          size === "small"
            ? "max-h-[calc(100svh-2rem)] max-w-md rounded-2xl"
            : "h-svh max-w-3xl sm:h-auto sm:max-h-[90svh]",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        onKeyDown={trapFocus}
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
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
