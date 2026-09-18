export type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

export function StatusDonut({
  segments,
  centerLabel,
}: {
  segments: DonutSegment[];
  centerLabel: string;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  let cursor = 0;
  const stops = segments.map((s) => {
    const pct = total === 0 ? 0 : (s.value / total) * 100;
    const start = cursor;
    const end = cursor + pct;
    cursor = end;
    return `${s.color} ${start}% ${end}%`;
  });

  const background =
    total === 0
      ? "var(--surface-strong)"
      : `conic-gradient(${stops.join(", ")})`;

  return (
    <div className="flex h-64 flex-col items-center justify-center gap-6">
      <div
        className="relative flex size-40 shrink-0 items-center justify-center rounded-full"
        style={{ background }}
      >
        <div className="flex size-24 flex-col items-center justify-center rounded-full bg-card text-center">
          <span className="font-numeric text-xl font-semibold text-ink">
            {total}
          </span>
          <span className="text-xs text-muted-foreground">{centerLabel}</span>
        </div>
      </div>

      <ul className="flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-sm text-body">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span>{s.label}</span>
            <span className="font-numeric font-semibold text-ink">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
