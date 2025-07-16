import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ReadingListCard from "@/components/molecules/ReadingListCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useReadingList } from "@/hooks/useReadingList";

const Lists = () => {
  const [activeTab, setActiveTab] = useState("currently-reading");
  const { readingLists, loading, error, loadReadingLists, getListByStatus, removeFromList, updateProgress, markAsFinished } = useReadingList();
  
  const tabs = [
    { id: "currently-reading", label: "Currently Reading", icon: "BookOpen", color: "accent" },
    { id: "want-to-read", label: "Want to Read", icon: "Bookmark", color: "secondary" },
    { id: "finished", label: "Finished", icon: "CheckCircle", color: "success" },
  ];
  
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    getListByStatus(tabId);
  };
  
  const handleRemoveFromList = async (bookId) => {
    const success = await removeFromList(bookId);
    if (success) {
      toast.info("Book removed from list");
    }
  };
  
  const handleUpdateProgress = async (bookId, progress) => {
    const success = await updateProgress(bookId, progress);
    if (success) {
      toast.success(`Progress updated to ${progress}%`);
    }
  };
  
  const handleMarkAsFinished = async (bookId) => {
    const success = await markAsFinished(bookId);
    if (success) {
      toast.success("Book marked as finished!");
      // Refresh the list
      getListByStatus(activeTab);
    }
  };
  
  const getFilteredBooks = () => {
    return readingLists.filter(item => item.status === activeTab);
  };
  
  const getReadingStats = () => {
    const currentlyReading = readingLists.filter(item => item.status === "currently-reading").length;
    const wantToRead = readingLists.filter(item => item.status === "want-to-read").length;
    const finished = readingLists.filter(item => item.status === "finished").length;
    const totalPages = readingLists.reduce((sum, item) => sum + (item.book?.pageCount || 0), 0);
    
    return { currentlyReading, wantToRead, finished, totalPages };
  };
  
  const stats = getReadingStats();
  const filteredBooks = getFilteredBooks();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <Card variant="elevated" className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif font-bold text-primary">
              My Library
            </h1>
            <p className="text-primary/70">
              Track your reading journey and organize your books
            </p>
          </div>
        </Card>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="flat" className="text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-accent">{stats.currentlyReading}</div>
              <div className="text-sm text-primary/60">Currently Reading</div>
            </div>
          </Card>
          <Card variant="flat" className="text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-secondary">{stats.wantToRead}</div>
              <div className="text-sm text-primary/60">Want to Read</div>
            </div>
          </Card>
          <Card variant="flat" className="text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-success">{stats.finished}</div>
              <div className="text-sm text-primary/60">Finished</div>
            </div>
          </Card>
          <Card variant="flat" className="text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{stats.totalPages.toLocaleString()}</div>
              <div className="text-sm text-primary/60">Pages</div>
            </div>
          </Card>
        </div>
        
        {/* Tabs */}
        <Card variant="elevated">
          <div className="border-b border-primary/10 mb-6">
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => handleTabChange(tab.id)}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <ApperIcon name={tab.icon} size={16} />
                  {tab.label}
                  <Badge variant={tab.color} size="xs">
                    {tab.id === "currently-reading" && stats.currentlyReading}
                    {tab.id === "want-to-read" && stats.wantToRead}
                    {tab.id === "finished" && stats.finished}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Reading Goal Progress */}
          {activeTab === "finished" && (
            <div className="mb-6 p-4 bg-gradient-to-r from-success/5 to-success/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-primary">2024 Reading Goal</h3>
                <span className="text-sm text-primary/60">{stats.finished} / 50 books</span>
              </div>
              <div className="w-full bg-primary/10 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-success to-success/80 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((stats.finished / 50) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-primary/60 mt-2">
                {stats.finished >= 50 ? "Goal achieved! 🎉" : `${50 - stats.finished} books to go!`}
              </p>
            </div>
          )}
          
          {/* List Content */}
          <div className="space-y-4">
            {loading ? (
              <Loading variant="default" />
            ) : error ? (
              <Error message={error} onRetry={loadReadingLists} />
            ) : filteredBooks.length === 0 ? (
              <Empty
                icon={tabs.find(t => t.id === activeTab)?.icon || "BookOpen"}
                title={`No books in ${activeTab.replace("-", " ")} list`}
                description={
                  activeTab === "currently-reading" 
                    ? "Start reading a book to track your progress!"
                    : activeTab === "want-to-read"
                    ? "Add some books you want to read to your wishlist!"
                    : "Finish reading some books to see them here!"
                }
                actionLabel="Browse Books"
                onAction={() => window.location.href = "/books"}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {filteredBooks.map((item, index) => (
                  <motion.div
                    key={item.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ReadingListCard
                      book={{ ...item.book, status: item.status, progress: item.progress }}
                      onUpdateProgress={handleUpdateProgress}
                      onRemoveFromList={handleRemoveFromList}
                      onMarkAsFinished={handleMarkAsFinished}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </Card>
        
        {/* Reading Insights */}
        <Card variant="elevated" className="bg-gradient-to-r from-accent/5 to-pink-500/5">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-accent/20 to-pink-500/20 rounded-full flex items-center justify-center">
              <ApperIcon name="BarChart3" size={32} className="text-accent" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-semibold text-primary">
                Reading Insights
              </h3>
              <p className="text-primary/70">
                Get detailed analytics about your reading habits, favorite genres, and progress over time.
              </p>
            </div>
            <Button
              variant="accent"
              size="lg"
              onClick={() => toast.info("Reading insights feature coming soon!")}
            >
              <ApperIcon name="BarChart3" size={20} className="mr-2" />
              View Analytics
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Lists;