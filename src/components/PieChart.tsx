const COLORS = ["#0F766E", "#7C3AED", "#EA580C", "#2563EB", "#D97706", "#DB2777", "#059669", "#4F46E5"];

interface PieChartItem {
  label: string;
  percent: number;
  minutes: number;
}

interface PieChartProps {
  items: PieChartItem[];
}

export default function PieChart({ items }: PieChartProps) {
  let cumulative = 0;
  const stops = items.map((item, i) => {
    const start = cumulative;
    cumulative += item.percent;
    const color = COLORS[i % COLORS.length];
    return `${color} ${start}% ${cumulative}%`;
  });

  const gradient =
    stops.length > 0 ? `conic-gradient(${stops.join(", ")})` : "conic-gradient(#E5E5E5 0% 100%)";

  return (
    <div className="flex items-center gap-6">
      <div
        className="h-32 w-32 shrink-0 rounded-full"
        style={{ background: gradient }}
        role="img"
        aria-label="pie chart"
      >
        <div className="h-full w-full flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-white" />
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        {items.map((item, i) => (
          <div key={item.label + i} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="truncate text-neutral-700 flex-1">{item.label}</span>
            <span className="text-neutral-400 shrink-0">{item.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
