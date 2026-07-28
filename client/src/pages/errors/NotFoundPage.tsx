import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="grid min-h-svh place-items-center bg-canvas p-5 sm:p-8">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-surface p-7 text-center shadow-sm sm:p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-xl border border-brand/40 bg-brand/15 text-on-brand">
          <SearchX className="size-6" aria-hidden="true" />
        </span>

        <p className="mt-6 text-xs font-extrabold tracking-[0.24em] text-text-subtle uppercase">
          Error 404
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-muted">
          The page may have moved, or the address may be incorrect.
        </p>

        <Link
          className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-text px-5 text-sm font-bold text-surface transition hover:bg-text/85"
          to="/dashboard"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
