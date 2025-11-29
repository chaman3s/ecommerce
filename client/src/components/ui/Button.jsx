import React from "react";
import { cn } from "../../lib/utils"
// Button styles
const buttonStyles = {
  default: "bg-blue-600 text-white border border-blue-700",
  destructive: "bg-red-600 text-white border border-red-700",
  outline: "border border-gray-400 text-gray-800",
  secondary: "bg-gray-200 text-gray-900 border border-gray-300",
  ghost: "border border-transparent",
};

// Sizes
const sizeStyles = {
  default: "px-4 py-2 text-sm",
  sm: "px-3 py-1 text-xs",
  lg: "px-6 py-3 text-base",
  icon: "h-9 w-9 flex items-center justify-center",
};

export function Button({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md disabled:opacity-50 disabled:pointer-events-none",
        buttonStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}