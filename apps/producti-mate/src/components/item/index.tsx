import { cn } from "@/lib/utils";
import { ReactNode } from "react";

function Item({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("text-center flex items-center justify-center", className)}
    >
      {children}
    </div>
  );
}

export default Item;
