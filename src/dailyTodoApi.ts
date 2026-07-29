import { supabase } from "./supabaseClient";
import type { DailyTodo } from "./dailyTodoTypes";

interface DailyTodoRow {
  id: string;
  title: string;
  done: boolean;
  todo_date: string;
  created_at: string;
}

function mapRow(row: DailyTodoRow): DailyTodo {
  return {
    id: row.id,
    title: row.title,
    done: row.done,
    todoDate: row.todo_date,
    createdAt: row.created_at,
  };
}

function todayString(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

export async function fetchTodayTodos(): Promise<DailyTodo[]> {
  const { data, error } = await supabase
    .from("daily_todos")
    .select("*")
    .eq("todo_date", todayString())
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as DailyTodoRow[]).map(mapRow);
}

export async function createTodo(title: string): Promise<DailyTodo> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not signed in");

  const { data, error } = await supabase
    .from("daily_todos")
    .insert({ user_id: userId, title, todo_date: todayString() })
    .select()
    .single();
  if (error) throw error;
  return mapRow(data as DailyTodoRow);
}

export async function toggleTodo(id: string, done: boolean): Promise<void> {
  const { error } = await supabase.from("daily_todos").update({ done }).eq("id", id);
  if (error) throw error;
}

export async function deleteTodo(id: string): Promise<void> {
  const { error } = await supabase.from("daily_todos").delete().eq("id", id);
  if (error) throw error;
}
