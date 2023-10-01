import { rootRoute } from "@/components/router"
import { Link, Route } from "@tanstack/react-router"

function NotFoundPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-xl">404</div>
      <div className="text-lg">Page not found</div>
      <Link to="/" >Go back to home</Link>
    </div>
  )
}

const NotFoundRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
})

export default NotFoundRoute
