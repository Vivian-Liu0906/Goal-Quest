import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useLanguage } from "../i18n";
import * as api from "../pomodoroApi";

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

type Mode = "focus" | "break";

export default function PomodoroPage({ userId }: { userId: string }) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MINUTES * 60);
  const [running, setRunning] = useState(false);
  const [todayCount, setTodayCount] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    api
      .fetchTodaySessionCount()
      .then(setTodayCount)
      .catch((err) => console.error(err));
  }, [userId]);

  const totalSeconds = (mode === "focus" ? FOCUS_MINUTES : BREAK_MINUTES) * 60;

  const handleComplete = useCallback(() => {
    setRunning(false);
    if (mode === "focus") {
      api
        .logPomodoroSession(FOCUS_MINUTES)
        .then(() => setTodayCount((c) => c + 1))
        .catch((err) => console.error(err));
      setMode("break");
      setSecondsLeft(BREAK_MINUTES * 60);
    } else {
      setMode("focus");
      setSecondsLeft(FOCUS_MINUTES * 60);
    }
  }, [mode]);

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
    setSecondsLeft((next === "focus" ? FOCUS_MINUTES : BREAK_MINUTES) * 60);
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
    </div>
  );
}
