import { Route } from "@tanstack/react-router"
import featureLayoutRoute from "../feature-layout"

const Pomodoro = () => {

  return (
    <div className="grid grid-cols-2 items-center justify-center">
      Pomodoro
    </div>
  )
}

const pomodoroRoute = new Route({
  getParentRoute: () => featureLayoutRoute,
  path: '/pomodoro',
  component: Pomodoro,
})

export default pomodoroRoute
