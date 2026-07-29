import { supabase } from "./supabaseClient";

function todayString(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

export async function logPomodoroSession(focusMinutes: number): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not signed in");

  const { error } = await supabase
    .from("pomodoro_sessions")
    .insert({ user_id: userId, focus_minutes: focusMinutes, session_date: todayString() });
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
