import React, { useState } from "react";
import { cn } from "@/utils/cn";

const Avatar = ({ 
  src, 
  alt = "User avatar", 
  size = "md", 
  className = "",
  online = false,
  ...props 
}) => {
const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const baseStyles = "flex items-center justify-center rounded-full bg-surface ring-2 ring-primary/10 overflow-hidden relative shrink-0";
  
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
      {src && !imageError ? (
        <>
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover"
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
            onLoad={() => {
              setImageLoading(false);
            }}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
          {imageLoading && (
            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-serif font-semibold">
              <div className="animate-pulse">...</div>
            </div>
          )}
        </>
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