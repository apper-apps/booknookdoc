import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import { cn } from "@/utils/cn";

const ImageCard = ({ 
  image,
  onLike,
  onComment,
  showUser = true,
  className,
  ...props 
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(image.Id);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      onComment?.(image.Id, {
        content: commentText,
        userId: "user1",
        user: {
          Id: 1,
          username: "CurrentUser",
          avatar: "/api/placeholder/32/32"
        }
      });
      setCommentText("");
      toast.success("Comment added!");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: image.caption,
        text: image.caption,
        url: window.location.href
      });
    } else {
      toast.success("Link copied to clipboard!");
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "shelfie": return "BookOpen";
      case "quote": return "Quote";
      case "fanart": return "Palette";
      case "meme": return "Smile";
      default: return "Image";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "shelfie": return "secondary";
      case "quote": return "accent";
      case "fanart": return "success";
      case "meme": return "warning";
      default: return "default";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full", className)}
      {...props}
    >
      <Card variant="elevated" className="overflow-hidden">
        <div className="space-y-4">
          {/* Header */}
          {showUser && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  src={image.user?.avatar}
                  alt={image.user?.username}
                  size="sm"
                />
                <div>
                  <div className="font-medium text-primary text-sm">
                    {image.user?.username}
                  </div>
                  <div className="text-xs text-primary/60">
                    {formatDistanceToNow(new Date(image.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
              
              <Badge 
                variant={getTypeColor(image.type)} 
                size="xs"
                className="flex items-center gap-1"
              >
                <ApperIcon name={getTypeIcon(image.type)} size={12} />
                {image.type}
              </Badge>
            </div>
          )}

          {/* Image */}
          <div className="relative">
            <img
              src={image.url}
              alt={image.caption}
              className="w-full h-auto rounded-lg object-cover"
            />
            
            {/* Book Tags Overlay */}
            {image.bookTags && image.bookTags.length > 0 && (
              <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                {image.bookTags.slice(0, 3).map((bookId) => (
                  <Badge key={bookId} variant="default" size="xs" className="bg-black/70 text-white">
                    Book #{bookId}
                  </Badge>
                ))}
                {image.bookTags.length > 3 && (
                  <Badge variant="default" size="xs" className="bg-black/70 text-white">
                    +{image.bookTags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <p className="text-primary/80 text-sm leading-relaxed">
              {image.caption}
            </p>
            
            {/* Tags */}
            {image.tags && image.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {image.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" size="xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-primary/10">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-1 text-xs",
                  isLiked && "text-accent"
                )}
              >
                <ApperIcon 
                  name="Heart" 
                  size={16} 
                  className={isLiked ? "fill-current" : ""} 
                />
                {(image.likes || 0) + (isLiked ? 1 : 0)}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1 text-xs"
              >
                <ApperIcon name="MessageCircle" size={16} />
                {image.comments?.length || 0}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-1 text-xs"
              >
                <ApperIcon name="Share" size={16} />
                Share
              </Button>
            </div>
          </div>

          {/* Comments */}
          {showComments && (
            <div className="space-y-3 pt-2 border-t border-primary/10">
              {image.comments?.map((comment) => (
                <div key={comment.Id} className="flex items-start gap-2">
                  <Avatar
                    src={comment.user?.avatar}
                    alt={comment.user?.username}
                    size="xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs">
                      <span className="font-medium text-primary">
                        {comment.user?.username}
                      </span>
                      <span className="text-primary/80 ml-2">
                        {comment.content}
                      </span>
                    </div>
                    <div className="text-xs text-primary/50 mt-1">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add Comment */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-1 text-xs border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                >
                  <ApperIcon name="Send" size={14} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default ImageCard;