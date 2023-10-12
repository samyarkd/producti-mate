import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
import { AddReminderFormSchema, AddReminderProps } from "@producti-mate/shared";
import "react-clock/dist/Clock.css";
import "react-time-picker/dist/TimePicker.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const AddReminder = (props: AddReminderProps) => {
  const [dateOpen, setDateOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof AddReminderFormSchema>>({
    resolver: zodResolver(AddReminderFormSchema),
    defaultValues: {
      reminder: "",
    },
  });

  function onSubmit(data: z.infer<typeof AddReminderFormSchema>) {
    props.onAdd(data);
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog modal open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger
        onClick={() => {
          setOpen(true);
        }}
      >
        Add a New Reminder
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Reminder</DialogTitle>
        </DialogHeader>
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
                          onClick={() => {
                            setDateOpen(true);
                          }}
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
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    className="appearance-none"
                    defaultValue={format(new Date(), "HH:mm")}
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
                    // i want the time to be invalid if it's before now
                    // min={format(new Date(), "HH:mm")}
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
      </DialogContent>
    </Dialog>
  );
};

export default AddReminder;
