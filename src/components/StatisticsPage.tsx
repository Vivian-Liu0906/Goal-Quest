import { useEffect, useState } from "react";
import { useLanguage } from "../i18n";
import * as api from "../pomodoroApi";
import type { PomodoroBreakdownItem } from "../pomodoroApi";
import PieChart from "./PieChart";

type Period = "day" | "week" | "month";

interface PeriodData {
  items: PomodoroBreakdownItem[];
  sessionCount: number;
  totalMinutes: number;
}

function getRangeForPeriod(period: Period): { start: string; end: string } {
  if (period === "day") {
    const today = api.todayString();
    return { start: today, end: today };
  }
  if (period === "week") return api.getWeekRange();
  return api.getMonthRange();
}

export default function StatisticsPage() {
  const { t } = useLanguage();
  const [period, setPeriod] = useState<Period>("day");
  const [data, setData] = useState<PeriodData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const { start, end } = getRangeForPeriod(period);
    api
      .fetchBreakdownForRange(start, end)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [period]);

  const tabs: { key: Period; label: string }[] = [
    { key: "day", label: t("stats.day") },
    { key: "week", label: t("stats.week") },
    { key: "month", label: t("stats.month") },
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium text-neutral-900">{t("stats.title")}</h1>
      <p className="text-sm text-neutral-500 mt-1">{t("stats.subtitle")}</p>

      <div className="flex mt-6 rounded-full bg-neutral-100 p-1 text-sm font-medium w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setPeriod(tab.key)}
            className={`px-4 py-1.5 rounded-full transition-colors ${
              period === tab.key ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {!loading && data && (
        <div className="flex gap-6 mt-6 text-sm">
          <div>
            <p className="text-neutral-400 text-xs">{t("stats.totalFocus")}</p>
            <p className="font-medium text-neutral-900">
              {data.totalMinutes} {t("stats.minutesUnit")}
            </p>
          </div>
          <div>
            <p className="text-neutral-400 text-xs">{t("stats.sessionCount")}</p>
            <p className="font-medium text-neutral-900">
              {data.sessionCount} {t("stats.countUnit")}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
        {loading ? (
          <p className="text-sm text-neutral-400 text-center py-8">{t("app.loading")}</p>
        ) : !data || data.items.length === 0 ? (
          <p className="text-sm text-neutral-400 text-center py-8">{t("stats.empty")}</p>
        ) : (
          <PieChart
            items={data.items.map((item) => ({
              label: item.taskName || t("stats.untitledTask"),
              percent: item.percent,
              minutes: item.totalMinutes,
            }))}
          />
        )}
      </div>
    </div>
  );
}
