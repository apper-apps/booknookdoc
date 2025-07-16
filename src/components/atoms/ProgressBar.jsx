import { cn } from "@/utils/cn";

const ProgressBar = ({ 
  progress = 0, 
  size = "md", 
  color = "primary",
  label,
  className,
  ...props 
}) => {
  const baseStyles = "w-full bg-primary/10 rounded-full overflow-hidden";
  
  const sizes = {
    xs: "h-1",
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
    xl: "h-6",
  };
  
  const colors = {
    primary: "bg-gradient-to-r from-primary to-secondary",
    accent: "bg-gradient-to-r from-accent to-pink-500",
    success: "bg-gradient-to-r from-success to-green-400",
    warning: "bg-gradient-to-r from-warning to-yellow-400",
    error: "bg-gradient-to-r from-error to-red-400",
  };
  
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {label && (
        <div className="flex justify-between items-center text-sm text-primary/70">
          <span>{label}</span>
          <span>{clampedProgress}%</span>
        </div>
      )}
      <div className={cn(baseStyles, sizes[size])}>
        <div 
          className={cn(
            "h-full transition-all duration-500 ease-out",
            colors[color]
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;