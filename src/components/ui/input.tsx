import * as React from "react";

import { cn } from "../../libs/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
      type={type}
      placeholder="xxx"
      className={cn(
        "flex h-10 w-full rounded-xlborder-0 px-4 py-2 text-lg text-right placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
    
    );
  },
);
Input.displayName = "Input";

export { Input };
