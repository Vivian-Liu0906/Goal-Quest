import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Pause, Play, Plus, RotateCcw } from "lucide-react";
import { useLanguage } from "../i18n";
import * as api from "../pomodoroApi";

type Mode = "focus" | "break";

const SETTINGS_KEY = "goal-quest-pomodoro-settings";
const DEFAULT_FOCUS = 25;
const DEFAULT_BREAK = 5;

function loadSettings(): { focus: number; brk: number } {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { focus: DEFAULT_FOCUS, brk: DEFAULT_BREAK };
    const parsed = JSON.parse(raw);
    return {
      focus: Number(parsed.focus) > 0 ? Number(parsed.focus) : DEFAULT_FOCUS,
      brk: Number(parsed.brk) > 0 ? Number(parsed.brk) : DEFAULT_BREAK,
    };
  } catch {
    return { focus: DEFAULT_FOCUS, brk: DEFAULT_BREAK };
  }
}

export default function PomodoroPage({ userId }: { userId: string }) {
  const { t } = useLanguage();
  const [{ focus: focusMinutes, brk: breakMinutes }, setSettings] = useState(loadSettings);
  const [mode, setMode] = useState<Mode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(() => loadSettings().focus * 60);
  const [running, setRunning] = useState(false);
  const [todayCount, setTodayCount] = useState(0);
  const [taskName, setTaskName] = useState("");
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    api
      .fetchTodaySessionCount()
      .then(setTodayCount)
      .catch((err) => console.error(err));
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ focus: focusMinutes, brk: breakMinutes }));
  }, [focusMinutes, breakMinutes]);

  const totalSeconds = (mode === "focus" ? focusMinutes : breakMinutes) * 60;

  const handleComplete = useCallback(() => {
    setRunning(false);
    if (mode === "focus") {
      api
        .logPomodoroSession(focusMinutes, taskName)
        .then(() => setTodayCount((c) => c + 1))
        .catch((err) => console.error(err));
      setMode("break");
      setSecondsLeft(breakMinutes * 60);
      setTaskName("");
    } else {
      setMode("focus");
      setSecondsLeft(focusMinutes * 60);
    }
  }, [mode, focusMinutes, breakMinutes, taskName]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(intervalRef.current!);
          handleComplete();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, handleComplete]);

  const toggleRunning = () => setRunning((r) => !r);

  const reset = () => {
    setRunning(false);
    setSecondsLeft(totalSeconds);
  };

  const switchMode = (next: Mode) => {
    setRunning(false);
    setMode(next);
    setSecondsLeft((next === "focus" ? focusMinutes : breakMinutes) * 60);
  };

  const adjustFocus = (delta: number) => {
    setSettings((prev) => {
      const next = Math.min(120, Math.max(1, prev.focus + delta));
      if (mode === "focus") setSecondsLeft(next * 60);
      return { ...prev, focus: next };
    });
  };

  const adjustBreak = (delta: number) => {
    setSettings((prev) => {
      const next = Math.min(60, Math.max(1, prev.brk + delta));
      if (mode === "break") setSecondsLeft(next * 60);
      return { ...prev, brk: next };
    });
  };

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");
  const progress = 1 - secondsLeft / totalSeconds;
  const circumference = 2 * Math.PI * 90;

  return (
    <div className="max-w-md mx-auto px-4 py-8 flex flex-col items-center">
      <h1 className="text-2xl font-medium text-neutral-900">{t("pomodoro.title")}</h1>
      <p className="text-sm text-neutral-500 mt-1 text-center">{t("pomodoro.subtitle")}</p>

      <div className="flex mt-6 rounded-full bg-neutral-100 p-1 text-sm font-medium">
        <button
          onClick={() => switchMode("focus")}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            mode === "focus" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"
          }`}
        >
          {t("pomodoro.focus")}
        </button>
        <button
          onClick={() => switchMode("break")}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            mode === "break" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"
          }`}
        >
          {t("pomodoro.break")}
        </button>
      </div>

      {mode === "focus" && (
        <input
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          disabled={running}
          placeholder={t("pomodoro.taskNamePlaceholder")}
          className="w-full mt-5 rounded-lg border border-neutral-300 px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-60"
        />
      )}

      <div className="relative mt-10 h-56 w-56">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#E5E5E5" strokeWidth="10" />
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={mode === "focus" ? "#0F766E" : "#D97706"}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-medium text-neutral-900 tabular-nums">
            {minutes}:{seconds}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={reset}
          aria-label={t("pomodoro.reset")}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 hover:bg-neutral-100"
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={toggleRunning}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-neutral-800"
        >
          {running ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
        </button>
        <div className="h-11 w-11" />
      </div>

      <p className="mt-8 text-sm text-neutral-500">
        {t("pomodoro.todaySessions")}{" "}
        <span className="font-medium text-neutral-900">{todayCount}</span> {t("pomodoro.sessionsUnit")}
      </p>

      <div className="w-full mt-8 rounded-2xl border border-neutral-200 bg-white p-5">
        <p className="text-xs font-medium text-neutral-500 mb-3">{t("pomodoro.settings")}</p>

        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-neutral-700">{t("pomodoro.focusMinutesLabel")}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => adjustFocus(-5)}
              disabled={running}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 hover:bg-neutral-100 disabled:opacity-40"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-medium text-neutral-900 tabular-nums">
              {focusMinutes}
            </span>
            <button
              onClick={() => adjustFocus(5)}
              disabled={running}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 hover:bg-neutral-100 disabled:opacity-40"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-neutral-700">{t("pomodoro.breakMinutesLabel")}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => adjustBreak(-1)}
              disabled={running}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 hover:bg-neutral-100 disabled:opacity-40"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-medium text-neutral-900 tabular-nums">
              {breakMinutes}
            </span>
            <button
              onClick={() => adjustBreak(1)}
              disabled={running}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 hover:bg-neutral-100 disabled:opacity-40"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {running && <p className="mt-2 text-xs text-neutral-400">{t("pomodoro.runningHint")}</p>}
      </div>
    </div>
  );
}
