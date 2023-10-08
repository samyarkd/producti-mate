import * as z from "zod";

export const AddReminderFormSchema = z.object({
  dor: z.date({
    required_error: "A date for the reminder is required.",
  }),
  reminder: z.string({
    required_error: "A reminder message is required.",
  }),
});

export interface AddReminderProps {
  onAdd: (data: z.infer<typeof AddReminderFormSchema>) => void;
}

export interface RemainingTime {
  date: string;
}

export type ReminderItem = {
  id: number;
  dor: string;
  reminderText: string;
};

export interface ReminderTable {
  items: ReminderItem[];
  onEdit: (id: number, text: string) => void;
  onDelete: (id: number) => void;
}

export interface ReminderList {
  items: ReminderItem[];
  onAdd: (data: z.infer<typeof AddReminderFormSchema>) => void;
  onEdit: (id: number, text: string) => void;
  onDelete: (id: number) => void;
}
