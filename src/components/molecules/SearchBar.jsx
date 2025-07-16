import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch,
  showFilters = false,
  filters = [],
  activeFilter = "all",
  onFilterChange,
  className,
  ...props 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };
  
  const handleFilterSelect = (filter) => {
    onFilterChange?.(filter);
    setIsFiltersOpen(false);
  };
  
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-primary/50 hover:text-primary transition-colors"
          >
            <ApperIcon name="Search" size={18} />
          </button>
        </div>
        {showFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="px-3"
          >
            <ApperIcon name="Filter" size={18} />
          </Button>
        )}
      </form>
      
      {showFilters && isFiltersOpen && (
        <div className="bg-surface border border-primary/10 rounded-lg p-2 shadow-md">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.value}
                variant={activeFilter === filter.value ? "primary" : "ghost"}
                size="sm"
                onClick={() => handleFilterSelect(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;