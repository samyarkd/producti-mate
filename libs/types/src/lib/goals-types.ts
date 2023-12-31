import type { Goal, GoalUser, User } from "@prisma/client";
import * as z from "zod";

export const UpdateGoalScheme = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export type UpdateGoalType = z.infer<typeof UpdateGoalScheme>;

export const JoinGoalScheme = z.object({
  goalId: z.number(),
});

export type JoinGoalType = z.infer<typeof JoinGoalScheme>;

export type GoalUserItem = {
  id: number;
  pfp?: string;
  name: string;
  exp: number;
};

export interface GoalUserTable {
  items: GoalUserItem[];
}

export interface GoalUsersListT {
  items: GoalUserItem[];
  goal?: Goal;
}

export interface EditGoalProps {
  goalUser?: GoalUser & {
    goal: Goal & { users: (GoalUser & { user: User })[] };
  };
}

export interface GoalT {
  goalUser?: GoalUser & {
    goal: Goal & { users: (GoalUser & { user: User })[] };
  };
}

export const AddGoalScheme = z.object({
  title: z.string({
    required_error: "A title for the goal is required.",
  }),
  description: z.string().optional(),
  isPrivate: z.boolean().optional(),
});

export interface AddGoalProps {
  onAdd: (data: z.infer<typeof AddGoalScheme>) => void;
}

export type GoalItem = {
  id: number;
  title: string;
  exp: number;
  users: (GoalUser & { user: User })[];
};

export interface GoalTable {
  items: GoalItem[];
}

export interface GoalsListT {
  items: GoalItem[];
  onAdd: (data: z.infer<typeof AddGoalScheme>) => void;
}
