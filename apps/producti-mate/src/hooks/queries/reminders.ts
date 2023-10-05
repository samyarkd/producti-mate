import {
  addReminder,
  deleteReminder,
  getReminder,
  getReminders,
  updateReminder,
} from "@/lib/services/reminders";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useReminders = () => {
  return useQuery({
    queryFn: getReminders,
    queryKey: ["reminders"],
  });
};

export const useReminder = (id: number) => {
  return useQuery({
    queryFn: () => getReminder(id),
    queryKey: ["reminder", id],
  });
};

export const useAddReminder = () => {
  return useMutation({
    mutationFn: addReminder,
  });
};

export const useUpdateReminder = () => {
  return useMutation({
    mutationFn: ({
      id,
      remindAt,
      title,
      body,
    }: {
      id: number;
      remindAt?: string;
      title?: string;
      body?: string;
    }) => updateReminder(id, { remindAt: remindAt, title: title, body: body }),
  });
};

export const useDeleteReminder = () => {
  return useMutation({
    mutationFn: deleteReminder,
  });
};
