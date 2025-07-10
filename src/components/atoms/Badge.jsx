import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  variant = "default", 
  className, 
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    urgent: "bg-error/10 text-error animate-pulse",
    high: "bg-accent/10 text-accent",
    medium: "bg-info/10 text-info",
    low: "bg-gray-100 text-gray-600"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;