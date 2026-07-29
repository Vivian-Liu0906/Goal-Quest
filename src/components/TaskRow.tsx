import { Check, Trash2 } from "lucide-react";
import type { Task } from "../types";
import { useLanguage } from "../i18n";

interface TaskRowProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TaskRow({ task, onToggle, onDelete }: TaskRowProps) {
  const { t } = useLanguage();

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 hover:border-neutral-300 transition-colors">
      <button
        onClick={onToggle}
        aria-label={task.done ? t("task.markUndone") : t("task.markDone")}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          task.done
            ? "border-teal-500 bg-teal-500"
            : "border-neutral-300 hover:border-teal-400"
        }`}
      >
        {task.done && <Check size={14} className="text-white" />}
      </button>

      <span
        className={`flex-1 text-sm ${
          task.done ? "line-through text-neutral-400" : "text-neutral-800"
        }`}
      >
        {task.title}
      </span>

      <span className="text-xs font-medium text-neutral-400 shrink-0">+{task.xp} XP</span>

      <button
        onClick={onDelete}
        aria-label={t("task.delete")}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-300 hover:text-red-500 p-1"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
