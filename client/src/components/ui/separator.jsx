import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "../../lib/utils";

export function Separator({
  orientation = "horizontal",
  className,
  ...props
}) {
  const isHorizontal = orientation === "horizontal";

  return (
    <SeparatorPrimitive.Root
      orientation={orientation}
      decorative={true}
      className={cn(
        "bg-border shrink-0",
        isHorizontal ? "h-px w-full" : "w-px h-full",
        className
      )}
      {...props}
    />
  );
}
