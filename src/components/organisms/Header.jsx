import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
import { AuthContext } from "@/App";
const Header = ({ className, ...props }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications] = useState(3);
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Home";
      case "/clubs":
        return "Book Clubs";
      case "/clubs/create":
        return "Create Club";
      case "/books":
        return "Discover Books";
      case "/lists":
        return "My Library";
      case "/profile":
        return "Profile";
      case "/quizzes":
        return "Quizzes";
      default:
if (location.pathname.startsWith("/quiz/")) {
          return "Quiz";
        }
        return "BookBae";
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
              {location.pathname === "/" && isAuthenticated && (
                <p className="text-primary/60 text-xs">
                  Welcome back, book lover!
                </p>
              )}
            </div>
          </motion.div>
        </div>
<div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2"
                onClick={() => navigate("/quizzes")}
              >
                <ApperIcon name="Brain" size={20} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2"
                onClick={() => navigate("/images")}
              >
                <ApperIcon name="Image" size={20} />
              </Button>
              
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
              
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80"
                onClick={() => {
                  const { logout } = useContext(AuthContext);
                  logout();
                }}
              >
                <ApperIcon name="LogOut" size={16} className="mr-1" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-primary text-white hover:bg-primary/90"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;