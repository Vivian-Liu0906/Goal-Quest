import { useState } from "react";
import Modal from "./Modal";
import type { GoalColor } from "../types";
import { GOAL_COLORS } from "../types";
import { COLOR_THEMES } from "../colors";

interface AddGoalModalProps {
  onClose: () => void;
  onCreate: (input: { title: string; description: string; targetXp: number; color: GoalColor }) => void;
}

export default function AddGoalModal({ onClose, onCreate }: AddGoalModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetXp, setTargetXp] = useState(500);
  const [color, setColor] = useState<GoalColor>("teal");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), description: description.trim(), targetXp, color });
    onClose();
  };

  return (
    <Modal title="新建目标" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">目标名称</label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：完成机器学习专项课程"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">描述（可选）</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="这个目标是为了什么？"
            rows={2}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            目标总经验值（预估完成所有任务需要的总XP）
          </label>
          <input
            type="number"
            min={1}
            value={targetXp}
            onChange={(e) => setTargetXp(Number(e.target.value))}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">主题色</label>
          <div className="flex gap-2">
            {GOAL_COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-full ${COLOR_THEMES[c].dot} ${
                  color === c ? "ring-2 ring-offset-2 ring-neutral-800" : ""
                }`}
                aria-label={c}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-neutral-900 text-white text-sm font-medium py-2.5 hover:bg-neutral-800 transition-colors"
        >
          创建目标
        </button>
      </form>
    </Modal>
  );
}
