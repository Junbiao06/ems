import { BarChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import type { EChartsCoreOption } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { useEffect, useRef } from "react";
import type { AttendanceTrendItem } from "@/types/dashboard";

echarts.use([
  BarChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  SVGRenderer,
]);

type AttendanceChartProps = {
  data: AttendanceTrendItem[];
};

export function AttendanceChart({ data }: AttendanceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = chartContainerRef.current;

    if (!container) {
      return;
    }

    const styles = getComputedStyle(document.documentElement);
    const chart = echarts.init(container, undefined, { renderer: "svg" });
    const option: EChartsCoreOption = {
      animationDuration: 450,
      color: [
        styles.getPropertyValue("--ui-chart-on-time").trim(),
        styles.getPropertyValue("--ui-chart-late").trim(),
        styles.getPropertyValue("--ui-chart-absent").trim(),
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      legend: {
        top: 0,
        left: 0,
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          color: styles.getPropertyValue("--ui-text-muted").trim(),
          fontFamily: "Outfit, Inter, sans-serif",
        },
      },
      grid: {
        top: 48,
        right: 8,
        bottom: 8,
        left: 8,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: data.map((item) => item.dateLabel),
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          color: styles.getPropertyValue("--ui-chart-axis").trim(),
        },
      },
      yAxis: {
        type: "value",
        minInterval: 1,
        axisLabel: {
          color: styles.getPropertyValue("--ui-chart-axis").trim(),
        },
        splitLine: {
          lineStyle: {
            color: styles.getPropertyValue("--ui-chart-grid").trim(),
          },
        },
      },
      series: [
        {
          name: "On time",
          type: "bar",
          stack: "attendance",
          barMaxWidth: 34,
          data: data.map((item) => item.onTime),
        },
        {
          name: "Late",
          type: "bar",
          stack: "attendance",
          data: data.map((item) => item.late),
        },
        {
          name: "Absent",
          type: "bar",
          stack: "attendance",
          data: data.map((item) => item.absent),
        },
      ],
    };

    chart.setOption(option);

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, [data]);

  return (
    <article className="min-w-0 rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-6 xl:col-span-2">
      <h2 className="font-extrabold text-text">Attendance overview</h2>
      <p className="mt-1 text-sm text-text-muted">
        Attendance composition across the last seven working days.
      </p>
      <div
        className="mt-6 h-80 w-full"
        ref={chartContainerRef}
        role="img"
        aria-label="Stacked bar chart showing on-time, late, and absent employees over seven working days"
      />
    </article>
  );
}
