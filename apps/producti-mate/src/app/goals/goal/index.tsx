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
import { Route, useParams, useRouter } from "@tanstack/react-router";
import { useMainButton } from "@twa.js/sdk-react";
import { useEffect, useState } from "react";

import featureLayoutRoute from "@/app/feature-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useDeleteGoal,
  useFinishDailyGoal,
  useGoal,
  useSendInviteLink,
  useUpdateGoal,
} from "@/hooks/queries/goals";
import { zodResolver } from "@hookform/resolvers/zod";
import { Goal, GoalUser, User } from "@prisma/client";
import "react-clock/dist/Clock.css";
import { useForm } from "react-hook-form";
import "react-time-picker/dist/TimePicker.css";
import * as z from "zod";

const ShareGoal = (props: { goal?: Goal }) => {
  const invitation = useSendInviteLink();

  return (
    <Popover>
      <PopoverTrigger
        onClick={() => {
          props?.goal?.id && invitation.mutate(props?.goal?.id);
        }}
      >
        Share the goal with a friend
      </PopoverTrigger>
      <PopoverContent>
        We have send you a message in the telegram bot to share this goal with
        your friends in Telegram.
      </PopoverContent>
    </Popover>
  );
};

type Item = {
  id: number;
  pfp?: string;
  name: string;
  exp: number;
};

interface GoalTable {
  items: Item[];
}

function LeaderboardTable(props: GoalTable) {
  // Render the item based on the editing mode
  return (
    <Table>
      <TableCaption>You can also tap the goal to open it</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="ps-3">PFP</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Exp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props?.items?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className={cn("ps-3")}>
              <Avatar>
                <AvatarImage src={item?.pfp || ""} />
                <AvatarFallback>{item?.name && item?.name[0]}</AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell className="w-full">{item.name}</TableCell>
            <TableCell>{item.exp}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface GoalsListT {
  items: Item[];
  goal?: Goal;
}

function Leaderboard(props: GoalsListT) {
  return (
    <div className="flex flex-col gap-4">
      <LeaderboardTable items={props.items} />

      <ShareGoal goal={props.goal} />
    </div>
  );
}

interface EditGoalProps {
  goalUser?: GoalUser & {
    goal: Goal & { users: (GoalUser & { user: User })[] };
  };
}

const EditFormScheme = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

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

interface GoalT {
  goalUser?: GoalUser & {
    goal: Goal & { users: (GoalUser & { user: User })[] };
  };
}

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

function Goals() {
  const mainButton = useMainButton();
  const [users, setUsers] = useState<Item[]>([]);
  const params = useParams({ from: "/feature-layout/goals/$goalId" });
  const getGoal = useGoal(parseInt(params.goalId));
  const finishDailyTask = useFinishDailyGoal();

  // if the date in the local storage is not today, clear the list
  function setItems(items: Item[]) {
    setUsers(items);
  }

  useEffect(() => {
    if (getGoal.data) {
      setItems(
        getGoal?.data?.data?.goal.users?.map((goalUser) => ({
          id: goalUser.id,
          pfp: goalUser.user.pfp || "",
          name: goalUser.user.name || "",
          exp: goalUser.exp || 0,
        })),
      );
    }

    if (getGoal.data?.data?.lastFinish) {
      if (
        new Date(getGoal.data?.data?.lastFinish).toDateString() !==
        new Date().toDateString()
      ) {
        mainButton.setText("Finish Daily Goal For Today").enable().show();
      }
    } else {
      mainButton.setText("Finish Daily Goal For Today").enable().show();
    }

    mainButton.on("click", () => {
      if (getGoal?.data?.data?.id) {
        finishDailyTask.mutateAsync(getGoal.data?.data.id);
      }

      mainButton.disable().hide();
    });

    return () => {
      mainButton.disable().hide();
    };
  }, [getGoal.data]);

  return (
    <div className="px-4 py-2 w-full">
      <Tabs className="w-full" defaultValue="leaderboard">
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="leaderboard">
            Leaderboard
          </TabsTrigger>
          <TabsTrigger className="w-full" value="goal">
            Goal
          </TabsTrigger>
        </TabsList>
        <TabsContent value="leaderboard">
          <Leaderboard goal={getGoal.data?.data.goal} items={users} />
        </TabsContent>
        <TabsContent value="goal">
          <GoalData goalUser={getGoal.data?.data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const goalRoute = new Route({
  getParentRoute: () => featureLayoutRoute,
  path: "/goals/$goalId",
  component: Goals,
});

export default goalRoute;
