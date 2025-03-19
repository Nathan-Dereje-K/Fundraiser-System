import React from "react";
import { cn } from "../../lib/utils";

const Button = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        {
          "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500":
            variant === "primary",
          "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500":
            variant === "secondary",
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500":
            variant === "danger",
          "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500":
            variant === "success",
          "border border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500":
            variant === "outline",
          "h-8 px-3 text-sm": size === "sm",
          "h-10 px-4": size === "md",
          "h-12 px-6 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
