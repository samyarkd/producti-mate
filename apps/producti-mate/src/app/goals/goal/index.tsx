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
import { Route, useParams } from "@tanstack/react-router";
import { useMainButton } from "@twa.js/sdk-react";
import { useEffect, useState } from "react";

import featureLayoutRoute from "@/app/feature-layout";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGoal, useSendInviteLink } from "@/hooks/queries/goals";
import { Goal } from "@prisma/client";
import "react-clock/dist/Clock.css";
import "react-time-picker/dist/TimePicker.css";

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
          <TableHead className="ps-3">Name</TableHead>
          <TableHead>Exp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props?.items?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className={cn("ps-3 w-full")}>{item.name}</TableCell>
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
function Goals() {
  const mainButton = useMainButton();
  const [users, setUsers] = useState<Item[]>([]);
  const params = useParams({ from: "/feature-layout/goals/$goalId" });
  const getGoal = useGoal(parseInt(params.goalId));

  // if the date in the local storage is not today, clear the list
  function setItems(items: Item[]) {
    setUsers(items);
  }

  useEffect(() => {
    if (getGoal.data) {
      setItems(
        getGoal?.data?.data?.goal.users?.map((goalUser) => ({
          id: goalUser.id,
          name: goalUser.user.name || "",
          exp: goalUser.exp || 0,
        })),
      );
    }

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
        <TabsContent value="goal">Change your password here.</TabsContent>
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
