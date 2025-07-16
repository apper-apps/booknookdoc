import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import DiscussionCard from "@/components/molecules/DiscussionCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import clubService from "@/services/api/clubService";
import { useDiscussions } from "@/hooks/useDiscussions";

const ClubDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    hasSpoilers: false,
  });
  
  const { discussions, loading: discussionsLoading, error: discussionsError, getClubDiscussions, createDiscussion } = useDiscussions();
  
  const loadClub = async () => {
    try {
      setLoading(true);
      setError("");
      const clubData = await clubService.getById(id);
      if (clubData) {
        setClub(clubData);
        setIsJoined([1, 2, 4].includes(clubData.Id)); // Mock joined status
      } else {
        setError("Club not found");
      }
    } catch (err) {
      setError("Failed to load club. Please try again.");
      console.error("Error loading club:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleJoinClub = async () => {
    try {
      const result = await clubService.joinClub(id, "user1");
      if (result.success) {
        setIsJoined(true);
        setClub(result.club);
        toast.success("Successfully joined club!");
      }
    } catch (err) {
      toast.error("Failed to join club");
    }
  };
  
  const handleLeaveClub = async () => {
    try {
      const result = await clubService.leaveClub(id, "user1");
      if (result.success) {
        setIsJoined(false);
        setClub(result.club);
        toast.info("Left club successfully");
      }
    } catch (err) {
      toast.error("Failed to leave club");
    }
  };
  
  const handleCreateDiscussion = async () => {
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const discussionData = {
      ...newDiscussion,
      clubId: parseInt(id),
      authorId: 1,
      author: {
        Id: 1,
        username: "BookLover2024",
        avatar: "/api/placeholder/32/32",
      },
    };
    
    const success = await createDiscussion(discussionData);
    if (success) {
      setShowCreateDiscussion(false);
      setNewDiscussion({ title: "", content: "", hasSpoilers: false });
      toast.success("Discussion created successfully!");
      getClubDiscussions(id);
    }
  };
  
  useEffect(() => {
    loadClub();
    getClubDiscussions(id);
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
          <Error message={error} onRetry={loadClub} />
        </div>
      </div>
    );
  }
  
  if (!club) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4">
          <Empty
            icon="Users"
            title="Club not found"
            description="The club you're looking for doesn't exist."
            actionLabel="Browse Clubs"
            onAction={() => navigate("/clubs")}
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
          onClick={() => navigate("/clubs")}
          className="mb-4"
        >
          <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
          Back to Clubs
        </Button>
        
        {/* Club Header */}
        <Card variant="elevated" className="overflow-hidden">
          <div className="relative">
            <img
              src={club.coverImage || "/api/placeholder/800/300"}
              alt={club.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-3xl font-serif font-bold mb-2">
                    {club.name}
                  </h1>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Users" size={16} />
                      <span>{club.memberCount} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="MessageCircle" size={16} />
                      <span>{discussions.length} discussions</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isJoined ? (
                    <Button
                      variant="secondary"
                      onClick={handleLeaveClub}
                    >
                      <ApperIcon name="Check" size={16} className="mr-2" />
                      Joined
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleJoinClub}
                    >
                      <ApperIcon name="Plus" size={16} className="mr-2" />
                      Join Club
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Club Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <Card variant="elevated">
              <h3 className="text-lg font-serif font-semibold text-primary mb-3">
                About This Club
              </h3>
              <p className="text-primary/70 leading-relaxed">
                {club.description}
              </p>
            </Card>
            
            {/* Discussions */}
            <Card variant="elevated">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-serif font-semibold text-primary">
                  Discussions
                </h3>
                {isJoined && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowCreateDiscussion(true)}
                  >
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    New Discussion
                  </Button>
                )}
              </div>
              
              {showCreateDiscussion && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-surface/50 rounded-lg space-y-4"
                >
                  <Input
                    placeholder="Discussion title..."
                    value={newDiscussion.title}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="What would you like to discuss?"
                    value={newDiscussion.content}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                    rows={4}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="spoilers"
                      checked={newDiscussion.hasSpoilers}
                      onChange={(e) => setNewDiscussion({ ...newDiscussion, hasSpoilers: e.target.checked })}
                      className="rounded border-primary/30"
                    />
                    <label htmlFor="spoilers" className="text-sm text-primary">
                      This discussion contains spoilers
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      onClick={handleCreateDiscussion}
                    >
                      Create Discussion
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowCreateDiscussion(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
              
              <div className="space-y-4">
                {discussionsLoading ? (
                  <Loading variant="list" />
                ) : discussionsError ? (
                  <Error message={discussionsError} onRetry={() => getClubDiscussions(id)} />
                ) : discussions.length === 0 ? (
                  <Empty
                    icon="MessageCircle"
                    title="No discussions yet"
                    description="Be the first to start a discussion in this club!"
                    actionLabel={isJoined ? "Start Discussion" : "Join Club"}
                    onAction={() => {
                      if (isJoined) {
                        setShowCreateDiscussion(true);
                      } else {
                        handleJoinClub();
                      }
                    }}
                  />
                ) : (
                  discussions.map((discussion) => (
                    <DiscussionCard
                      key={discussion.Id}
                      discussion={discussion}
                      showClubInfo={false}
                    />
                  ))
                )}
              </div>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Currently Reading */}
            <Card variant="elevated">
              <h3 className="text-lg font-serif font-semibold text-primary mb-3">
                Currently Reading
              </h3>
              {club.currentBook ? (
                <div className="flex items-center gap-3">
                  <img
                    src="/api/placeholder/60/90"
                    alt="Current book"
                    className="w-12 h-18 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-primary text-sm">
                      {club.currentBook}
                    </p>
                    <p className="text-primary/60 text-xs mt-1">
                      Club selection
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-primary/60 text-sm">
                  No book currently selected
                </p>
              )}
            </Card>
            
            {/* Club Stats */}
            <Card variant="elevated">
              <h3 className="text-lg font-serif font-semibold text-primary mb-3">
                Club Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-primary/70 text-sm">Members</span>
                  <Badge variant="secondary">{club.memberCount}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary/70 text-sm">Discussions</span>
                  <Badge variant="accent">{discussions.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary/70 text-sm">Created</span>
                  <span className="text-primary/70 text-sm">
                    {new Date(club.createdAt).getFullYear()}
                  </span>
                </div>
              </div>
            </Card>
            
            {/* Club Rules */}
            <Card variant="elevated">
              <h3 className="text-lg font-serif font-semibold text-primary mb-3">
                Club Guidelines
              </h3>
              <div className="space-y-2 text-sm text-primary/70">
                <p>• Be respectful to all members</p>
                <p>• Use spoiler tags when needed</p>
                <p>• Stay on topic with discussions</p>
                <p>• No spam or promotional content</p>
                <p>• Have fun and enjoy reading!</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetail;