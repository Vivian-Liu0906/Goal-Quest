import type { Goal } from "./types";

const STORAGE_KEY = "goal-quest-data-v1";

export function loadGoals(): Goal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Goal[];
  } catch (err) {
    console.error("Failed to load goals from storage", err);
    return [];
  }
}

export function saveGoals(goals: Goal[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch (err) {
    console.error("Failed to save goals to storage", err);
  }
}

export function exportGoalsAsJson(goals: Goal[]): string {
  return JSON.stringify(goals, null, 2);
}

export function importGoalsFromJson(json: string): Goal[] {
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed)) {
    throw new Error("Invalid data format: expected an array of goals");
  }
  return parsed as Goal[];
}
