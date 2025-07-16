import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import BookCard from "@/components/molecules/BookCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useBooks } from "@/hooks/useBooks";
import { useReadingList } from "@/hooks/useReadingList";

const Books = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { books, loading, error, loadBooks, searchBooks, getTrending, getRecommendations } = useBooks();
  const { addToList } = useReadingList();
  
  const filters = [
    { value: "all", label: "All Books" },
    { value: "fantasy", label: "Fantasy" },
    { value: "romance", label: "Romance" },
    { value: "young-adult", label: "Young Adult" },
    { value: "lgbtq", label: "LGBTQ+" },
    { value: "contemporary", label: "Contemporary" },
    { value: "mythology", label: "Mythology" },
  ];
  
  const tabs = [
    { id: "trending", label: "Trending", icon: "TrendingUp" },
    { id: "recommendations", label: "For You", icon: "Sparkles" },
    { id: "all", label: "All Books", icon: "Library" },
  ];
  
  useEffect(() => {
    if (searchQuery) {
      searchBooks(searchQuery, { genre: activeFilter === "all" ? null : activeFilter });
    } else {
      if (activeTab === "trending") {
        getTrending();
      } else if (activeTab === "recommendations") {
        getRecommendations();
      } else {
        loadBooks();
      }
    }
  }, [searchQuery, activeFilter, activeTab]);
  
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };
  
  const handleAddToList = async (bookId, status) => {
    const success = await addToList(bookId, status);
    if (success) {
      toast.success(`Added book to ${status.replace("-", " ")} list!`);
    }
  };
  
  const getFilteredBooks = () => {
    if (activeFilter === "all") return books;
    return books.filter(book => 
      book.genres?.some(genre => genre.toLowerCase() === activeFilter.replace("-", " ").toLowerCase())
    );
  };
  
  const filteredBooks = getFilteredBooks();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <Card variant="elevated" className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif font-bold text-primary">
              Discover Books
            </h1>
            <p className="text-primary/70">
              Find your next favorite read from our curated collection
            </p>
          </div>
        </Card>
        
        {/* Tabs */}
        <Card variant="elevated">
          <div className="border-b border-primary/10 mb-6">
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <ApperIcon name={tab.icon} size={16} />
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Search and Filters */}
          <SearchBar
            placeholder="Search books, authors, or genres..."
            onSearch={handleSearch}
            showFilters={true}
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        </Card>
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="flat" className="text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-sm text-primary/60">Total Books</div>
            </div>
          </Card>
          <Card variant="flat" className="text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-accent">4.7</div>
              <div className="text-sm text-primary/60">Avg Rating</div>
            </div>
          </Card>
          <Card variant="flat" className="text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-secondary">8</div>
              <div className="text-sm text-primary/60">Genres</div>
            </div>
          </Card>
          <Card variant="flat" className="text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-success">New</div>
              <div className="text-sm text-primary/60">Releases</div>
            </div>
          </Card>
        </div>
        
        {/* Books Grid */}
        <div className="space-y-4">
          {loading ? (
            <Loading variant="default" />
          ) : error ? (
            <Error message={error} onRetry={loadBooks} />
          ) : filteredBooks.length === 0 ? (
            <Empty
              icon="BookOpen"
              title="No books found"
              description="Try adjusting your search terms or filters to find books."
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {filteredBooks.map((book, index) => (
                <motion.div
                  key={book.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BookCard
                    book={book}
                    onAddToList={handleAddToList}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        
        {/* Reading Challenge CTA */}
        <Card variant="elevated" className="text-center bg-gradient-to-r from-accent/5 to-pink-500/5">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-accent/20 to-pink-500/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Target" size={32} className="text-accent" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-semibold text-primary">
                Set a Reading Challenge
              </h3>
              <p className="text-primary/70">
                Challenge yourself to read more books this year! Track your progress and celebrate your achievements.
              </p>
            </div>
            <Button
              variant="accent"
              size="lg"
              onClick={() => toast.info("Reading challenge feature coming soon!")}
            >
              <ApperIcon name="Target" size={20} className="mr-2" />
              Start Challenge
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Books;