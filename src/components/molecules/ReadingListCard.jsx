import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ProgressBar from "@/components/atoms/ProgressBar";
import { cn } from "@/utils/cn";

const ReadingListCard = ({ 
  book,
  onUpdateProgress,
  onRemoveFromList,
  onMarkAsFinished,
  className,
  ...props 
}) => {
  const handleProgressUpdate = (newProgress) => {
    onUpdateProgress?.(book.Id, newProgress);
    toast.success(`Progress updated to ${newProgress}%`);
  };
  
  const handleMarkFinished = () => {
    onMarkAsFinished?.(book.Id);
    toast.success(`"${book.title}" marked as finished!`);
  };
  
  const handleRemove = () => {
    onRemoveFromList?.(book.Id);
    toast.info(`"${book.title}" removed from list`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(className)}
      {...props}
    >
      <Card variant="default" className="overflow-hidden">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <img
              src={book.cover || "/api/placeholder/80/120"}
              alt={book.title}
              className="w-16 h-24 object-cover rounded-md shadow-sm"
            />
          </div>
          
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <h3 className="font-serif font-semibold text-primary text-lg line-clamp-2">
                {book.title}
              </h3>
              <p className="text-primary/70 text-sm">
                {book.author}
              </p>
            </div>
            
            {book.status === "currently-reading" && (
              <div className="space-y-2">
                <ProgressBar
                  progress={book.progress || 0}
                  label="Reading Progress"
                  color="accent"
                />
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleProgressUpdate(Math.min(100, (book.progress || 0) + 10))}
                    className="text-xs"
                  >
                    <ApperIcon name="Plus" size={14} className="mr-1" />
                    +10%
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleProgressUpdate(Math.max(0, (book.progress || 0) - 10))}
                    className="text-xs"
                  >
                    <ApperIcon name="Minus" size={14} className="mr-1" />
                    -10%
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              {book.status === "currently-reading" && (
                <Button
                  variant="accent"
                  size="sm"
                  onClick={handleMarkFinished}
                  className="text-xs"
                >
                  <ApperIcon name="CheckCircle" size={14} className="mr-1" />
                  Mark Finished
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-xs text-error hover:text-error"
              >
                <ApperIcon name="X" size={14} className="mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ReadingListCard;