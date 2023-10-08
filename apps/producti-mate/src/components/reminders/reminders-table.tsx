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
import { useMainButton, useThemeParams } from "@twa.js/sdk-react";
import { useEffect, useState } from "react";

import "react-clock/dist/Clock.css";
import "react-time-picker/dist/TimePicker.css";
import type { RemainingTime, ReminderTable } from "./reminders-types";

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
          <TableRow key={item.id}>
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

/*
  This compoenet is used to show remaining time to the reminder
*/
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

export default RemindersTable;
