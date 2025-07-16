import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Clubs from "@/components/pages/Clubs";
import Books from "@/components/pages/Books";
import Card from "@/components/atoms/Card";
import Textarea from "@/components/atoms/Textarea";
import Avatar from "@/components/atoms/Avatar";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import userService from "@/services/api/userService";
const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    bio: "",
    readingGoal: 50,
  });
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      
const [userData, userStats, userActivities, userFollowers, userFollowing] = await Promise.all([
        userService.getCurrentUser(),
        userService.getReadingStats("user1"),
        userService.getRecentActivity("user1"),
        userService.getFollowers("user1"),
        userService.getFollowing("user1"),
      ]);
      
      setUser(userData);
      setStats(userStats);
      setActivities(userActivities);
      setFollowers(userFollowers);
      setFollowing(userFollowing);
      
      setEditForm({
        username: userData.username,
        bio: userData.bio || "",
        readingGoal: userData.readingGoal || 50,
      });
    } catch (err) {
      setError("Failed to load profile. Please try again.");
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveProfile = async () => {
    try {
      const result = await userService.updateProfile(editForm);
      if (result.success) {
        setUser(result.user);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", err);
    }
};
  
  const handleFollowToggle = async () => {
    try {
      const result = isFollowing 
        ? await userService.unfollowUser("user1", user.Id)
        : await userService.followUser("user1", user.Id);
      
      if (result.success) {
        setIsFollowing(!isFollowing);
        toast.success(isFollowing ? "Unfollowed user" : "Following user!");
      }
    } catch (err) {
      toast.error("Failed to update follow status");
    }
  };
  const getActivityIcon = (type) => {
    switch (type) {
      case "book_finished":
        return "CheckCircle";
      case "discussion_posted":
        return "MessageCircle";
      case "club_joined":
        return "Users";
      default:
        return "Activity";
    }
  };
  
  const getActivityColor = (type) => {
    switch (type) {
      case "book_finished":
        return "success";
      case "discussion_posted":
        return "accent";
      case "club_joined":
        return "secondary";
      default:
        return "default";
    }
  };
  
  useEffect(() => {
    loadProfile();
  }, []);
  
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
          <Error message={error} onRetry={loadProfile} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <Card variant="elevated" className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 text-center md:text-left">
              <Avatar
                src={user?.avatar}
                alt={user?.username}
                size="2xl"
                className="mx-auto md:mx-0"
              />
              <div className="mt-4 space-y-1">
                <Badge variant="accent" size="sm">
                  Member since {new Date(user?.joinedAt).getFullYear()}
                </Badge>
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Username
                    </label>
                    <Input
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Bio
                    </label>
                    <Textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Reading Goal (books per year)
                    </label>
                    <Input
                      type="number"
                      value={editForm.readingGoal}
                      onChange={(e) => setEditForm({ ...editForm, readingGoal: parseInt(e.target.value) })}
                      min={1}
                      max={365}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-serif font-bold text-primary">
                        {user?.username}
                      </h1>
                      <p className="text-primary/70 mt-1">
                        {user?.bio || "No bio added yet"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <ApperIcon name="Edit" size={16} className="mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {user?.favoriteGenres?.map((genre) => (
                      <Badge key={genre} variant="secondary" size="sm">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
        
        {/* Reading Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card variant="flat" className="text-center">
            <div className="space-y-1">
              <div className="text-xl font-bold text-primary">{stats?.booksRead || 0}</div>
              <div className="text-xs text-primary/60">Books Read</div>
            </div>
          </Card>
          <Card variant="flat" className="text-center">
            <div className="space-y-1">
              <div className="text-xl font-bold text-accent">{stats?.currentlyReading || 0}</div>
              <div className="text-xs text-primary/60">Currently Reading</div>
            </div>
          </Card>
          <Card variant="flat" className="text-center">
            <div className="space-y-1">
              <div className="text-xl font-bold text-secondary">{stats?.wantToRead || 0}</div>
              <div className="text-xs text-primary/60">Want to Read</div>
            </div>
          </Card>
          <Card variant="flat" className="text-center">
            <div className="space-y-1">
              <div className="text-xl font-bold text-success">{stats?.clubsJoined || 0}</div>
              <div className="text-xs text-primary/60">Clubs Joined</div>
            </div>
          </Card>
          <Card variant="flat" className="text-center">
            <div className="space-y-1">
              <div className="text-xl font-bold text-warning">{stats?.discussionsStarted || 0}</div>
              <div className="text-xs text-primary/60">Discussions</div>
            </div>
          </Card>
<Card variant="flat" className="text-center">
            <div className="space-y-1">
              <div className="text-xl font-bold text-info">{stats?.commentsPosted || 0}</div>
              <div className="text-xs text-primary/60">Comments</div>
            </div>
          </Card>
        </div>
        
        {/* Social Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card variant="flat" className="text-center">
            <div className="space-y-1">
              <div className="text-xl font-bold text-primary">{followers.length}</div>
              <div className="text-xs text-primary/60">Followers</div>
            </div>
          </Card>
          <Card variant="flat" className="text-center">
            <div className="space-y-1">
              <div className="text-xl font-bold text-secondary">{following.length}</div>
              <div className="text-xs text-primary/60">Following</div>
            </div>
          </Card>
        </div>
        
        {/* Reading Goal Progress */}
        <Card variant="elevated">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-semibold text-primary">
                2024 Reading Goal
              </h3>
              <span className="text-sm text-primary/60">
                {stats?.booksRead || 0} / {user?.readingGoal || 50} books
              </span>
            </div>
            <div className="w-full bg-primary/10 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-accent to-pink-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(((stats?.booksRead || 0) / (user?.readingGoal || 50)) * 100, 100)}%` }}
              />
            </div>
            <p className="text-sm text-primary/60">
              {(stats?.booksRead || 0) >= (user?.readingGoal || 50) 
                ? "Congratulations! You've reached your reading goal! 🎉"
                : `${(user?.readingGoal || 50) - (stats?.booksRead || 0)} books to go!`
              }
            </p>
          </div>
        </Card>
        
        {/* Recent Activity */}
        <Card variant="elevated">
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-primary">
              Recent Activity
            </h3>
            
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Activity" size={48} className="mx-auto text-primary/40 mb-4" />
                <p className="text-primary/70">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-surface/50 rounded-lg"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${getActivityColor(activity.type)}/10`}>
                      <ApperIcon 
                        name={getActivityIcon(activity.type)} 
                        size={16} 
                        className={`text-${getActivityColor(activity.type)}`} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary text-sm">
                        {activity.title}
                      </p>
                      <p className="text-primary/70 text-xs mt-1">
                        {activity.description}
                      </p>
                      <p className="text-primary/50 text-xs mt-2">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Card>
        
        {/* Favorite Books */}
        <Card variant="elevated">
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-primary">
              Favorite Books
            </h3>
            
            {user?.favoriteBooks?.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Heart" size={48} className="mx-auto text-primary/40 mb-4" />
                <p className="text-primary/70">No favorite books yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {user?.favoriteBooks?.slice(0, 6).map((bookId) => (
                  <div key={bookId} className="flex items-center gap-3 p-3 bg-surface/50 rounded-lg">
                    <img
                      src="/api/placeholder/60/90"
                      alt="Book cover"
                      className="w-12 h-18 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary text-sm line-clamp-2">
                        Book Title {bookId}
                      </p>
                      <p className="text-primary/60 text-xs mt-1">
                        Author Name
                      </p>
                    </div>
                  </div>
                ))}
              </div>
)}
          </div>
        </Card>
        
        {/* Image Gallery */}
        <Card variant="elevated">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-semibold text-primary">
                Image Gallery
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/images")}
              >
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Image
              </Button>
            </div>
            
            {user?.images?.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Image" size={48} className="mx-auto text-primary/40 mb-4" />
                <p className="text-primary/70 mb-4">No images uploaded yet</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/images")}
                >
                  <ApperIcon name="Upload" size={16} className="mr-2" />
                  Upload Your First Image
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {user?.images?.slice(0, 6).map((image) => (
                  <div key={image.Id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.caption}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="flex items-center justify-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <ApperIcon name="Heart" size={14} />
                            {image.likes || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <ApperIcon name="MessageCircle" size={14} />
                            {image.comments?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;