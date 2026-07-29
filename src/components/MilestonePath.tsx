import { Flag, Trash2 } from "lucide-react";
import type { Goal } from "../types";
import { currentXp } from "../useGoals";
import { COLOR_THEMES } from "../colors";
import { useLanguage } from "../i18n";

interface MilestonePathProps {
  goal: Goal;
  onDeleteMilestone: (milestoneId: string) => void;
}

export default function MilestonePath({ goal, onDeleteMilestone }: MilestonePathProps) {
  const { t } = useLanguage();
  const xp = currentXp(goal);
  const theme = COLOR_THEMES[goal.color];

  const points = [
    { id: "start", title: t("goal.start"), thresholdXp: 0 },
    ...goal.milestones,
    { id: "end", title: t("goal.finish"), thresholdXp: goal.targetXp },
  ];

  return (
    <div className="relative pt-2 pb-4">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-neutral-200" />
        <div
          className={`absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full ${theme.bar} transition-all duration-500`}
          style={{
            width: `${Math.min(100, (xp / Math.max(1, goal.targetXp)) * 100)}%`,
          }}
        />

        {points.map((p) => {
          const reached = xp >= p.thresholdXp;
          const isEdge = p.id === "start" || p.id === "end";
          return (
            <div
              key={p.id}
              className="relative z-10 flex flex-col items-center gap-1.5"
              style={{ flex: isEdge ? "0 0 auto" : "1 1 0" }}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 bg-white ${
                  reached ? `${theme.ring.replace("ring-", "border-")}` : "border-neutral-300"
                }`}
              >
                <Flag
                  size={13}
                  className={reached ? theme.chipText : "text-neutral-300"}
                />
              </div>
              <span
                className={`text-[11px] text-center max-w-[80px] leading-tight ${
                  reached ? "text-neutral-700 font-medium" : "text-neutral-400"
                }`}
              >
                {p.title}
              </span>
              {!isEdge && (
                <button
                  onClick={() => onDeleteMilestone(p.id)}
                  className="text-neutral-300 hover:text-red-500"
                  aria-label={t("goal.deleteMilestone")}
                >
                  <Trash2 size={11} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
