/**
 * 1. GET /reminder
 * 2. GET /reminder/:id
 * 3. POST /reminder/add
 * 4. PUT /reminder/:id
 * 5. DELETE /reminder/:id
 */
import { Reminders } from "@prisma/client";
import { axiosClient } from "./axiosClient";

export const getReminders = async () => {
  return await axiosClient.get<Reminders[]>("/reminders");
};

export const getReminder = async (id: number) => {
  return await axiosClient.get<Reminders>(`/reminders/${id}`);
};

export const addReminder = async (data: {
  remindAt: string;
  title?: string;
  body?: string;
}) => {
  return await axiosClient.post<Reminders>("/reminders/add", data);
};

export const updateReminder = async (
  id: number,
  data: {
    remindAt?: string;
    title?: string;
    body?: string;
  },
) => {
  return await axiosClient.put<Reminders>(`/reminders/${id}`, data);
};

export const deleteReminder = async (id: number) => {
  return await axiosClient.delete<{ message: "reminder deleted" }>(
    `/reminders/${id}`,
  );
};
