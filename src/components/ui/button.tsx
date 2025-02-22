import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../libs/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center  whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-green-500 text-white font-semibold hover:bg-green-600 sm:hover:bg-green-700",
        destructive: "bg-red-500 text-white font-semibold hover:bg-red-600 sm:hover:bg-red-700",
        outline: "border border-blue-500 bg-transparent text-blue-500 hover:bg-blue-50 sm:hover:bg-blue-100",
        secondary: "bg-blue-500 text-white font-semibold hover:bg-blue-600 sm:hover:bg-blue-700",
        ghost: "hover:bg-gray-100 hover:text-gray-900 sm:hover:bg-gray-200",
        link: "text-blue-500 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm sm:text-base sm:px-6 sm:py-3",
        sm: "h-9 px-3 text-xs sm:text-sm sm:px-4",
        lg: "h-11 px-8 text-lg sm:text-xl sm:px-10",
        icon: "h-10 w-10 sm:h-12 sm:w-12", 
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };