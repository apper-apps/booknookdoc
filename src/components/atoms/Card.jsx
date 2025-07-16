import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  variant = "default",
  padding = "md",
  children,
  ...props 
}, ref) => {
  const baseStyles = "rounded-lg transition-all duration-200 bg-surface border border-primary/10";
  
  const variants = {
    default: "shadow-md hover:shadow-lg",
    elevated: "shadow-lg hover:shadow-xl",
    interactive: "shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer",
    flat: "shadow-none hover:shadow-md",
  };
  
  const paddings = {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };
  
  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;