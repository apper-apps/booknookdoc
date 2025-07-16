import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import DiscussionCard from "@/components/molecules/DiscussionCard";
import ClubCard from "@/components/molecules/ClubCard";
import BookCard from "@/components/molecules/BookCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useDiscussions } from "@/hooks/useDiscussions";
import { useClubs } from "@/hooks/useClubs";
import { useBooks } from "@/hooks/useBooks";
import { useReadingList } from "@/hooks/useReadingList";

const Home = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("activity");
  const { discussions, loading: discussionsLoading, error: discussionsError, getRecentActivity } = useDiscussions();
  const { clubs, loading: clubsLoading, error: clubsError, getJoinedClubs, joinClub, leaveClub } = useClubs();
  const { books, loading: booksLoading, error: booksError, getRecommendations } = useBooks();
  const { readingLists, loading: listsLoading, error: listsError, addToList } = useReadingList();
  
  const [joinedClubIds] = useState([1, 2, 4]); // Mock joined clubs
  
  useEffect(() => {
    if (selectedTab === "activity") {
      getRecentActivity();
    } else if (selectedTab === "clubs") {
      getJoinedClubs();
    } else if (selectedTab === "recommendations") {
      getRecommendations();
    }
  }, [selectedTab]);
  
  const handleJoinClub = async (clubId) => {
    const success = await joinClub(clubId);
    if (success) {
      toast.success("Successfully joined club!");
    }
  };
  
  const handleLeaveClub = async (clubId) => {
    const success = await leaveClub(clubId);
    if (success) {
      toast.info("Left club successfully");
    }
  };
  
  const handleAddToList = async (bookId, status) => {
    const success = await addToList(bookId, status);
    if (success) {
      toast.success(`Added book to ${status.replace("-", " ")} list!`);
    }
  };
  
  const getCurrentlyReading = () => {
    return readingLists.filter(item => item.status === "currently-reading").slice(0, 3);
  };
  
  const renderContent = () => {
    if (selectedTab === "activity") {
      if (discussionsLoading) return <Loading variant="default" />;
      if (discussionsError) return <Error message={discussionsError} onRetry={getRecentActivity} />;
      if (discussions.length === 0) return (
        <Empty
          icon="MessageCircle"
          title="No recent activity"
          description="Join some clubs and start participating in discussions to see activity here!"
          actionLabel="Browse Clubs"
          onAction={() => navigate("/clubs")}
        />
      );
      
      return (
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <DiscussionCard
              key={discussion.Id}
              discussion={discussion}
              showClubInfo={true}
            />
          ))}
        </div>
      );
    }
    
    if (selectedTab === "clubs") {
      if (clubsLoading) return <Loading variant="cards" />;
      if (clubsError) return <Error message={clubsError} onRetry={getJoinedClubs} />;
      if (clubs.length === 0) return (
        <Empty
          icon="Users"
          title="No clubs joined yet"
          description="Join book clubs to connect with fellow readers and participate in discussions!"
          actionLabel="Browse Clubs"
          onAction={() => navigate("/clubs")}
        />
      );
      
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clubs.map((club) => (
            <ClubCard
              key={club.Id}
              club={club}
              isJoined={joinedClubIds.includes(club.Id)}
              onJoin={handleJoinClub}
              onLeave={handleLeaveClub}
            />
          ))}
        </div>
      );
    }
    
    if (selectedTab === "recommendations") {
      if (booksLoading) return <Loading variant="cards" />;
      if (booksError) return <Error message={booksError} onRetry={getRecommendations} />;
      if (books.length === 0) return (
        <Empty
          icon="Sparkles"
          title="No recommendations yet"
          description="Add some books to your reading list to get personalized recommendations!"
          actionLabel="Browse Books"
          onAction={() => navigate("/books")}
        />
      );
      
      return (
        <div className="space-y-4">
          {books.map((book) => (
            <BookCard
              key={book.Id}
              book={book}
              onAddToList={handleAddToList}
            />
          ))}
        </div>
      );
    }
  };
  
  const tabs = [
    { id: "activity", label: "Recent Activity", icon: "Activity" },
    { id: "clubs", label: "My Clubs", icon: "Users" },
    { id: "recommendations", label: "For You", icon: "Sparkles" },
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Currently Reading Section */}
        <Card variant="elevated" className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-semibold text-primary flex items-center gap-2">
              <ApperIcon name="BookOpen" size={24} />
              Currently Reading
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/lists")}
              className="text-primary/70 hover:text-primary"
            >
              View All
            </Button>
          </div>
          
          {listsLoading ? (
            <Loading variant="list" />
          ) : getCurrentlyReading().length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="BookOpen" size={48} className="mx-auto text-primary/40 mb-4" />
              <p className="text-primary/70 mb-4">No books currently being read</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/books")}
              >
                Find Your Next Read
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getCurrentlyReading().map((item) => (
                <motion.div
                  key={item.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface rounded-lg p-4 shadow-sm"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.book.cover || "/api/placeholder/60/90"}
                      alt={item.book.title}
                      className="w-12 h-18 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-primary text-sm line-clamp-2">
                        {item.book.title}
                      </h3>
                      <p className="text-primary/60 text-xs mt-1">
                        {item.book.author}
                      </p>
                      <div className="mt-2">
                        <div className="flex justify-between items-center text-xs text-primary/60 mb-1">
                          <span>Progress</span>
                          <span>{item.progress}%</span>
                        </div>
                        <div className="w-full bg-primary/10 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-accent to-pink-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
        
        {/* Main Content Tabs */}
        <Card variant="elevated">
          <div className="border-b border-primary/10 mb-6">
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={selectedTab === tab.id ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTab(tab.id)}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <ApperIcon name={tab.icon} size={16} />
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="min-h-[400px]">
            {renderContent()}
          </div>
        </Card>
        
        {/* Quick Actions */}
        <Card variant="elevated">
          <h3 className="text-lg font-serif font-semibold text-primary mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/clubs")}
              className="flex flex-col items-center gap-2 p-4 h-auto"
            >
              <ApperIcon name="Users" size={24} />
              <span className="text-sm">Browse Clubs</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/books")}
              className="flex flex-col items-center gap-2 p-4 h-auto"
            >
              <ApperIcon name="Search" size={24} />
              <span className="text-sm">Find Books</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/lists")}
              className="flex flex-col items-center gap-2 p-4 h-auto"
            >
              <ApperIcon name="BookOpen" size={24} />
              <span className="text-sm">My Library</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/profile")}
              className="flex flex-col items-center gap-2 p-4 h-auto"
            >
              <ApperIcon name="User" size={24} />
              <span className="text-sm">Profile</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;