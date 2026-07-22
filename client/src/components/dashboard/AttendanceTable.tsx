import type { AttendanceTrendItem } from "../../types/dashboard";

type AttendanceTableProps = {
  data: AttendanceTrendItem[];
};

export function AttendanceTable({ data }: AttendanceTableProps) {
  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <h2 className="font-extrabold text-text">Daily breakdown</h2>
        <p className="mt-1 text-sm text-text-muted">Exact daily attendance totals.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-muted text-xs text-text-subtle uppercase">
            <tr>
              <th className="px-5 py-3 font-bold" scope="col">
                Date
              </th>
              <th className="px-3 py-3 text-right font-bold" scope="col">
                Present
              </th>
              <th className="px-3 py-3 text-right font-bold" scope="col">
                Late
              </th>
              <th className="px-5 py-3 text-right font-bold" scope="col">
                Rate
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item) => {
              const present = item.onTime + item.late;
              const total = present + item.absent;
              const attendanceRate = total === 0 ? 0 : Math.round((present / total) * 100);

              return (
                <tr className="hover:bg-surface-muted/60" key={item.dateLabel}>
                  <th className="whitespace-nowrap px-5 py-3 font-semibold text-text" scope="row">
                    {item.dateLabel}
                  </th>
                  <td className="px-3 py-3 text-right font-semibold text-success-text">
                    {present}
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-warning-text">
                    {item.late}
                  </td>
                  <td className="px-5 py-3 text-right font-extrabold text-text">
                    {attendanceRate}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}
