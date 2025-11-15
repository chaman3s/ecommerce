import * as React from "react"
import { cn } from "../../lib/utils"

export function Card({ className, children }) {
  return (
    <div className={cn("rounded-xl border bg-white shadow-sm", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return (
    <div className={cn("p-6 flex flex-col gap-1", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }) {
  return (
    <h2 className={cn("text-2xl font-semibold", className)}>
      {children}
    </h2>
  );
}

export function CardDescription({ className, children }) {
  return (
    <p className={cn("text-sm text-gray-500", className)}>
      {children}
    </p>
  );
}

export function CardContent({ className, children }) {
  return (
    <div className={cn("p-6 pt-0", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children }) {
  return (
    <div className={cn("p-6 pt-0 flex items-center", className)}>
      {children}
    </div>
  );
}
