import React from "react";
import { cn } from "../../lib/utils";

const Badge = ({ variant = "default", children, className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-blue-100 text-blue-800": variant === "default",
          "bg-gray-100 text-gray-800": variant === "secondary",
          "bg-green-100 text-green-800": variant === "success",
          "bg-red-100 text-red-800": variant === "danger",
          "bg-yellow-100 text-yellow-800": variant === "warning",
        },
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
