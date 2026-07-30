import { supabase } from "./supabaseClient";

export interface PomodoroBreakdownItem {
  taskName: string;
  totalMinutes: number;
  percent: number;
}

function toDateString(d: Date): string {
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

export function todayString(): string {
  return toDateString(new Date());
}

export function getWeekRange(): { start: string; end: string } {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const diffToMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: toDateString(monday), end: toDateString(sunday) };
}

export function getMonthRange(): { start: string; end: string } {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: toDateString(first), end: toDateString(last) };
}

export async function logPomodoroSession(focusMinutes: number, taskName: string): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not signed in");

  const { error } = await supabase.from("pomodoro_sessions").insert({
    user_id: userId,
    focus_minutes: focusMinutes,
    session_date: todayString(),
    task_name: taskName.trim(),
  });
  if (error) throw error;
}

export async function fetchTodaySessionCount(): Promise<number> {
  const { count, error } = await supabase
    .from("pomodoro_sessions")
    .select("*", { count: "exact", head: true })
    .eq("session_date", todayString());
  if (error) throw error;
  return count ?? 0;
}

export async function fetchBreakdownForRange(
  startDate: string,
  endDate: string
): Promise<{ items: PomodoroBreakdownItem[]; sessionCount: number; totalMinutes: number }> {
  const { data, error } = await supabase
    .from("pomodoro_sessions")
    .select("task_name, focus_minutes")
    .gte("session_date", startDate)
    .lte("session_date", endDate);
  if (error) throw error;

  const rows = data ?? [];
  const totals = new Map<string, number>();
  for (const row of rows) {
    const name = (row.task_name as string) || "";
    totals.set(name, (totals.get(name) ?? 0) + (row.focus_minutes as number));
  }

  const grandTotal = Array.from(totals.values()).reduce((a, b) => a + b, 0);

  const items =
    grandTotal === 0
      ? []
      : Array.from(totals.entries())
          .map(([taskName, totalMinutes]) => ({
            taskName,
            totalMinutes,
            percent: Math.round((totalMinutes / grandTotal) * 100),
          }))
          .sort((a, b) => b.totalMinutes - a.totalMinutes);

  return { items, sessionCount: rows.length, totalMinutes: grandTotal };
}
