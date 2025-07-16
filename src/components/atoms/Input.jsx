import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-4 py-3 rounded-lg border-2 bg-surface text-primary placeholder-primary/50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/10";
  
  const variants = {
    default: "border-primary/30 focus:border-primary",
    error: "border-error focus:border-error focus:ring-error/10",
  };
  
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        baseStyles,
        error ? variants.error : variants.default,
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;