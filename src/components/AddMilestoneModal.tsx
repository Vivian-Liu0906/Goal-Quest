import { useState } from "react";
import Modal from "./Modal";
import { useLanguage } from "../i18n";

interface AddMilestoneModalProps {
  onClose: () => void;
  onCreate: (input: { title: string; thresholdXp: number }) => void;
  maxXp: number;
}

export default function AddMilestoneModal({ onClose, onCreate, maxXp }: AddMilestoneModalProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [thresholdXp, setThresholdXp] = useState(Math.round(maxXp / 2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), thresholdXp });
    onClose();
  };

  return (
    <Modal title={t("modal.newMilestone.title")} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            {t("modal.newMilestone.name")}
          </label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("modal.newMilestone.placeholder")}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            {t("modal.newMilestone.threshold")}
          </label>
          <input
            type="number"
            min={1}
            max={maxXp}
            value={thresholdXp}
            onChange={(e) => setThresholdXp(Number(e.target.value))}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-neutral-900 text-white text-sm font-medium py-2.5 hover:bg-neutral-800 transition-colors"
        >
          {t("modal.newMilestone.submit")}
        </button>
      </form>
    </Modal>
  );
}
