import React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent = DropdownMenuPrimitive.Content;
export const DropdownMenuItem = ({ children, className, ...props }) => (
  <DropdownMenuPrimitive.Item
    className={cn(
      "flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer outline-none focus:bg-accent",
      className
    )}
    {...props}
  >
    {children}
  </DropdownMenuPrimitive.Item>
);
export const DropdownMenuCheckboxItem = ({ children, checked, ...props }) => (
  <DropdownMenuPrimitive.CheckboxItem checked={checked} {...props} className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer">
    <DropdownMenuPrimitive.ItemIndicator>
      <Check className="w-4 h-4" />
    </DropdownMenuPrimitive.ItemIndicator>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
);
export const DropdownMenuLabel = ({ children, className }) => (
  <DropdownMenuPrimitive.Label className={cn("px-2 py-1 text-sm font-semibold", className)}>
    {children}
  </DropdownMenuPrimitive.Label>
);
export const DropdownMenuSeparator = (props) => (
  <DropdownMenuPrimitive.Separator className="my-1 h-px bg-muted" {...props} />
);
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuSubTrigger = ({ children, className, ...props }) => (
  <DropdownMenuPrimitive.SubTrigger className={cn("flex items-center justify-between px-2 py-1 text-sm cursor-pointer", className)} {...props}>
    {children}
    <ChevronRight className="w-4 h-4" />
  </DropdownMenuPrimitive.SubTrigger>
);
export const DropdownMenuSubContent = DropdownMenuPrimitive.SubContent;
