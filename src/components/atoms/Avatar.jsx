import { cn } from "@/utils/cn";

const Avatar = ({ 
  src, 
  alt, 
  size = "md", 
  className,
  online = false,
  ...props 
}) => {
  const baseStyles = "relative rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden";
  
  const sizes = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-20 h-20",
  };
  
  const onlineIndicatorSizes = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-3.5 h-3.5",
    "2xl": "w-4 h-4",
  };
  
  return (
    <div className={cn(baseStyles, sizes[size], className)} {...props}>
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-serif font-semibold">
          {alt?.charAt(0)?.toUpperCase() || "?"}
        </div>
      )}
      {online && (
        <div className={cn(
          "absolute -bottom-0.5 -right-0.5 bg-success border-2 border-white rounded-full",
          onlineIndicatorSizes[size]
        )} />
      )}
    </div>
  );
};

export default Avatar;