import * as z from "zod";

export const AddReminderFormSchema = z.object({
  dor: z.date({
    required_error: "A date for the reminder is required.",
  }),
  reminder: z.string({
    required_error: "A reminder message is required.",
  }),
});

export type AddReminderFormType = z.infer<typeof AddReminderFormSchema>;

export const ReminderSchemeUpdate = z.object({
  remindAt: z.string().optional(),
  title: z.string().optional(),
  body: z.string().optional(),
});

export const AddReminderScheme = z.object({
  remindAt: z.string(),
  title: z.string().optional(),
  body: z.string().optional(),
});

export type AddReminderType = z.infer<typeof AddReminderScheme>;

export interface AddReminderProps {
  onAdd: (data: AddReminderFormType) => void;
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
  onAdd: (data: AddReminderFormType) => void;
  onEdit: (id: number, text: string) => void;
  onDelete: (id: number) => void;
}
