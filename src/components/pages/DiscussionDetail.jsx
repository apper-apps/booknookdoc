import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Textarea from "@/components/atoms/Textarea";
import CommentCard from "@/components/molecules/CommentCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import discussionService from "@/services/api/discussionService";
import { formatDistanceToNow } from "date-fns";

const DiscussionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentHasSpoilers, setCommentHasSpoilers] = useState(false);
  
  const loadDiscussion = async () => {
    try {
      setLoading(true);
      setError("");
      const discussionData = await discussionService.getById(id);
      if (discussionData) {
        setDiscussion(discussionData);
      } else {
        setError("Discussion not found");
      }
    } catch (err) {
      setError("Failed to load discussion. Please try again.");
      console.error("Error loading discussion:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed like" : "Liked discussion!");
  };
  
  const handleSpoilerReveal = () => {
    setSpoilerRevealed(true);
  };
  
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    
    const commentData = {
      content: newComment,
      hasSpoilers: commentHasSpoilers,
      authorId: 1,
      author: {
        Id: 1,
        username: "BookLover2024",
        avatar: "/api/placeholder/32/32",
      },
    };
    
    try {
      const result = await discussionService.addComment(id, commentData);
      if (result.success) {
        setDiscussion({
          ...discussion,
          comments: [...(discussion.comments || []), result.comment],
        });
        setNewComment("");
        setCommentHasSpoilers(false);
        toast.success("Comment added successfully!");
      }
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };
  
  const handleReply = async (commentId, replyContent) => {
    const replyData = {
      content: replyContent,
      hasSpoilers: false,
      authorId: 1,
      author: {
        Id: 1,
        username: "BookLover2024",
        avatar: "/api/placeholder/32/32",
      },
    };
    
    try {
      const result = await discussionService.addReply(commentId, replyData);
      if (result.success) {
        // Refresh discussion to show the reply
        loadDiscussion();
        return true;
      }
    } catch (err) {
      toast.error("Failed to add reply");
    }
    return false;
  };
  
  const handleCommentLike = (commentId) => {
    toast.success("Liked comment!");
  };
  
  useEffect(() => {
    loadDiscussion();
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4">
          <Loading variant="default" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4">
          <Error message={error} onRetry={loadDiscussion} />
        </div>
      </div>
    );
  }
  
  if (!discussion) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4">
          <Empty
            icon="MessageCircle"
            title="Discussion not found"
            description="The discussion you're looking for doesn't exist."
            actionLabel="Browse Discussions"
            onAction={() => navigate("/")}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
          Back
        </Button>
        
        {/* Discussion Header */}
        <Card variant="elevated">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <img
                src={discussion.author?.avatar || "/api/placeholder/40/40"}
                alt={discussion.author?.username || "User"}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-primary">
                    {discussion.author?.username || "Anonymous"}
                  </span>
                  <span className="text-primary/50">•</span>
                  <span className="text-primary/50 text-sm">
                    {formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}
                  </span>
                  {discussion.hasSpoilers && (
                    <Badge variant="warning" size="xs">
                      Spoilers
                    </Badge>
                  )}
                </div>
                {discussion.clubName && (
                  <div className="flex items-center gap-1 text-xs text-primary/60">
                    <ApperIcon name="Users" size={12} />
                    <span>{discussion.clubName}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-2xl font-serif font-bold text-primary">
                {discussion.title}
              </h1>
              
              <div className={`text-primary/80 leading-relaxed ${
                discussion.hasSpoilers && !spoilerRevealed ? "spoiler-blur" : ""
              }`}>
                {discussion.content}
              </div>
              
              {discussion.hasSpoilers && !spoilerRevealed && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSpoilerReveal}
                  className="mt-2"
                >
                  <ApperIcon name="Eye" size={16} className="mr-2" />
                  Reveal Spoilers
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-4 pt-4 border-t border-primary/10">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={isLiked ? "text-accent" : ""}
              >
                <ApperIcon 
                  name="Heart" 
                  size={16} 
                  className={`mr-2 ${isLiked ? "fill-current" : ""}`} 
                />
                {(discussion.likes || 0) + (isLiked ? 1 : 0)}
              </Button>
              
              <div className="flex items-center gap-1 text-primary/60">
                <ApperIcon name="MessageCircle" size={16} />
                <span>{discussion.comments?.length || 0} comments</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.share?.({
                    title: discussion.title,
                    text: discussion.content,
                    url: window.location.href,
                  }) || toast.info("Link copied to clipboard!");
                }}
              >
                <ApperIcon name="Share" size={16} className="mr-2" />
                Share
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Add Comment */}
        <Card variant="elevated">
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-primary">
              Add Comment
            </h3>
            
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="comment-spoilers"
                  checked={commentHasSpoilers}
                  onChange={(e) => setCommentHasSpoilers(e.target.checked)}
                  className="rounded border-primary/30"
                />
                <label htmlFor="comment-spoilers" className="text-sm text-primary">
                  This comment contains spoilers
                </label>
              </div>
              
              <Button
                variant="primary"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                <ApperIcon name="Send" size={16} className="mr-2" />
                Post Comment
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Comments */}
        <Card variant="elevated">
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-primary">
              Comments ({discussion.comments?.length || 0})
            </h3>
            
            {discussion.comments?.length === 0 ? (
              <Empty
                icon="MessageCircle"
                title="No comments yet"
                description="Be the first to share your thoughts on this discussion!"
                actionLabel="Add Comment"
                onAction={() => document.querySelector('textarea').focus()}
              />
            ) : (
              <div className="space-y-4">
                {discussion.comments?.map((comment) => (
                  <CommentCard
                    key={comment.Id}
                    comment={comment}
                    onReply={handleReply}
                    onLike={handleCommentLike}
                    depth={0}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DiscussionDetail;