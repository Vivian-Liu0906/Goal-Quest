import { Plus } from "lucide-react";
import type { Goal } from "../types";
import { useLanguage } from "../i18n";
import GoalCard from "./GoalCard";

interface DashboardProps {
  goals: Goal[];
  onOpenGoal: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
  onAddGoal: () => void;
}

export default function Dashboard({ goals, onOpenGoal, onDeleteGoal, onAddGoal }: DashboardProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-neutral-900">{t("dashboard.title")}</h1>
          <p className="text-sm text-neutral-500 mt-1">{t("dashboard.subtitle")}</p>
        </div>
        <button
          onClick={onAddGoal}
          className="flex items-center gap-1.5 rounded-full bg-neutral-900 text-white text-sm font-medium px-4 py-2 hover:bg-neutral-800 transition-colors shrink-0"
        >
          <Plus size={16} /> {t("dashboard.newGoal")}
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-neutral-300 rounded-2xl">
          <p className="text-neutral-500 text-sm">{t("dashboard.empty")}</p>
          <button
            onClick={onAddGoal}
            className="mt-4 rounded-full bg-neutral-900 text-white text-sm font-medium px-4 py-2 hover:bg-neutral-800 transition-colors"
          >
            {t("dashboard.newGoal")}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onOpen={() => onOpenGoal(goal.id)}
              onDelete={() => onDeleteGoal(goal.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
