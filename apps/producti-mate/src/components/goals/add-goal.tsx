import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AddGoalProps, AddGoalScheme } from "@producti-mate/shared";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Switch } from "../ui/switch";

const AddGoal = (props: AddGoalProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof AddGoalScheme>>({
    resolver: zodResolver(AddGoalScheme),
    defaultValues: {
      title: "",
      description: "",
      isPrivate: true,
    },
  });

  function onSubmit(data: z.infer<typeof AddGoalScheme>) {
    props.onAdd(data);
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} modal onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger
        onClick={() => {
          setOpen(true);
        }}
      >
        Add a New Goal
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Goal</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 w-full"
          >
            <FormField
              control={form.control}
              name="title"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Title</FormLabel>
                  <Input
                    required
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              rules={{ required: true }}
              control={form.control}
              name="description"
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
            <FormField
              control={form.control}
              name="isPrivate"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Is Private</FormLabel>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-4">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoal;
