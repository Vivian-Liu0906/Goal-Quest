import { useState } from "react";
import Modal from "./Modal";
import { useLanguage } from "../i18n";

interface AddTaskModalProps {
  onClose: () => void;
  onCreate: (input: { title: string; xp: number }) => void;
}

export default function AddTaskModal({ onClose, onCreate }: AddTaskModalProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [xp, setXp] = useState(20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), xp });
    onClose();
  };

  return (
    <Modal title={t("modal.newTask.title")} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            {t("modal.newTask.content")}
          </label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("modal.newTask.placeholder")}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            {t("modal.newTask.xp")}
          </label>
          <input
            type="number"
            min={1}
            value={xp}
            onChange={(e) => setXp(Number(e.target.value))}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-neutral-900 text-white text-sm font-medium py-2.5 hover:bg-neutral-800 transition-colors"
        >
          {t("modal.newTask.submit")}
        </button>
      </form>
    </Modal>
  );
}
