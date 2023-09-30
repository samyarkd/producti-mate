import { Outlet } from "@tanstack/react-router"
import { useThemeParams, useWebApp } from "@twa.js/sdk-react"
import { useEffect } from "react"

export function App() {
  const webApp = useWebApp()
  const themeParams = useThemeParams()

  // When App is attached to DOM, lets show back button and
  // add "click" event handler, which should close current application.
  useEffect(() => {
    webApp.ready()
  }, [webApp])

  return <main style={{
    backgroundColor: themeParams?.backgroundColor || 'white',
    color: themeParams?.textColor || 'black',
  }} className={'h-screen'}>
    <Outlet />
  </main>
}

export default App
