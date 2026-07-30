import { useCallback, useEffect, useState } from "react";
import type { DailyTodo } from "./dailyTodoTypes";
import * as api from "./dailyTodoApi";

export function useDailyTodos(userId: string | null, date: string) {
  const [todos, setTodos] = useState<DailyTodo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!userId) {
      setTodos([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.fetchTodosForDate(date);
      setTodos(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("failed");
    } finally {
      setLoading(false);
    }
  }, [userId, date]);

  useEffect(() => {
    reload();
  }, [reload]);

  const addTodo = useCallback(
    async (title: string) => {
      const newTodo = await api.createTodo(title, date);
      setTodos((prev) => [...prev, newTodo]);
    },
    [date]
  );

  const toggleTodo = useCallback(
    async (id: string) => {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;
      const nextDone = !todo.done;
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: nextDone } : t)));
      await api.toggleTodo(id, nextDone);
    },
    [todos]
  );

  const deleteTodo = useCallback(async (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    await api.deleteTodo(id);
  }, []);

  return { todos, loading, error, addTodo, toggleTodo, deleteTodo };
}
