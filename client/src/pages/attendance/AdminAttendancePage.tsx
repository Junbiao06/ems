import { RotateCcw, Search, UserSearch } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AdminAttendanceTable } from "../../components/attendance/AdminAttendanceTable";
import { Pagination } from "../../components/ui/Pagination";
import { mockAdminAttendance } from "../../mocks/adminAttendance";
import { AttendanceStatusSchema } from "@/types/attendance";

const pageSize = 8;
const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

export function AdminAttendancePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");
  const statusResult = AttendanceStatusSchema.safeParse(searchParams.get("status"));
  const selectedStatus = statusResult.success ? statusResult.data : "";
  const requestedFrom = searchParams.get("from") ?? "";
  const requestedTo = searchParams.get("to") ?? "";
  const selectedFrom = dateOnlyPattern.test(requestedFrom) ? requestedFrom : "";
  const selectedTo = dateOnlyPattern.test(requestedTo) ? requestedTo : "";
  const requestedPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const hasFilters =
    searchParams.has("search") ||
    Boolean(selectedFrom) ||
    Boolean(selectedTo) ||
    Boolean(selectedStatus);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const normalizedSearch = searchValue.trim();

      setSearchParams((currentParams) => {
        if ((currentParams.get("search") ?? "") === normalizedSearch) {
          return currentParams;
        }

        const nextParams = new URLSearchParams(currentParams);

        if (normalizedSearch) {
          nextParams.set("search", normalizedSearch);
        } else {
          nextParams.delete("search");
        }

        nextParams.delete("page");
        return nextParams;
      });
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchValue, setSearchParams]);

  const filteredRecords = useMemo(() => {
    const normalizedSearch = (searchParams.get("search") ?? "").toLowerCase();

    return mockAdminAttendance.filter((record) => {
      const matchesSearch =
        !normalizedSearch ||
        record.employee.fullName.toLowerCase().includes(normalizedSearch) ||
        record.employee.email.toLowerCase().includes(normalizedSearch) ||
        record.employee.department.toLowerCase().includes(normalizedSearch) ||
        record.employee.position.toLowerCase().includes(normalizedSearch);
      const matchesFrom = !selectedFrom || record.businessDate >= selectedFrom;
      const matchesTo = !selectedTo || record.businessDate <= selectedTo;
      const matchesStatus = !selectedStatus || record.status === selectedStatus;

      return matchesSearch && matchesFrom && matchesTo && matchesStatus;
    });
  }, [searchParams, selectedFrom, selectedStatus, selectedTo]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;
  const visibleRecords = filteredRecords.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  function updateFilter(name: "from" | "to" | "status", value: string) {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (value) {
        nextParams.set(name, value);
      } else {
        nextParams.delete(name);
      }

      nextParams.delete("page");
      return nextParams;
    });
  }

  function updatePage(nextPage: number) {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (nextPage === 1) {
        nextParams.delete("page");
      } else {
        nextParams.set("page", String(nextPage));
      }

      return nextParams;
    });
  }

  function clearFilters() {
    setSearchValue("");
    setSearchParams({});
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <header>
        <p className="text-xs font-extrabold tracking-widest text-text-subtle uppercase">
          Team records
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
          Attendance
        </h1>
        <p className="mt-2 text-sm leading-6 text-text-muted">
          Review employee check-ins and completed workdays.
        </p>
      </header>

      <section className="mt-8 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="grid gap-3 border-b border-border p-4 sm:grid-cols-2 lg:grid-cols-[minmax(240px,1fr)_180px_180px_150px_auto] sm:p-5">
          <label className="grid gap-1.5 sm:col-span-2 lg:col-span-1">
            <span className="text-xs font-bold text-text-muted">Employee</span>
            <span className="relative block">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-text-subtle"
                aria-hidden="true"
              />
              <input
                className="h-11 w-full rounded-lg border border-border bg-surface-raised pl-11 pr-4 text-sm text-text outline-none transition placeholder:text-text-subtle focus:border-focus focus:ring-2 focus:ring-focus/15"
                type="search"
                placeholder="Search employee"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
              />
            </span>
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold text-text-muted">From</span>
            <input
              className="h-11 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm font-semibold text-text outline-none focus:border-focus focus:ring-2 focus:ring-focus/15"
              type="date"
              value={selectedFrom}
              onChange={(event) => updateFilter("from", event.target.value)}
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold text-text-muted">To</span>
            <input
              className="h-11 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm font-semibold text-text outline-none focus:border-focus focus:ring-2 focus:ring-focus/15"
              type="date"
              value={selectedTo}
              onChange={(event) => updateFilter("to", event.target.value)}
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold text-text-muted">Status</span>
            <select
              className="h-11 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm font-semibold text-text outline-none focus:border-focus focus:ring-2 focus:ring-focus/15"
              value={selectedStatus}
              onChange={(event) => updateFilter("status", event.target.value)}
            >
              <option value="">Status</option>
              <option value="PRESENT">Present</option>
              <option value="LATE">Late</option>
            </select>
          </label>

          <div className="grid gap-1.5 sm:col-span-2 lg:col-span-1">
            <span className="invisible text-xs font-bold" aria-hidden="true">Action</span>
            <button
              className="flex h-11 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-bold text-text transition hover:border-border-strong hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
              type="button"
              disabled={!hasFilters}
              onClick={clearFilters}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Clear
            </button>
          </div>
        </div>

        <div className="px-4 py-3 sm:px-6">
          <p className="text-sm font-semibold text-text-muted">
            {filteredRecords.length}{" "}
            {filteredRecords.length === 1 ? "record" : "records"}
          </p>
        </div>

        {visibleRecords.length > 0 ? (
          <AdminAttendanceTable records={visibleRecords} />
        ) : (
          <div className="grid min-h-72 place-items-center px-5 py-12 text-center">
            <div>
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-surface-muted text-text-muted">
                <UserSearch className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-extrabold text-text">No attendance found</h2>
              <p className="mt-1 text-sm text-text-muted">
                Try changing or clearing the current filters.
              </p>
            </div>
          </div>
        )}

        {filteredRecords.length > 0 ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={updatePage}
          />
        ) : null}
      </section>
    </div>
  );
}
