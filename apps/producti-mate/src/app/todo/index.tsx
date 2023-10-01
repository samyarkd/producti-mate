import { Route } from "@tanstack/react-router"
import featureLayoutRoute from "../feature-layout"

function Todo() {
  return (
    <div>Todo</div>
  )
}

const todoRoute = new Route({
  getParentRoute: () => featureLayoutRoute,
  path: '/todo',
  component: Todo,
})

export default todoRoute
