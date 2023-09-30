import { ReactNode } from "react"

function Item({ children }: { children: ReactNode }) {
  return (
    <div className="text-center flex items-center justify-center">{children}</div>
  )
}

export default Item
