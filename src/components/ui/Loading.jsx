import { cn } from "@/utils/cn";

const Loading = ({ 
  variant = "default", 
  className,
  ...props 
}) => {
  const variants = {
    default: (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-surface rounded-lg p-4 shadow-sm">
            <div className="flex gap-4">
              <div className="w-16 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-md animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded animate-pulse" />
                <div className="h-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded w-3/4 animate-pulse" />
                <div className="h-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    cards: (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface rounded-lg p-4 shadow-sm">
            <div className="w-full h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg animate-pulse mb-3" />
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded animate-pulse" />
              <div className="h-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded w-3/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    ),
    list: (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-surface rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full animate-pulse" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded animate-pulse" />
                <div className="h-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded w-2/3 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  };
  
  return (
    <div className={cn("w-full", className)} {...props}>
      {variants[variant]}
    </div>
  );
};

export default Loading;