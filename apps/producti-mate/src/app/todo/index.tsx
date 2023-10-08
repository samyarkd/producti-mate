/**
 * This is the main component of the Todo List.
 */

import { TodoList } from "@/components/todo-list/todo-table";
import { TodoItem } from "@/components/todo-list/todo-types";
import { todoListAtom } from "@/lib/atoms";
import { Route } from "@tanstack/react-router";
import { useMainButton } from "@twa.js/sdk-react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import featureLayoutRoute from "../feature-layout";

// The main component that holds the state and logic of the app
function TodoListApp() {
  const mainButton = useMainButton();
  // A state variable to store the todo items as an array of objects
  const [todos, setTodos] = useAtom(todoListAtom);

  // A state variable to store the input text for adding a new item
  const [input, setInput] = useState("");

  // if the date in the local storage is not today, clear the list
  function setItems(items: TodoItem[]) {
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
