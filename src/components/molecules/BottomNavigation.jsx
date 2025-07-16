import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BottomNavigation = ({ className, ...props }) => {
const navItems = [
    { to: "/", icon: "Home", label: "Home" },
    { to: "/clubs", icon: "Users", label: "Clubs" },
    { to: "/books", icon: "Search", label: "Discover" },
    { to: "/quizzes", icon: "Brain", label: "Quizzes" },
    { to: "/profile", icon: "User", label: "Profile" },
  ];
  
  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-sm border-t border-primary/10 safe-area-bottom z-50",
      className
    )} {...props}>
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200",
              isActive 
                ? "text-primary bg-primary/10" 
                : "text-primary/60 hover:text-primary hover:bg-primary/5"
            )}
          >
            {({ isActive }) => (
              <>
                <motion.div
                  initial={false}
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <ApperIcon name={item.icon} size={22} />
                </motion.div>
                <span className="text-xs font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;