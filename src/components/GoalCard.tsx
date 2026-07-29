import { Target, Trash2 } from "lucide-react";
import type { Goal } from "../types";
import { currentXp, progressPercent } from "../useGoals";
import { useLanguage } from "../i18n";
import ProgressBar from "./ProgressBar";
import { COLOR_THEMES } from "../colors";

interface GoalCardProps {
  goal: Goal;
  onOpen: () => void;
  onDelete: () => void;
}

export default function GoalCard({ goal, onOpen, onDelete }: GoalCardProps) {
  const { t } = useLanguage();
  const percent = progressPercent(goal);
  const xp = currentXp(goal);
  const theme = COLOR_THEMES[goal.color];
  const doneCount = goal.tasks.filter((t) => t.done).length;

  return (
    <div
      onClick={onOpen}
      className="group cursor-pointer rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${theme.chipBg}`}>
            <Target size={16} className={theme.chipText} />
          </span>
          <h3 className="font-medium text-neutral-900 truncate">{goal.title}</h3>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-red-500 p-1"
          aria-label={t("goal.delete")}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {goal.description && (
        <p className="mt-2 text-sm text-neutral-500 line-clamp-2">{goal.description}</p>
      )}

      <div className="mt-4">
        <div className="flex justify-between text-xs text-neutral-500 mb-1.5">
          <span>{doneCount} / {goal.tasks.length} {t("dashboard.taskCount")}</span>
          <span>{xp} / {goal.targetXp} XP</span>
        </div>
        <ProgressBar percent={percent} color={goal.color} />
        <p className="mt-1.5 text-xs text-neutral-400">
          {percent >= 100 ? t("dashboard.completed") : `${t("dashboard.progressLabel")} ${percent}%`}
        </p>
      </div>
    </div>
  );
}
