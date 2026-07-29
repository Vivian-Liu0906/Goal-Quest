import { useLanguage } from "../i18n";

export default function LanguageSwitch() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex rounded-full bg-neutral-100 p-0.5 text-xs font-medium">
      <button
        onClick={() => setLang("zh")}
        className={`px-2.5 py-1 rounded-full transition-colors ${
          lang === "zh" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"
        }`}
      >
        中文
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 rounded-full transition-colors ${
          lang === "en" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"
        }`}
      >
        EN
      </button>
    </div>
  );
}
