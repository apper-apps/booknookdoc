import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import ClubCard from "@/components/molecules/ClubCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useClubs } from "@/hooks/useClubs";

const Clubs = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedClubIds, setJoinedClubIds] = useState([1, 2, 4]); // Mock joined clubs
  const { clubs, loading, error, loadClubs, searchClubs, joinClub, leaveClub } = useClubs();
  
  const filters = [
    { value: "all", label: "All Clubs" },
    { value: "joined", label: "Joined" },
    { value: "fantasy", label: "Fantasy" },
    { value: "romance", label: "Romance" },
    { value: "young-adult", label: "Young Adult" },
    { value: "lgbtq", label: "LGBTQ+" },
    { value: "contemporary", label: "Contemporary" },
  ];
  
  useEffect(() => {
    if (searchQuery) {
      searchClubs(searchQuery, { genre: activeFilter === "all" ? null : activeFilter });
    } else {
      loadClubs();
    }
  }, [searchQuery, activeFilter]);
  
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };
  
  const handleJoinClub = async (clubId) => {
    const success = await joinClub(clubId);
    if (success) {
      setJoinedClubIds([...joinedClubIds, clubId]);
      toast.success("Successfully joined club!");
    }
  };
  
  const handleLeaveClub = async (clubId) => {
    const success = await leaveClub(clubId);
    if (success) {
      setJoinedClubIds(joinedClubIds.filter(id => id !== clubId));
      toast.info("Left club successfully");
    }
  };
  
  const getFilteredClubs = () => {
    if (activeFilter === "all") return clubs;
    if (activeFilter === "joined") {
      return clubs.filter(club => joinedClubIds.includes(club.Id));
    }
    return clubs.filter(club => 
      club.genre?.toLowerCase() === activeFilter.replace("-", " ").toLowerCase()
    );
  };
  
  const filteredClubs = getFilteredClubs();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <Card variant="elevated" className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif font-bold text-primary">
              Book Clubs
            </h1>
            <p className="text-primary/70">
              Connect with fellow readers and dive deeper into your favorite books
            </p>
          </div>
        </Card>
        
        {/* Search and Filters */}
        <Card variant="elevated">
          <SearchBar
            placeholder="Search clubs..."
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
              <div className="text-2xl font-bold text-primary">8</div>
              <div className="text-sm text-primary/60">Total Clubs</div>
            </div>
          </Card>
          <Card variant="flat" className="text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-accent">3</div>
              <div className="text-sm text-primary/60">Joined</div>
            </div>
          </Card>
          <Card variant="flat" className="text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-secondary">1.2k</div>
              <div className="text-sm text-primary/60">Members</div>
            </div>
          </Card>
          <Card variant="flat" className="text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-success">24</div>
              <div className="text-sm text-primary/60">Discussions</div>
            </div>
          </Card>
        </div>
        
        {/* Clubs Grid */}
        <div className="space-y-4">
          {loading ? (
            <Loading variant="cards" />
          ) : error ? (
            <Error message={error} onRetry={loadClubs} />
          ) : filteredClubs.length === 0 ? (
            <Empty
              icon="Users"
              title={activeFilter === "joined" ? "No clubs joined yet" : "No clubs found"}
              description={
                activeFilter === "joined" 
                  ? "Join some clubs to start connecting with fellow readers!"
                  : "Try adjusting your search terms or filters to find clubs."
              }
              actionLabel={activeFilter === "joined" ? "Browse All Clubs" : "Clear Filters"}
              onAction={() => {
                if (activeFilter === "joined") {
                  setActiveFilter("all");
                } else {
                  setSearchQuery("");
                  setActiveFilter("all");
                }
              }}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredClubs.map((club, index) => (
                <motion.div
                  key={club.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ClubCard
                    club={club}
                    isJoined={joinedClubIds.includes(club.Id)}
                    onJoin={handleJoinClub}
                    onLeave={handleLeaveClub}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        
        {/* Create Club CTA */}
        <Card variant="elevated" className="text-center bg-gradient-to-r from-accent/5 to-pink-500/5">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-accent/20 to-pink-500/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Plus" size={32} className="text-accent" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-semibold text-primary">
                Can't find the perfect club?
              </h3>
              <p className="text-primary/70">
                Create your own book club and build a community around your favorite genres and books!
              </p>
            </div>
<Button
              variant="accent"
              size="lg"
              onClick={() => navigate("/clubs/create")}
            >
              <ApperIcon name="Plus" size={20} className="mr-2" />
              Create New Club
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Clubs;