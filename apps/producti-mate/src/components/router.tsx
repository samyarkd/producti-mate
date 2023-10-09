import indexRoute from "@/app";
import NotFoundRoute from "@/app/404";
import App from "@/app/app";
import featureLayoutRoute from "@/app/feature-layout";
import goalsRoute from "@/app/goals";
import JoinGoalsRoute from "@/app/join-gaols";
import pomodoroRoute from "@/app/pomodoro";
import reminderRoute from "@/app/reminder";
import todoRoute from "@/app/todo";
import { RootRoute, Router } from "@tanstack/react-router";

export const rootRoute = new RootRoute({
  component: App,
});

// Create the route tree using your routes
export const routeTree = rootRoute.addChildren([
  featureLayoutRoute,
  indexRoute,
  pomodoroRoute,
  todoRoute,
  reminderRoute,
  goalsRoute,
  NotFoundRoute,
  JoinGoalsRoute,
]);

// Create the router using your route tree
export const router = new Router({ routeTree });
