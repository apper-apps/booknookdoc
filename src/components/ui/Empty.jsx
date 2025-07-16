import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const Empty = ({ 
  icon = "BookOpen",
  title = "No items found",
  description = "There's nothing here yet. Start exploring!",
  actionLabel = "Get Started",
  onAction,
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
      <Card variant="elevated" className="text-center py-12">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
              <ApperIcon name={icon} size={36} className="text-primary/60" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-serif font-semibold text-primary text-xl">
              {title}
            </h3>
            <p className="text-primary/70 text-sm max-w-md mx-auto">
              {description}
            </p>
          </div>
          
          {onAction && (
            <div className="pt-4">
              <Button
                variant="primary"
                onClick={onAction}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Plus" size={16} />
                {actionLabel}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default Empty;