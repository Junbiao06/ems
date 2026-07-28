import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "brand" | "success" | "warning" | "info";
};

const toneClasses = {
  brand: "border border-brand/40 bg-brand/15 text-on-brand",
  success:
    "border border-success-border bg-success-surface text-success-text",
  warning:
    "border border-warning-border bg-warning-surface text-warning-text",
  info: "border border-info-border bg-info-surface text-info-text",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "brand",
}: StatCardProps) {
  return (
    <article className="min-w-0 rounded-xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-muted">{label}</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-text">
            {value}
          </p>
        </div>
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-xl",
            toneClasses[tone],
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
