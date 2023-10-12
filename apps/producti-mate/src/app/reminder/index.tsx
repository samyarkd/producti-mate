import { Route } from "@tanstack/react-router";
import { useMainButton } from "@twa.js/sdk-react";
import { useEffect, useState } from "react";
import featureLayoutRoute from "../feature-layout";

import * as z from "zod";

import Reminders from "@/components/reminders";
import {
  useAddReminder,
  useDeleteReminder,
  useReminders,
  useUpdateReminder,
} from "@/hooks/queries/reminders";
import { AddReminderFormSchema, ReminderItem } from "@producti-mate/shared";

// The main component of the reminder page
function Reminder() {
  const mainButton = useMainButton();
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const remindersQuery = useReminders();
  const addReminder = useAddReminder();
  const editReminder = useUpdateReminder();
  const deleteReminder = useDeleteReminder();

  // if the date in the local storage is not today, clear the list
  function setItems(items: ReminderItem[]) {
    setReminders(items);
  }

  // A function to handle the submission of a new item
  async function handleAdd(data: z.infer<typeof AddReminderFormSchema>) {
    const res = await addReminder.mutateAsync({
      title: data.reminder,
      remindAt: data.dor.toString(),
    });

    setItems([
      ...reminders,
      {
        id: res.data.id,
        dor: res.data.remindAt.toString(),
        reminderText: res.data.title || "",
      },
    ]);
  }

  // A function to handle the edit of the text of an item
  function handleEdit(id: number, text: string) {
    editReminder.mutate({
      id,
      title: text,
    });

    setItems(
      reminders.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            reminderText: text || "",
          };
        }
        return item;
      }),
    );
  }

  // A function to handle the delete of an item
  function handleDelete(id: number) {
    deleteReminder.mutateAsync(id);

    setItems(reminders.filter((item) => item.id !== id));
  }

  useEffect(() => {
    if (remindersQuery.data) {
      setItems(
        remindersQuery.data.data.map((reminder) => ({
          id: reminder.id,
          dor: reminder.remindAt.toString(),
          reminderText: reminder.title || "",
        })),
      );
    }

    return () => {
      mainButton.disable().hide();
    };
  }, [remindersQuery.data]);

  return (
    <div className="app">
      <Reminders
        items={reminders}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

const reminderRoute = new Route({
  getParentRoute: () => featureLayoutRoute,
  path: "/reminder",
  component: Reminder,
});

export default reminderRoute;
