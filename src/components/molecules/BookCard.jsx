import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const BookCard = ({ 
  book,
  showProgress = false,
  onAddToList,
  onRemoveFromList,
  className,
  ...props 
}) => {
  const handleAddToList = (listType) => {
    onAddToList?.(book.Id, listType);
    toast.success(`Added "${book.title}" to ${listType} list`);
  };
  
  const handleRemoveFromList = () => {
    onRemoveFromList?.(book.Id);
    toast.info(`Removed "${book.title}" from list`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(className)}
      {...props}
    >
      <Card variant="interactive" className="overflow-hidden">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <img
              src={book.cover || "/api/placeholder/120/180"}
              alt={book.title}
              className="w-16 h-24 object-cover rounded-md shadow-sm"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-serif font-semibold text-primary text-sm line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-primary/70 text-sm mt-1">
                  {book.author}
                </p>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-primary/60">
                <ApperIcon name="Star" size={14} className="text-warning fill-current" />
                <span>{book.communityRating || "N/A"}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {book.genres?.slice(0, 2).map((genre) => (
                <Badge key={genre} variant="secondary" size="xs">
                  {genre}
                </Badge>
              ))}
            </div>
            
            {showProgress && book.progress !== undefined && (
              <div className="mt-3">
                <div className="flex justify-between items-center text-xs text-primary/70 mb-1">
                  <span>Progress</span>
                  <span>{book.progress}%</span>
                </div>
                <div className="w-full bg-primary/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-accent to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${book.progress}%` }}
                  />
                </div>
              </div>
            )}
            
            <div className="flex gap-2 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddToList("want-to-read")}
                className="flex-1 text-xs"
              >
                <ApperIcon name="Plus" size={14} className="mr-1" />
                Want to Read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddToList("currently-reading")}
                className="flex-1 text-xs"
              >
                <ApperIcon name="BookOpen" size={14} className="mr-1" />
                Reading
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default BookCard;