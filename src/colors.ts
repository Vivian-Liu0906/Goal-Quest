import type { GoalColor } from "./types";

interface ColorTheme {
  bar: string;
  chipBg: string;
  chipText: string;
  ring: string;
  dot: string;
}

export const COLOR_THEMES: Record<GoalColor, ColorTheme> = {
  teal: {
    bar: "bg-teal-500",
    chipBg: "bg-teal-100",
    chipText: "text-teal-800",
    ring: "ring-teal-400",
    dot: "bg-teal-500",
  },
  purple: {
    bar: "bg-purple-500",
    chipBg: "bg-purple-100",
    chipText: "text-purple-800",
    ring: "ring-purple-400",
    dot: "bg-purple-500",
  },
  coral: {
    bar: "bg-orange-500",
    chipBg: "bg-orange-100",
    chipText: "text-orange-800",
    ring: "ring-orange-400",
    dot: "bg-orange-500",
  },
  blue: {
    bar: "bg-blue-500",
    chipBg: "bg-blue-100",
    chipText: "text-blue-800",
    ring: "ring-blue-400",
    dot: "bg-blue-500",
  },
  amber: {
    bar: "bg-amber-500",
    chipBg: "bg-amber-100",
    chipText: "text-amber-800",
    ring: "ring-amber-400",
    dot: "bg-amber-500",
  },
};
