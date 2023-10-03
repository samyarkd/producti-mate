import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, getTimeRemaining } from "@/lib/utils";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Route } from "@tanstack/react-router";
import { useMainButton, useThemeParams } from "@twa.js/sdk-react";
import { useEffect, useState } from "react";
import featureLayoutRoute from "../feature-layout";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import "react-clock/dist/Clock.css";
import "react-time-picker/dist/TimePicker.css";

const FormSchema = z.object({
  dor: z.date({
    required_error: "A date for the reminder is required.",
  }),
  reminder: z.string({
    required_error: "A reminder message is required.",
  }),
});

interface AddReminderProps {
  onAdd: (data: z.infer<typeof FormSchema>) => void;
}

const AddReminder = (props: AddReminderProps) => {
  const [dateOpen, setDateOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reminder: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    props.onAdd(data);
    form.reset();
  }

  return (
    <Popover modal>
      <PopoverTrigger>Add a New Reminder</PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 w-full"
          >
            <FormField
              control={form.control}
              name="dor"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Remind me at</FormLabel>
                  <Popover open={dateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          onClick={() => setDateOpen(true)}
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setDateOpen(false);
                        }}
                        disabled={(date) => date <= new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    className="appearance-none"
                    defaultValue={"09:00"}
                    onChange={(time) => {
                      // handle if the time i cleared
                      if (!time.target.value) {
                        field.onChange(null);
                        return;
                      }
                      const [hours, minutes] = time.target.value.split(":");
                      const date = field.value || new Date();
                      date.setHours(parseInt(hours));
                      date.setMinutes(parseInt(minutes));
                      field.onChange(date);
                    }}
                  />
                  <FormDescription>
                    You will get the reminder message in this date
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              rules={{ required: true }}
              control={form.control}
              name="reminder"
              render={({ field }) => (
                <FormItem aria-required className="flex flex-col">
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    required
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-4" type="submit">
              Create
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

interface RemainingTime {
  date: string;
}

function RemainingTime(params: RemainingTime) {
  const [remainingTime, setRemainingTime] = useState(
    getTimeRemaining(params.date),
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(getTimeRemaining(params.date));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (remainingTime.days !== 0) {
    return <span className="text-sm text-gray-400">{remainingTime.days}d</span>;
  }

  if (remainingTime.hours !== 0) {
    return (
      <span className="text-sm text-gray-400">{remainingTime.hours}h</span>
    );
  }

  if (remainingTime.minutes !== 0) {
    return (
      <span className="text-sm text-gray-400">{remainingTime.minutes}m</span>
    );
  }

  if (remainingTime.seconds !== 0) {
    return (
      <span className="text-sm text-gray-400">{remainingTime.seconds}s</span>
    );
  }
}

type Item = {
  id: number;
  dor: string;
  reminderText: string;
};

interface ReminderTable {
  items: Item[];
  onEdit: (id: number, text: string) => void;
  onDelete: (id: number) => void;
}

function RemindersTable(props: ReminderTable) {
  const [editing, setEditing] = useState<number | null>(null);
  const mainButton = useMainButton();
  const themeParams = useThemeParams();

  useEffect(() => {
    if (editing) {
      mainButton
        .enable()
        .setText("Save")
        .setBackgroundColor(themeParams?.buttonColor || "#000000")
        .show();
    } else {
      mainButton.disable().hide();
    }

    mainButton.on("click", () => {
      if (editing) {
        setEditing(null);
      }
    });
  }, [editing]);

  // Render the item based on the editing mode
  return (
    <Table>
      <TableCaption>
        You will be notified by a telegram message from the bot
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="ps-3">Reminder</TableHead>
          <TableHead>In</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.items.map((item) => (
          <TableRow>
            <TableCell className={cn("ps-3 w-full")}>
              {editing === item.id ? (
                <form className="flex w-full items-center space-x-2">
                  <Input
                    type="text"
                    value={item.reminderText}
                    onChange={(e) => props.onEdit(item.id, e.target.value)}
                    autoFocus
                    onBlur={() => setEditing(null)}
                  />
                </form>
              ) : (
                item.reminderText
              )}
            </TableCell>
            <TableCell>
              <RemainingTime date={item.dor} />
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <DotsHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => setEditing(item.id)}
                    className={cn({
                      "font-medium": editing === item.id,
                    })}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => props.onDelete(item.id)}
                  >
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface ReminderList {
  items: Item[];
  onAdd: (data: z.infer<typeof FormSchema>) => void;
  onEdit: (id: number, text: string) => void;
  onDelete: (id: number) => void;
}

function Reminders(props: ReminderList) {
  return (
    <div className="flex flex-col gap-4">
      <RemindersTable
        items={props.items}
        onEdit={props.onEdit}
        onDelete={props.onDelete}
      />

      <AddReminder onAdd={props.onAdd} />
    </div>
  );
}
function Reminder() {
  const mainButton = useMainButton();
  const [reminders, setReminders] = useState<Item[]>([
    {
      id: 1,
      dor: new Date().toString(),
      reminderText: "helllo",
    },
  ]);

  // if the date in the local storage is not today, clear the list
  function setItems(items: Item[]) {
    setReminders(items);
  }

  // A function to generate a unique id for each item
  function generateId() {
    return Math.floor(Math.random() * 1000000);
  }

  // A function to handle the submission of a new item
  function handleAdd(data: z.infer<typeof FormSchema>) {
    setItems([
      ...reminders,
      {
        id: generateId(),
        dor: data.dor.toString(),
        reminderText: data.reminder,
      },
    ]);
  }

  // A function to handle the edit of the text of an item
  function handleEdit(id: number, text: string) {
    setItems(
      reminders.map((item) => (item.id === id ? { ...item, text } : item)),
    );
  }

  // A function to handle the delete of an item
  function handleDelete(id: number) {
    setItems(reminders.filter((item) => item.id !== id));
  }

  useEffect(() => {
    return () => {
      mainButton.disable().hide();
    };
  }, []);

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
