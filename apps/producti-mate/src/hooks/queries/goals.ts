import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addGoal,
  deleteGoal,
  finishDailyGoal,
  getGoal,
  getGoals,
  sendInviteLink,
  updateGoal,
} from "@/lib/services/goals";

export const useGoals = () => {
  return useQuery({ queryKey: ["goals"], queryFn: getGoals });
};

export const useGoal = (id: number) => {
  return useQuery({
    queryKey: ["goal", id],
    queryFn: () => getGoal(id),
  });
};

export const useAddGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title: string; description?: string }) =>
      addGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["goals"]);
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGoal,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["goals"]);
      queryClient.invalidateQueries(["goal", id]);
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries(["goals"]);
    },
  });
};

export const useSendInviteLink = () => {
  return useMutation(sendInviteLink);
};

export const useFinishDailyGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finishDailyGoal,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(["goal", id]);
    },
  });
};