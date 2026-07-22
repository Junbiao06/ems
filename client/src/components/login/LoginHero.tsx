export function LoginHero() {
  return (
    <section
      className="relative isolate flex min-h-56 min-w-0 overflow-hidden bg-brand p-6 text-text sm:min-h-72 lg:min-h-svh lg:flex-col lg:justify-between lg:p-12 xl:p-16"
      aria-label="EMS introduction"
    >
      <img
        className="absolute inset-0 -z-20 size-full object-cover object-center opacity-50"
        src="/login-background.png"
        alt=""
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-transparent via-brand/10 to-canvas/85" />

      <div className="my-auto w-full min-w-0 max-w-2xl lg:mt-auto lg:mb-32 xl:mb-40">
        <span className="inline-flex max-w-full items-center gap-2 text-xs font-extrabold tracking-widest text-text-muted uppercase before:h-0.5 before:w-8 before:shrink-0 before:bg-current before:content-['']">
          Your workplace, organized
        </span>
        <h1 className="mt-3 max-w-2xl text-3xl leading-tight font-extrabold tracking-tight break-words sm:text-4xl lg:mt-5 lg:text-5xl xl:text-6xl">
          Bring your people and daily work into one clear view.
        </h1>
        <p className="mt-6 hidden max-w-lg text-base leading-7 text-text-muted lg:block">
          Manage employee records, attendance, leave and payslips from a calm,
          focused workspace.
        </p>
      </div>

      <p className="hidden text-xs font-semibold text-text-muted lg:block">
        Simple tools for better people operations.
      </p>
    </section>
  );
}
