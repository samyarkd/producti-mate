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
import { Link, Route } from "@tanstack/react-router";
import { useMainButton } from "@twa.js/sdk-react";
import { useEffect, useState } from "react";
import featureLayoutRoute from "../feature-layout";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useAddGoal, useGoals } from "@/hooks/queries/goals";
import { GoalUser, User } from "@prisma/client";
import "react-clock/dist/Clock.css";
import "react-time-picker/dist/TimePicker.css";
import goalRoute from "./goal";

const FormSchema = z.object({
  title: z.string({
    required_error: "A title for the goal is required.",
  }),
  description: z.string().optional(),
});

interface AddGoalProps {
  onAdd: (data: z.infer<typeof FormSchema>) => void;
}

const AddGoal = (props: AddGoalProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    props.onAdd(data);
    form.reset();
    setOpen(false);
  }

  return (
    <Popover modal open={open} onOpenChange={(open) => setOpen(open)}>
      <PopoverTrigger
        onClick={() => {
          setOpen(true);
        }}
      >
        Add a New Goal
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
      </PopoverContent>
    </Popover>
  );
};

type Item = {
  id: number;
  title: string;
  exp: number;
  users: (GoalUser & { user: User })[];
};

interface GoalTable {
  items: Item[];
}

function GoalsTable(props: GoalTable) {
  // Render the item based on the editing mode
  return (
    <Table>
      <TableCaption>You can also tap the goal to open it</TableCaption>
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

interface GoalsListT {
  items: Item[];
  onAdd: (data: z.infer<typeof FormSchema>) => void;
}

function GoalsList(props: GoalsListT) {
  return (
    <div className="flex flex-col gap-4">
      <GoalsTable items={props.items} />

      <AddGoal onAdd={props.onAdd} />
    </div>
  );
}
function Goals() {
  const mainButton = useMainButton();
  const [goals, setGoals] = useState<Item[]>([]);

  const getGoals = useGoals();
  const addGoal = useAddGoal();

  // if the date in the local storage is not today, clear the list
  function setItems(items: Item[]) {
    setGoals(items);
  }

  // A function to handle the submission of a new item
  async function handleAdd(data: z.infer<typeof FormSchema>) {
    const res = await addGoal.mutateAsync(data);

    setItems([
      ...goals,
      {
        id: res.data.id,
        title: res.data.goal.title || "",
        exp: res.data.exp || 0,
        users: res.data.goal.users,
      },
    ]);
  }

  useEffect(() => {
    if (getGoals.data) {
      setItems(
        getGoals.data.data.map((goalUser) => ({
          id: goalUser.id,
          title: goalUser.goal.title || "",
          exp: goalUser.exp || 0,
          users: goalUser.goal.users,
        })),
      );
    }

    return () => {
      mainButton.disable().hide();
    };
  }, [getGoals.data]);

  return (
    <div className="app">
      <GoalsList items={goals} onAdd={handleAdd} />
    </div>
  );
}

const goalsRoute = new Route({
  getParentRoute: () => featureLayoutRoute,
  path: "/goals",
  component: Goals,
});

const GoalAndGoals = goalsRoute.addChildren([goalRoute]);

export default GoalAndGoals;
