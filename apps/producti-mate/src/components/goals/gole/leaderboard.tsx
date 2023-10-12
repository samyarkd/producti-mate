import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSendInviteLink } from "@/hooks/queries/goals";
import { Goal } from "@prisma/client";
import { GoalUserTable, GoalUsersListT } from "@producti-mate/shared";

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

function LeaderboardTable(props: GoalUserTable) {
  // Render the item based on the editing mode
  return (
    <Table>
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

function Leaderboard(props: GoalUsersListT) {
  return (
    <div className="flex flex-col gap-4">
      <LeaderboardTable items={props.items} />

      <ShareGoal goal={props.goal} />
    </div>
  );
}

export default Leaderboard;
