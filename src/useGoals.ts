import { useEffect, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Goal, GoalColor, Milestone, Task } from "./types";
import { loadGoals, saveGoals } from "./storage";

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>(() => loadGoals());

  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  const addGoal = useCallback(
    (input: { title: string; description: string; targetXp: number; color: GoalColor }) => {
      const newGoal: Goal = {
        id: uuidv4(),
        title: input.title,
        description: input.description,
        targetXp: input.targetXp,
        color: input.color,
        tasks: [],
        milestones: [],
        createdAt: new Date().toISOString(),
        archived: false,
      };
      setGoals((prev) => [...prev, newGoal]);
      return newGoal.id;
    },
    []
  );

  const updateGoal = useCallback((goalId: string, updates: Partial<Omit<Goal, "id" | "tasks">>) => {
    setGoals((prev) => prev.map((g) => (g.id === goalId ? { ...g, ...updates } : g)));
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  }, []);

  const addTask = useCallback((goalId: string, input: { title: string; xp: number }) => {
    const newTask: Task = {
      id: uuidv4(),
      title: input.title,
      xp: input.xp,
      done: false,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, tasks: [...g.tasks, newTask] } : g))
    );
  }, []);

  const toggleTask = useCallback((goalId: string, taskId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          tasks: g.tasks.map((t) =>
            t.id === taskId
              ? { ...t, done: !t.done, doneAt: !t.done ? new Date().toISOString() : undefined }
              : t
          ),
        };
      })
    );
  }, []);

  const deleteTask = useCallback((goalId: string, taskId: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, tasks: g.tasks.filter((t) => t.id !== taskId) } : g))
    );
  }, []);

  const addMilestone = useCallback((goalId: string, input: { title: string; thresholdXp: number }) => {
    const newMilestone: Milestone = {
      id: uuidv4(),
      title: input.title,
      thresholdXp: input.thresholdXp,
    };
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
  }, []);

  const deleteMilestone = useCallback((goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, milestones: g.milestones.filter((m) => m.id !== milestoneId) }
          : g
      )
    );
  }, []);

  const replaceAllGoals = useCallback((newGoals: Goal[]) => {
    setGoals(newGoals);
  }, []);

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    addTask,
    toggleTask,
    deleteTask,
    addMilestone,
    deleteMilestone,
    replaceAllGoals,
  };
}

export function currentXp(goal: Goal): number {
  return goal.tasks.filter((t) => t.done).reduce((sum, t) => sum + t.xp, 0);
}

export function progressPercent(goal: Goal): number {
  if (goal.targetXp <= 0) return 0;
  return Math.min(100, Math.round((currentXp(goal) / goal.targetXp) * 100));
}
