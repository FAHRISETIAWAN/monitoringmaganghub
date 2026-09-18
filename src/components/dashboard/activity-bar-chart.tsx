"use client";

export type BarDatum = {
  label: string;
  value: number;
  isToday?: boolean;
};

export function ActivityBarChart({ data }: { data: BarDatum[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="flex h-64 items-end gap-2 sm:gap-3">
      {data.map((d) => {
        const heightPct = Math.max(6, Math.round((d.value / max) * 100));
        return (
          <div
            key={d.label}
            className="flex flex-1 flex-col items-center gap-2"
            title={`${d.label}: ${d.value} logbook`}
          >
            <div className="flex h-56 w-full items-end rounded-lg bg-surface-soft">
              <div
                className="w-full rounded-lg transition-all"
                style={{
                  height: `${heightPct}%`,
                  backgroundColor: d.isToday
                    ? "var(--primary)"
                    : "color-mix(in oklch, var(--primary), white 55%)",
                }}
              />
            </div>
            <span
              className={
                d.isToday
                  ? "text-xs font-semibold text-primary"
                  : "text-xs text-muted-foreground"
              }
            >
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
