import { useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Textarea from "@/components/atoms/Textarea";
import { cn } from "@/utils/cn";

const CommentCard = ({ 
  comment,
  onReply,
  onLike,
  depth = 0,
  className,
  ...props 
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);
  
  const handleReply = () => {
    if (replyText.trim()) {
      onReply?.(comment.Id, replyText);
      setReplyText("");
      setIsReplying(false);
      toast.success("Reply posted!");
    }
  };
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(comment.Id);
  };
  
  const handleSpoilerReveal = () => {
    setSpoilerRevealed(true);
  };
  
  const maxDepth = 3;
  const shouldIndent = depth < maxDepth;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        shouldIndent && "ml-4 pl-4 border-l-2 border-primary/10",
        className
      )}
      {...props}
    >
      <Card variant="flat" padding="sm" className="bg-surface/50">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Avatar
              src={comment.author?.avatar}
              alt={comment.author?.username || "User"}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-primary">
                  {comment.author?.username || "Anonymous"}
                </span>
                <span className="text-primary/50">•</span>
                <span className="text-primary/50">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
            {comment.hasSpoilers && (
              <Badge variant="warning" size="xs">
                Spoilers
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <div className={cn(
              "text-primary/80 text-sm leading-relaxed",
              comment.hasSpoilers && !spoilerRevealed && "spoiler-blur"
            )}>
              {comment.content}
            </div>
            
            {comment.hasSpoilers && !spoilerRevealed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSpoilerReveal}
                className="text-xs"
              >
                <ApperIcon name="Eye" size={14} className="mr-1" />
                Reveal Spoiler
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-4 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "text-xs px-2 py-1",
                isLiked && "text-accent"
              )}
            >
              <ApperIcon 
                name="Heart" 
                size={14} 
                className={cn("mr-1", isLiked && "fill-current")} 
              />
              {(comment.likes || 0) + (isLiked ? 1 : 0)}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
              className="text-xs px-2 py-1"
            >
              <ApperIcon name="Reply" size={14} className="mr-1" />
              Reply
            </Button>
          </div>
          
          {isReplying && (
            <div className="space-y-2 pt-2 border-t border-primary/10">
              <Textarea
                placeholder="Write your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={2}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                >
                  Post Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {comment.replies?.map((reply) => (
        <CommentCard
          key={reply.Id}
          comment={reply}
          onReply={onReply}
          onLike={onLike}
          depth={depth + 1}
          className="mt-2"
        />
      ))}
    </motion.div>
  );
};

export default CommentCard;