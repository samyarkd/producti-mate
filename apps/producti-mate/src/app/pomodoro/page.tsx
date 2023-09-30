import { Route, useRouter } from "@tanstack/react-router"
import { useBackButton, useWebApp } from "@twa.js/sdk-react"
import { useEffect } from "react"
import { rootRoute } from "../../components/router"

const Pomodoro = () => {
  const backButton = useBackButton()
  const webApp = useWebApp()
  const router = useRouter()

  // When App is attached to DOM, lets show back button and
  // add "click" event handler, which should close current application.
  useEffect(() => {
    const listener = () => router.history.back()
    backButton.on('click', listener)
    backButton.show()

    return () => {
      backButton.off('click', listener)
      backButton.hide()
    }
    // We know, that backButton and webApp will never change,
    // but let's follow React rules.
  }, [backButton, webApp])
  return (
    <div className="grid grid-cols-2 items-center justify-center">
      hello
    </div>
  )
}

const pomodoroPage = new Route({
  getParentRoute: () => rootRoute,
  path: '/pomodoro',
  component: Pomodoro,
})

export default pomodoroPage
