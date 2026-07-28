import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-extrabold tracking-widest text-text-subtle uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-text-muted">{description}</p>
      </div>

      {actions ? (
        <div className="w-full shrink-0 md:w-auto">{actions}</div>
      ) : null}
    </header>
  );
}
