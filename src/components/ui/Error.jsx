import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  className,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full", className)}
      {...props}
    >
      <Card variant="elevated" className="text-center py-8">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-error/10 to-error/20 rounded-full flex items-center justify-center">
              <ApperIcon name="AlertCircle" size={32} className="text-error" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-serif font-semibold text-primary text-lg">
              Oops! Something went wrong
            </h3>
            <p className="text-primary/70 text-sm max-w-md mx-auto">
              {message}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button
                variant="primary"
                onClick={onRetry}
                className="flex items-center gap-2"
              >
                <ApperIcon name="RefreshCw" size={16} />
                Try Again
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Home" size={16} />
              Go Home
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Error;