import { Route } from "@tanstack/react-router"
import featureLayoutRoute from "../feature-layout"

function Goals() {
  return (
    <div>Goals</div>
  )
}

const goalsRoute = new Route({
  getParentRoute: () => featureLayoutRoute,
  path: '/goals',
  component: Goals,
})

export default goalsRoute
