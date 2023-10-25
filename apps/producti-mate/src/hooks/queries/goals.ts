import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { toast } from "@/components/ui/use-toast"
import {
  addGoal,
  deleteGoal,
  finishDailyGoal,
  getGoal,
  getGoals,
  getPublicGoals,
  joinGoal,
  sendInviteLink,
  updateGoal,
} from "@/lib/services/goals"
import { AddGoalScheme } from "@pm/types"
import * as z from "zod"

export const useGoals = () => {
  return useQuery({ queryKey: ["goals"], queryFn: getGoals })
}

export const usePublicGoals = () => {
  return useQuery({ queryKey: ["p-goals"], queryFn: getPublicGoals })
}

export const useGoal = (id: number) => {
  return useQuery({
    queryKey: ["goal", id],
    queryFn: () => getGoal(id),
  })
}

export const useAddGoal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: z.infer<typeof AddGoalScheme>) => addGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["goals"])
    },
  })
}

export const useJoinGoal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { goalId: number }) => joinGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["p-goals"])
      toast({
        title: "You successfully joined a goal",
      })
    },
  })
}

export const useUpdateGoal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateGoal,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["goals"])
      queryClient.invalidateQueries(["goal", id])
    },
  })
}

export const useDeleteGoal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries(["goals"])
    },
  })
}

export const useSendInviteLink = () => {
  return useMutation(sendInviteLink)
}

export const useFinishDailyGoal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: finishDailyGoal,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(["goal", id])
    },
  })
}
