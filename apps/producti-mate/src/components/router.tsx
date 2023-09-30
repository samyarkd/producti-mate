import { RootRoute, Router } from "@tanstack/react-router"
import indexPage from "../app"
import App from "../app/app"
import pomodoroPage from "../app/pomodoro/page"

export const rootRoute = new RootRoute({
  component: App,
})

// Create the route tree using your routes
export const routeTree = rootRoute.addChildren([indexPage, pomodoroPage])

// Create the router using your route tree
export const router = new Router({ routeTree })
