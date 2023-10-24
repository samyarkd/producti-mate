import { ReactElement, StrictMode } from "react"
import * as ReactDOM from "react-dom/client"

import { RouterProvider } from "@tanstack/react-router"
import { SDKProvider } from "@twa.js/sdk-react"
import { Loader } from "./components/loader"
import { router } from "./components/router"
import AxiosClient from "./lib/services/axiosClient"

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
)
root.render(
  <StrictMode>
    <SDKProvider>
      <Loader>
        <AxiosClient>
          <RouterProvider router={router} />
        </AxiosClient>
      </Loader>
    </SDKProvider>
  </StrictMode> as ReactElement,
)
