export interface Task {
  id: string;
  title: string;
  xp: number;
  done: boolean;
  createdAt: string;
  doneAt?: string;
}

export interface Milestone {
  id: string;
  title: string;
  thresholdXp: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetXp: number;
  color: GoalColor;
  tasks: Task[];
  milestones: Milestone[];
  createdAt: string;
  archived: boolean;
}

export type GoalColor =
  | "teal"
  | "purple"
  | "coral"
  | "blue"
  | "amber";

export const GOAL_COLORS: GoalColor[] = ["teal", "purple", "coral", "blue", "amber"];
