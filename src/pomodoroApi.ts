import { supabase } from "./supabaseClient";

export interface PomodoroBreakdownItem {
  taskName: string;
  totalMinutes: number;
  percent: number;
}

function todayString(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
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

export async function fetchTodayBreakdown(): Promise<PomodoroBreakdownItem[]> {
  const { data, error } = await supabase
    .from("pomodoro_sessions")
    .select("task_name, focus_minutes")
    .eq("session_date", todayString());
  if (error) throw error;

  const totals = new Map<string, number>();
  for (const row of data ?? []) {
    const name = (row.task_name as string) || "";
    totals.set(name, (totals.get(name) ?? 0) + (row.focus_minutes as number));
  }

  const grandTotal = Array.from(totals.values()).reduce((a, b) => a + b, 0);
  if (grandTotal === 0) return [];

  return Array.from(totals.entries())
    .map(([taskName, totalMinutes]) => ({
      taskName,
      totalMinutes,
      percent: Math.round((totalMinutes / grandTotal) * 100),
    }))
    .sort((a, b) => b.totalMinutes - a.totalMinutes);
}
