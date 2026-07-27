import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import type { Goal } from "../types";
import { currentXp, progressPercent } from "../useGoals";
import ProgressBar from "./ProgressBar";
import TaskRow from "./TaskRow";
import MilestonePath from "./MilestonePath";
import AddTaskModal from "./AddTaskModal";
import AddMilestoneModal from "./AddMilestoneModal";
import { COLOR_THEMES } from "../colors";

interface GoalDetailProps {
  goal: Goal;
  onBack: () => void;
  onAddTask: (input: { title: string; xp: number }) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddMilestone: (input: { title: string; thresholdXp: number }) => void;
  onDeleteMilestone: (milestoneId: string) => void;
}

export default function GoalDetail({
  goal,
  onBack,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onAddMilestone,
  onDeleteMilestone,
}: GoalDetailProps) {
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddMilestone, setShowAddMilestone] = useState(false);

  const percent = progressPercent(goal);
  const xp = currentXp(goal);
  const theme = COLOR_THEMES[goal.color];

  const pendingTasks = goal.tasks.filter((t) => !t.done);
  const doneTasks = goal.tasks.filter((t) => t.done);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 mb-6"
      >
        <ArrowLeft size={16} />
        返回全部目标
      </button>

      <h1 className="text-2xl font-medium text-neutral-900">{goal.title}</h1>
      {goal.description && (
        <p className="mt-1.5 text-sm text-neutral-500">{goal.description}</p>
      )}

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="flex justify-between text-sm text-neutral-500 mb-2">
          <span>目标总进度</span>
          <span className="font-medium text-neutral-700">
            {xp} / {goal.targetXp} XP ({percent}%)
          </span>
        </div>
        <ProgressBar percent={percent} color={goal.color} height="h-3" />

        <div className="mt-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-neutral-500">旅程</span>
            <button
              onClick={() => setShowAddMilestone(true)}
              className="text-xs text-neutral-400 hover:text-neutral-700 flex items-center gap-1"
            >
              <Plus size={12} /> 加个里程碑
            </button>
          </div>
          <MilestonePath goal={goal} onDeleteMilestone={onDeleteMilestone} />
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-neutral-700">
            待完成任务 ({pendingTasks.length})
          </h2>
          <button
            onClick={() => setShowAddTask(true)}
            className={`flex items-center gap-1 text-xs font-medium rounded-full px-3 py-1.5 ${theme.chipBg} ${theme.chipText}`}
          >
            <Plus size={13} /> 新建任务
          </button>
        </div>

        <div className="space-y-2">
          {pendingTasks.length === 0 && (
            <p className="text-sm text-neutral-400 py-6 text-center">
              暂无待完成任务，点击右上角添加一个吧
            </p>
          )}
          {pendingTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={() => onToggleTask(task.id)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </div>

        {doneTasks.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-medium text-neutral-400 mb-3">
              已完成 ({doneTasks.length})
            </h2>
            <div className="space-y-2">
              {doneTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={() => onToggleTask(task.id)}
                  onDelete={() => onDeleteTask(task.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showAddTask && (
        <AddTaskModal onClose={() => setShowAddTask(false)} onCreate={onAddTask} />
      )}
      {showAddMilestone && (
        <AddMilestoneModal
          onClose={() => setShowAddMilestone(false)}
          onCreate={onAddMilestone}
          maxXp={goal.targetXp}
        />
      )}
    </div>
  );
}
