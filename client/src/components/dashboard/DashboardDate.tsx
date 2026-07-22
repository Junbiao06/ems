export function DashboardDate() {
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeZone: "Asia/Shanghai",
  }).format(new Date());

  return (
    <p className="text-xs font-extrabold tracking-widest text-text-subtle uppercase">
      {dateLabel}
    </p>
  );
}
