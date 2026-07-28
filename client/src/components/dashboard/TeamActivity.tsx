import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { AdminTeamActivity } from "@/types/dashboard";
import { cn } from "../../utils/cn";

type TeamActivityProps = {
  data: AdminTeamActivity;
};

type ActivityGroupProps = {
  title: string;
  emptyMessage: string;
  items: AdminTeamActivity["onLeave"];
  dotClassName: string;
  viewAllHref: string;
};

function ActivityGroup({
  title,
  emptyMessage,
  items,
  dotClassName,
  viewAllHref,
}: ActivityGroupProps) {
  const visibleItems = items.slice(0, 5);
  const hasMore = items.length > visibleItems.length;

  return (
    <section className="min-w-0 p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "size-2.5 shrink-0 rounded-full",
            dotClassName,
          )}
          aria-hidden="true"
        />
        <h3 className="font-extrabold text-text">{title}</h3>
        <span className="ml-auto text-xs font-bold text-text-subtle">
          {items.length}
        </span>
      </div>

      {items.length > 0 ? (
        <ul className="mt-4 grid gap-3">
          {visibleItems.map((item) => (
            <li
              className="border-t border-border pt-3 first:border-t-0 first:pt-0"
              key={item.employeeId}
            >
              <p className="truncate text-sm font-bold text-text">
                {item.fullName}
              </p>
              <p className="mt-0.5 truncate text-xs font-semibold text-text-muted">
                {item.note}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm font-semibold text-text-muted">
          {emptyMessage}
        </p>
      )}

      {hasMore ? (
        <Link
          className="mt-5 flex h-10 items-center justify-center gap-2 rounded-lg border border-border text-sm font-bold text-text transition hover:border-border-strong hover:bg-surface-muted"
          to={viewAllHref}
        >
          View all
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      ) : null}
    </section>
  );
}

export function TeamActivity({ data }: TeamActivityProps) {
  const businessDate = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Shanghai",
  }).format(new Date());

  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface shadow-sm xl:col-span-2">
      <header className="border-b border-border px-5 py-4 sm:px-6">
        <h2 className="font-extrabold text-text">Team updates</h2>
        <p className="mt-1 text-sm text-text-muted">
          Today&apos;s leave and attendance updates.
        </p>
      </header>

      <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
        <ActivityGroup
          title="On leave"
          emptyMessage="No one is on leave."
          items={data.onLeave}
          dotClassName="bg-success-text"
          viewAllHref="/leave?active=today"
        />
        <ActivityGroup
          title="Pending leave"
          emptyMessage="No pending requests."
          items={data.leaveRequests}
          dotClassName="bg-warning-text"
          viewAllHref="/leave?status=PENDING"
        />
        <ActivityGroup
          title="Late arrivals"
          emptyMessage="No late arrivals."
          items={data.lateArrivals}
          dotClassName="bg-danger-text"
          viewAllHref={`/attendance?from=${businessDate}&to=${businessDate}&status=LATE`}
        />
      </div>
    </article>
  );
}
