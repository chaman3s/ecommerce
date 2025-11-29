import { cn } from "../../lib/utils"
import React from "react";


const Input = React.forwardRef((props, ref) => {
  const { className, type, ...rest } = props;

  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border px-3 py-2 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...rest}
    />
  );
});

export { Input };
