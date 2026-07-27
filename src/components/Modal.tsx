import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-neutral-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="关闭"
            className="text-neutral-400 hover:text-neutral-700 p-1"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
