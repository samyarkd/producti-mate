import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EditFormScheme, EditGoalProps, GoalT } from "../goals-types";

import { Button, ButtonWithConfirm } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteGoal, useUpdateGoal } from "@/hooks/queries/goals";
import { zodResolver } from "@hookform/resolvers/zod";
import "react-clock/dist/Clock.css";
import { useForm } from "react-hook-form";
import "react-time-picker/dist/TimePicker.css";
import * as z from "zod";

const EditGoal = (props: EditGoalProps) => {
  const [open, setOpen] = useState(false);
  const updateGoal = useUpdateGoal();

  const form = useForm<z.infer<typeof EditFormScheme>>({
    resolver: zodResolver(EditFormScheme),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(data: z.infer<typeof EditFormScheme>) {
    if (props.goalUser?.goal.id) {
      updateGoal.mutate({
        data,
        id: props.goalUser?.goal.id,
      });
    }
    form.reset();
    setOpen(false);
  }

  useEffect(() => {
    if (props.goalUser?.goal?.description) {
      form.setValue("description", props.goalUser?.goal?.description);
    }

    if (props.goalUser?.goal.title) {
      form.setValue("title", props.goalUser?.goal.title);
    }
  }, [props.goalUser?.goal.title, props.goalUser?.goal.description]);

  return (
    <Popover modal open={open} onOpenChange={(open) => setOpen(open)}>
      <PopoverTrigger
        asChild
        onClick={() => {
          setOpen(true);
        }}
      >
        <Button className="w-full">Edit</Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 w-full"
          >
            <FormField
              control={form.control}
              name="title"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Remind me at</FormLabel>
                  <Input
                    required
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormDescription>
                    You will get the goal message in this date
                  </FormDescription>
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
                  <Textarea value={field.value} onChange={field.onChange} />
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

function GoalData({ goalUser }: GoalT) {
  const deleteGoal = useDeleteGoal();
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">{goalUser?.goal.title}</h1>
        <p>{goalUser?.goal.description}</p>
      </div>
      {goalUser?.userId === goalUser?.goal.userId && (
        <>
          <Separator />
          <div className="grid gap-2 mt-2 grid-cols-2">
            <EditGoal goalUser={goalUser} />
            <ButtonWithConfirm
              onConfirm={() => {
                if (goalUser?.goal.id) {
                  deleteGoal.mutateAsync(goalUser?.goal.id).finally(() => {
                    router.navigate({ to: "/goals" });
                  });
                }
              }}
              className="w-full"
              variant={"destructive"}
            >
              Delete
            </ButtonWithConfirm>
          </div>
        </>
      )}
    </div>
  );
}

export default GoalData;
