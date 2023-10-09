import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  AddGoalFormSchema,
  AddGoalProps,
  GoalTable,
  GoalsListT,
} from "./goals-types";

const AddGoal = (props: AddGoalProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof AddGoalFormSchema>>({
    resolver: zodResolver(AddGoalFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(data: z.infer<typeof AddGoalFormSchema>) {
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
            className="space-y-2 w-full"
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
            <Button className="mt-4" type="submit">
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

function GoalsTable(props: GoalTable) {
  // Render the item based on the editing mode
  return (
    <Table>
      <TableCaption>
        Goals are daily activities right now for example "read everyday"
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="ps-3">Goal</TableHead>
          <TableHead>Users</TableHead>
          <TableHead>Exp</TableHead>
          <TableHead>Open</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className={cn("ps-3 w-full")}>{item.title}</TableCell>
            <TableCell>
              <div className="flex -space-x-4">
                {item.users.slice(0, 5).map((u) => (
                  <Avatar key={u.id}>
                    <AvatarImage src={u?.user?.pfp || ""} />
                    <AvatarFallback>
                      {u?.user?.name && u?.user?.name[0]}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </TableCell>
            <TableCell>{item.exp}</TableCell>
            <TableCell>
              <Link
                to={"/goals/$goalId"}
                params={{
                  goalId: item.id.toString(),
                }}
              >
                <Button variant="secondary" size="sm">
                  Open
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function GoalsList(props: GoalsListT) {
  return (
    <div className="flex flex-col gap-4">
      <GoalsTable items={props.items} />

      <AddGoal onAdd={props.onAdd} />
    </div>
  );
}

export default GoalsList;
