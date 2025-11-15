import React from "react";
import { cn } from "../../lib/utils"



const badgeStyles = {
  default: "bg-blue-600 text-white border border-transparent",
  secondary: "bg-gray-200 text-gray-800 border border-transparent",
  destructive: "bg-red-600 text-white border border-transparent",
  outline: "border border-gray-400 text-gray-700 bg-transparent",
};

function Badge({ variant = "default", className, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold whitespace-nowrap",
        badgeStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
