import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const ClubCard = ({ 
  club,
  isJoined = false,
  onJoin,
  onLeave,
  className,
  ...props 
}) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/clubs/${club.Id}`);
  };
  
  const handleJoinClick = (e) => {
    e.stopPropagation();
    onJoin?.(club.Id);
  };
  
  const handleLeaveClick = (e) => {
    e.stopPropagation();
    onLeave?.(club.Id);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(className)}
      {...props}
    >
      <Card variant="interactive" onClick={handleCardClick}>
        <div className="space-y-4">
          <div className="relative">
            <img
              src={club.coverImage || "/api/placeholder/300/120"}
              alt={club.name}
              className="w-full h-24 object-cover rounded-lg"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="default" size="xs">
                {club.memberCount} members
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-serif font-semibold text-primary text-lg line-clamp-2">
              {club.name}
            </h3>
            <p className="text-primary/70 text-sm line-clamp-2">
              {club.description}
            </p>
          </div>
          
          {club.currentBook && (
            <div className="flex items-center gap-2 text-sm text-primary/60">
              <ApperIcon name="BookOpen" size={16} />
              <span className="line-clamp-1">Currently reading: {club.currentBook}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-primary/60">
            <ApperIcon name="MessageCircle" size={16} />
            <span>{club.discussions?.length || 0} discussions</span>
          </div>
          
          <div className="pt-2 border-t border-primary/10">
            {isJoined ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLeaveClick}
                className="w-full"
              >
                <ApperIcon name="Check" size={16} className="mr-2" />
                Joined
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleJoinClick}
                className="w-full"
              >
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Join Club
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ClubCard;