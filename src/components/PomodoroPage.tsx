import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, ShoppingBag } from "lucide-react";
import { useLanguage } from "../i18n";
import * as api from "../pomodoroApi";
import { usePet } from "../usePet";
import Cat from "./Cat";
import CoinIcon from "./CoinIcon";
import PetShopModal from "./PetShopModal";

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
  const { pet, earnCoinsForFocus, spend, purchaseSkin, equip } = usePet(userId);
  const [{ focus: focusMinutes, brk: breakMinutes }, setSettings] = useState(loadSettings);
  const [mode, setMode] = useState<Mode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(() => loadSettings().focus * 60);
  const [running, setRunning] = useState(false);
  const [todayCount, setTodayCount] = useState(0);
  const [taskName, setTaskName] = useState("");
  const [showShop, setShowShop] = useState(false);
  const [happyBurst, setHappyBurst] = useState(0);
  const [coinFlash, setCoinFlash] = useState<number | null>(null);
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
      earnCoinsForFocus(focusMinutes)
        .then((delta) => {
          if (delta) {
            setCoinFlash(delta);
            setHappyBurst((k) => k + 1);
            setTimeout(() => setCoinFlash(null), 2200);
          }
        })
        .catch((err) => console.error(err));
      setMode("break");
      setSecondsLeft(breakMinutes * 60);
      setTaskName("");
    } else {
      setMode("focus");
      setSecondsLeft(focusMinutes * 60);
    }
  }, [mode, focusMinutes, breakMinutes, taskName, earnCoinsForFocus]);

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

  const handleFocusSlider = (value: number) => {
    setSettings((prev) => {
      if (mode === "focus" && !running) setSecondsLeft(value * 60);
      return { ...prev, focus: value };
    });
  };

  const handleBreakSlider = (value: number) => {
    setSettings((prev) => {
      if (mode === "break" && !running) setSecondsLeft(value * 60);
      return { ...prev, brk: value };
    });
  };

  const handleFeedSnack = async (cost: number) => {
    const ok = await spend(cost);
    if (ok) setHappyBurst((k) => k + 1);
    return ok;
  };

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  const catMood = coinFlash
    ? "happy"
    : running
    ? mode === "focus"
      ? "studying"
      : "sleeping"
    : "idle";

  return (
    <div className="max-w-md mx-auto px-4 py-8 flex flex-col items-center">
      <div className="w-full">
        <h1 className="text-2xl font-medium text-neutral-900">{t("pomodoro.title")}</h1>
        <p className="text-sm text-neutral-500 mt-1">{t("pomodoro.subtitle")}</p>
      </div>

      {pet && (
        <div className="w-full flex items-center justify-between mt-4">
          <span className="flex items-center gap-1 text-sm font-medium text-amber-700">
            <CoinIcon size={18} /> {pet.coins}
          </span>
          <button
            onClick={() => setShowShop(true)}
            className="flex items-center gap-1 text-xs font-medium rounded-full px-3 py-1.5 bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          >
            <ShoppingBag size={13} /> {t("pet.shopButton")}
          </button>
        </div>
      )}

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

      <div className="relative h-48 w-48 mt-6">
        <Cat mood={catMood} skin={pet?.equippedSkin ?? "default"} happyBurstKey={happyBurst} />
        <div className="absolute inset-x-0 top-6 flex justify-center pointer-events-none">
          <span className="text-2xl font-semibold text-neutral-900 tabular-nums">
            {minutes}:{seconds}
          </span>
        </div>
        {coinFlash && (
          <span className="absolute -top-2 right-0 flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 rounded-full px-2 py-0.5 border border-amber-200">
            +{coinFlash} <CoinIcon size={12} />
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mt-4">
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
        <p className="text-xs font-medium text-neutral-500 mb-4">{t("pomodoro.settings")}</p>

        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-neutral-700">{t("pomodoro.focusMinutesLabel")}</span>
            <span className="text-sm font-medium text-neutral-900 tabular-nums">{focusMinutes}</span>
          </div>
          <input
            type="range"
            min={5}
            max={120}
            step={5}
            value={focusMinutes}
            disabled={running}
            onChange={(e) => handleFocusSlider(Number(e.target.value))}
            className="w-full accent-teal-600 disabled:opacity-40"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-neutral-700">{t("pomodoro.breakMinutesLabel")}</span>
            <span className="text-sm font-medium text-neutral-900 tabular-nums">{breakMinutes}</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={breakMinutes}
            disabled={running}
            onChange={(e) => handleBreakSlider(Number(e.target.value))}
            className="w-full accent-amber-500 disabled:opacity-40"
          />
        </div>

        {running && <p className="mt-3 text-xs text-neutral-400">{t("pomodoro.runningHint")}</p>}
      </div>

      {showShop && pet && (
        <PetShopModal
          pet={pet}
          onClose={() => setShowShop(false)}
          onBuySkin={purchaseSkin}
          onEquip={equip}
          onFeedSnack={handleFeedSnack}
        />
      )}
    </div>
  );
}
