import { supabase } from "./supabaseClient";
import type { Goal, GoalColor, Milestone, Task } from "./types";

interface GoalRow {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_xp: number;
  color: string;
  archived: boolean;
  created_at: string;
}

interface TaskRow {
  id: string;
  goal_id: string;
  title: string;
  xp: number;
  done: boolean;
  created_at: string;
  done_at: string | null;
}

interface MilestoneRow {
  id: string;
  goal_id: string;
  title: string;
  threshold_xp: number;
}

function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    xp: row.xp,
    done: row.done,
    createdAt: row.created_at,
    doneAt: row.done_at ?? undefined,
  };
}

function mapMilestone(row: MilestoneRow): Milestone {
  return {
    id: row.id,
    title: row.title,
    thresholdXp: row.threshold_xp,
  };
}

function mapGoal(row: GoalRow, tasks: TaskRow[], milestones: MilestoneRow[]): Goal {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    targetXp: row.target_xp,
    color: row.color as GoalColor,
    archived: row.archived,
    createdAt: row.created_at,
    tasks: tasks.filter((t) => t.goal_id === row.id).map(mapTask),
    milestones: milestones
      .filter((m) => m.goal_id === row.id)
      .map(mapMilestone)
      .sort((a, b) => a.thresholdXp - b.thresholdXp),
  };
}

export async function fetchGoals(): Promise<Goal[]> {
  const { data: goalRows, error: goalsError } = await supabase
    .from("goals")
    .select("*")
    .order("created_at", { ascending: true });
  if (goalsError) throw goalsError;

  const goalIds = (goalRows ?? []).map((g) => g.id);
  if (goalIds.length === 0) return [];

  const { data: taskRows, error: tasksError } = await supabase
    .from("tasks")
    .select("*")
    .in("goal_id", goalIds)
    .order("created_at", { ascending: true });
  if (tasksError) throw tasksError;

  const { data: milestoneRows, error: milestonesError } = await supabase
    .from("milestones")
    .select("*")
    .in("goal_id", goalIds);
  if (milestonesError) throw milestonesError;

  return (goalRows as GoalRow[]).map((g) =>
    mapGoal(g, (taskRows ?? []) as TaskRow[], (milestoneRows ?? []) as MilestoneRow[])
  );
}

export async function createGoal(input: {
  title: string;
  description: string;
  targetXp: number;
  color: GoalColor;
}): Promise<Goal> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not signed in");

  const { data, error } = await supabase
    .from("goals")
    .insert({
      user_id: userId,
      title: input.title,
      description: input.description,
      target_xp: input.targetXp,
      color: input.color,
    })
    .select()
    .single();
  if (error) throw error;
  return mapGoal(data as GoalRow, [], []);
}

export async function deleteGoal(goalId: string): Promise<void> {
  const { error } = await supabase.from("goals").delete().eq("id", goalId);
  if (error) throw error;
}

export async function createTask(goalId: string, input: { title: string; xp: number }): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert({ goal_id: goalId, title: input.title, xp: input.xp })
    .select()
    .single();
  if (error) throw error;
  return mapTask(data as TaskRow);
}

export async function toggleTask(taskId: string, done: boolean): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .update({ done, done_at: done ? new Date().toISOString() : null })
    .eq("id", taskId);
  if (error) throw error;
}

export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) throw error;
}

export async function createMilestone(
  goalId: string,
  input: { title: string; thresholdXp: number }
): Promise<Milestone> {
  const { data, error } = await supabase
    .from("milestones")
    .insert({ goal_id: goalId, title: input.title, threshold_xp: input.thresholdXp })
    .select()
    .single();
  if (error) throw error;
  return mapMilestone(data as MilestoneRow);
}

export async function deleteMilestone(milestoneId: string): Promise<void> {
  const { error } = await supabase.from("milestones").delete().eq("id", milestoneId);
  if (error) throw error;
}
