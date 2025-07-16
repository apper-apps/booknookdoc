import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const DiscussionCard = ({ 
  discussion,
  showClubInfo = false,
  className,
  ...props 
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/discussions/${discussion.Id}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(className)}
      {...props}
    >
      <Card variant="interactive" onClick={handleClick}>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Avatar
              src={discussion.author?.avatar}
              alt={discussion.author?.username || "User"}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-primary">
                  {discussion.author?.username || "Anonymous"}
                </span>
                <span className="text-primary/50">•</span>
                <span className="text-primary/50">
                  {formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}
                </span>
              </div>
              {showClubInfo && discussion.clubName && (
                <div className="flex items-center gap-1 text-xs text-primary/60 mt-1">
                  <ApperIcon name="Users" size={12} />
                  <span>{discussion.clubName}</span>
                </div>
              )}
            </div>
            {discussion.hasSpoilers && (
              <Badge variant="warning" size="xs">
                Spoilers
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-primary line-clamp-2">
              {discussion.title}
            </h3>
            <p className="text-primary/70 text-sm line-clamp-3">
              {discussion.content}
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-primary/10">
            <div className="flex items-center gap-4 text-sm text-primary/60">
              <div className="flex items-center gap-1">
                <ApperIcon name="MessageCircle" size={16} />
                <span>{discussion.comments?.length || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Heart" size={16} />
                <span>{discussion.likes || 0}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ApperIcon name="ChevronRight" size={16} className="text-primary/40" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default DiscussionCard;