import { rootRoute } from "@/components/router"
import { Outlet, Route, useRouter } from "@tanstack/react-router"
import { useBackButton, useWebApp } from "@twa.js/sdk-react"
import { useEffect } from "react"

export function FeatureLayout() {
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


  return <Outlet />
}

export const featureLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  component: FeatureLayout,
  id: 'feature-layout',
})

export default featureLayoutRoute
