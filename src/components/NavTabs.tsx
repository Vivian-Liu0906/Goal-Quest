import { useLanguage } from "../i18n";

export type View = "goals" | "pomodoro" | "todos";

interface NavTabsProps {
  active: View;
  onChange: (view: View) => void;
}

export default function NavTabs({ active, onChange }: NavTabsProps) {
  const { t } = useLanguage();

  const tabs: { key: View; label: string }[] = [
    { key: "goals", label: t("nav.goals") },
    { key: "todos", label: t("nav.todos") },
    { key: "pomodoro", label: t("nav.pomodoro") },
  ];

  return (
    <div className="flex gap-1 rounded-full bg-neutral-100 p-1 text-sm font-medium w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-3.5 py-1.5 rounded-full transition-colors ${
            active === tab.key ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
