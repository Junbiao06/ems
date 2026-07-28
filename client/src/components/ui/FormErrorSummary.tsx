import { cn } from "../../utils/cn";

type FormErrorItem = {
  field: string;
  message?: string;
  id?: string;
};

type FormErrorSummaryProps = {
  items: FormErrorItem[];
  className?: string;
};

export function FormErrorSummary({
  items,
  className,
}: FormErrorSummaryProps) {
  const visibleItems = items.filter(
    (item): item is FormErrorItem & { message: string } =>
      Boolean(item.message),
  );

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-danger-border bg-danger-surface px-4 py-3",
        className,
      )}
      role="alert"
    >
      <ul className="grid gap-1.5 text-xs font-semibold text-danger-text">
        {visibleItems.map((item) => (
          <li id={item.id} key={item.field}>
            <span className="font-extrabold">{item.field}:</span>{" "}
            {item.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
