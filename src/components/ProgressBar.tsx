import { COLOR_THEMES } from "../colors";
import type { GoalColor } from "../types";

interface ProgressBarProps {
  percent: number;
  color: GoalColor;
  height?: string;
}

export default function ProgressBar({ percent, color, height = "h-2.5" }: ProgressBarProps) {
  const theme = COLOR_THEMES[color];
  return (
    <div className={`w-full ${height} rounded-full bg-neutral-200 overflow-hidden`}>
      <div
        className={`${height} ${theme.bar} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
      />
    </div>
  );
}
