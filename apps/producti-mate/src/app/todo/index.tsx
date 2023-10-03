import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { todoListAtom } from "@/lib/atoms";
import { cn } from "@/lib/utils";
import { DotsHorizontalIcon, DropdownMenuIcon } from "@radix-ui/react-icons";
import { Route } from "@tanstack/react-router";
import { useMainButton, useThemeParams } from "@twa.js/sdk-react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import featureLayoutRoute from "../feature-layout";

type Item = {
  id: number;
  text: string;
  done: boolean;
};

interface TodoTable {
  items: Item[];
  filter: string;
  onToggle: (id: number) => void;
  onEdit: (id: number, text: string) => void;
  onDelete: (id: number) => void;
  setFilter: (filter: string) => void;
}

// A custom component for each todo item
function TodoTable(props: TodoTable) {
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
      <TableCaption>All notes will be removed after 24h</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="ps-3">Description</TableHead>
          <TableHead>
            <div className="flex justify-center me-4 items-center">
              <div className="w-0 relative right-14">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <DropdownMenuIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => props.setFilter("all")}
                      className={cn({
                        "font-medium": props.filter === "all",
                      })}
                    >
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => props.setFilter("done")}
                      className={cn({
                        "font-medium": props.filter === "done",
                      })}
                    >
                      Done
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => props.setFilter("not done")}
                      className={cn({
                        "font-medium": props.filter === "not done",
                      })}
                    >
                      Not Done
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <span>Actions</span>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.items
          .filter(
            (item) =>
              props.filter === "all" ||
              (props.filter === "done" && item.done) ||
              (props.filter === "not done" && !item.done),
          )
          .map((item) => (
            <TableRow>
              <TableCell
                className={cn("ps-3 w-full", {
                  "line-through": item.done,
                })}
              >
                {editing === item.id ? (
                  <form className="flex w-full items-center space-x-2">
                    <Input
                      type="text"
                      value={item.text}
                      onChange={(e) => props.onEdit(item.id, e.target.value)}
                      autoFocus
                      onBlur={() => setEditing(null)}
                    />
                  </form>
                ) : (
                  item.text
                )}
              </TableCell>
              <TableCell>
                <div className="flex h-5 items-center space-x-2 text-sm">
                  <Checkbox
                    onClick={() => props.onToggle(item.id)}
                    checked={item.done}
                  />
                  <Separator orientation="vertical" />
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
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

interface TodoList {
  items: Item[];
  input: string;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: (e: React.ChangeEvent<HTMLFormElement>) => void;
  onToggle: (id: number) => void;
  onEdit: (id: number, text: string) => void;
  onDelete: (id: number) => void;
}

// A custom component for the todo list
function TodoList(props: TodoList) {
  // A state variable to store the filter option
  const [filter, setFilter] = useState("all");

  // Render the todo list based on the filter option
  return (
    <div className="flex flex-col gap-4">
      <TodoTable
        items={props.items}
        filter={filter}
        onToggle={props.onToggle}
        onEdit={props.onEdit}
        onDelete={props.onDelete}
        setFilter={setFilter}
      />

      <form
        onSubmit={props.onAdd}
        className="flex px-3 w-full max-w-sm items-center space-x-2"
      >
        <Input
          type="text"
          value={props.input}
          onChange={props.onInput}
          placeholder="Learn about TON..."
        />
        <Button type="submit">Add</Button>
      </form>
    </div>
  );
}

// The main component that holds the state and logic of the app
function TodoListApp() {
  const mainButton = useMainButton();
  // A state variable to store the todo items as an array of objects
  const [todos, setTodos] = useAtom(todoListAtom);

  // A state variable to store the input text for adding a new item
  const [input, setInput] = useState("");

  // if the date in the local storage is not today, clear the list
  function setItems(items: Item[]) {
    setTodos({
      date: new Date().toDateString(),
      todos: items,
    });
  }

  // A function to generate a unique id for each item
  function generateId() {
    return Math.floor(Math.random() * 1000000);
  }

  // A function to handle the change of the input text
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  // A function to handle the submission of a new item
  function handleAdd(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input.trim()) {
      setItems([
        ...todos.todos,
        { id: generateId(), text: input, done: false },
      ]);
      setInput("");
    }
  }

  // A function to handle the toggle of the done status of an item
  function handleToggle(id: number) {
    setItems(
      todos.todos.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
  }

  // A function to handle the edit of the text of an item
  function handleEdit(id: number, text: string) {
    setItems(
      todos.todos.map((item) => (item.id === id ? { ...item, text } : item)),
    );
  }

  // A function to handle the delete of an item
  function handleDelete(id: number) {
    setItems(todos.todos.filter((item) => item.id !== id));
  }

  useEffect(() => {
    if (todos.date !== new Date().toDateString()) {
      setItems([]);
    }

    return () => {
      mainButton.disable().hide();
    };
  }, []);

  // Render the app with the todo list component
  return (
    <div className="app">
      <TodoList
        items={todos.todos}
        input={input}
        onInput={handleInput}
        onAdd={handleAdd}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

const todoRoute = new Route({
  getParentRoute: () => featureLayoutRoute,
  path: "/todo",
  component: TodoListApp,
});

export default todoRoute;
