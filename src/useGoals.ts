import { useCallback, useEffect, useState } from "react";
import type { Goal, GoalColor } from "./types";
import * as api from "./api";

export function useGoals(userId: string | null) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!userId) {
      setGoals([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.fetchGoals();
      setGoals(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("加载数据失败，请刷新重试");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const addGoal = useCallback(
    async (input: { title: string; description: string; targetXp: number; color: GoalColor }) => {
      const newGoal = await api.createGoal(input);
      setGoals((prev) => [...prev, newGoal]);
      return newGoal.id;
    },
    []
  );

  const deleteGoal = useCallback(async (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    await api.deleteGoal(goalId);
  }, []);

  const addTask = useCallback(async (goalId: string, input: { title: string; xp: number }) => {
    const newTask = await api.createTask(goalId, input);
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, tasks: [...g.tasks, newTask] } : g))
    );
  }, []);

  const toggleTask = useCallback(
    async (goalId: string, taskId: string) => {
      const goal = goals.find((g) => g.id === goalId);
      const task = goal?.tasks.find((t) => t.id === taskId);
      if (!task) return;
      const nextDone = !task.done;

      setGoals((prev) =>
        prev.map((g) =>
          g.id !== goalId
            ? g
            : {
                ...g,
                tasks: g.tasks.map((t) =>
                  t.id === taskId
                    ? { ...t, done: nextDone, doneAt: nextDone ? new Date().toISOString() : undefined }
                    : t
                ),
              }
        )
      );
      await api.toggleTask(taskId, nextDone);
    },
    [goals]
  );

  const deleteTask = useCallback(async (goalId: string, taskId: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, tasks: g.tasks.filter((t) => t.id !== taskId) } : g))
    );
    await api.deleteTask(taskId);
  }, []);

  const addMilestone = useCallback(
    async (goalId: string, input: { title: string; thresholdXp: number }) => {
      const newMilestone = await api.createMilestone(goalId, input);
      setGoals((prev) =>
        prev.map((g) =>
          g.id === goalId
            ? {
                ...g,
                milestones: [...g.milestones, newMilestone].sort(
                  (a, b) => a.thresholdXp - b.thresholdXp
                ),
              }
            : g
        )
      );
    },
    []
  );

  const deleteMilestone = useCallback(async (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, milestones: g.milestones.filter((m) => m.id !== milestoneId) }
          : g
      )
    );
    await api.deleteMilestone(milestoneId);
  }, []);

  return {
    goals,
    loading,
    error,
    addGoal,
    deleteGoal,
    addTask,
    toggleTask,
    deleteTask,
    addMilestone,
    deleteMilestone,
  };
}

export function currentXp(goal: Goal): number {
  return goal.tasks.filter((t) => t.done).reduce((sum, t) => sum + t.xp, 0);
}

export function progressPercent(goal: Goal): number {
  if (goal.targetXp <= 0) return 0;
  return Math.min(100, Math.round((currentXp(goal) / goal.targetXp) * 100));
}
