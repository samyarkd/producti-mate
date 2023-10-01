import { Route } from "@tanstack/react-router"
import featureLayoutRoute from "../feature-layout"

function Reminder() {
  return (
    <div>Reminder</div>
  )
}

const reminderRoute = new Route({
  getParentRoute: () => featureLayoutRoute,
  path: '/reminder',
  component: Reminder,
})

export default reminderRoute
