import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Header = ({ className, ...props }) => {
  const location = useLocation();
  const [notifications] = useState(3);
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Home";
      case "/clubs":
        return "Book Clubs";
      case "/books":
        return "Discover Books";
      case "/lists":
        return "My Library";
      case "/profile":
        return "Profile";
      default:
        return "BookNook";
    }
  };
  
  return (
    <header className={cn(
      "sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-primary/10",
      className
    )} {...props}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-md">
              <ApperIcon name="BookOpen" size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-primary text-lg">
                {getPageTitle()}
              </h1>
              {location.pathname === "/" && (
                <p className="text-primary/60 text-xs">
                  Welcome back, reader!
                </p>
              )}
            </div>
          </motion.div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2"
          >
            <ApperIcon name="Bell" size={20} />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>
          
          <Avatar
            src="/api/placeholder/32/32"
            alt="Profile"
            size="sm"
            online={true}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;