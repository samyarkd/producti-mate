import { Button } from "@/components/ui/button";
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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddGoal from "./add-goal";
import { GoalTable, GoalsListT } from "./goals-types";

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
