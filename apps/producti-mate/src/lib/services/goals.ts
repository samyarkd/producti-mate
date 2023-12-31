import { Goal, GoalUser, User } from "@prisma/client";
import { axiosClient } from "./axiosClient";

/**
 * create axios request functions for the following routes:
 * 1. GET /goals
 * 2. GET /goals/:id
 * 3. POST /goals/add
 * 4. PUT /goals/:id
 * 5. DELETE /goals/:id
 * 6. GET /goals/add/user/:id
 */

export const getGoals = async () => {
  return await axiosClient.get<
    (GoalUser & { goal: Goal & { users: (GoalUser & { user: User })[] } })[]
  >("/goals");
};

export const getPublicGoals = async () => {
  return await axiosClient.get<Goal[]>("/goals/public");
};

export const getGoal = async (id: number) => {
  return await axiosClient.get<
    GoalUser & { goal: Goal & { users: (GoalUser & { user: User })[] } }
  >(`/goals/${id}`);
};

export const addGoal = async (data: {
  title: string;
  description?: string;
}) => {
  return await axiosClient.post<
    GoalUser & { goal: Goal & { users: (GoalUser & { user: User })[] } }
  >("/goals/add", data);
};

export const joinGoal = async (data: { goalId: number }) => {
  return await axiosClient.post<GoalUser>("/goals/join", data);
};

export const updateGoal = async ({
  data,
  id,
}: {
  id: number;
  data: {
    title?: string;
    description?: string;
  };
}) => {
  return await axiosClient.put<GoalUser>(`/goals/${id}`, data);
};

export const deleteGoal = async (id: number) => {
  return await axiosClient.delete<{ message: "goal deleted" }>(`/goals/${id}`);
};

export const sendInviteLink = async (id: number) => {
  return await axiosClient.get<{ message: string }>(`/goals/add/user/${id}`);
};

export const finishDailyGoal = async (id: number) => {
  return await axiosClient.put<{ message: string }>(`/goals/finish/${id}`);
};
