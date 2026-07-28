export function PageLoadingFallback() {
  return (
    <div
      className="h-72 animate-pulse rounded-xl border border-border bg-surface-muted"
      role="status"
      aria-label="Loading page"
    />
  );
}
