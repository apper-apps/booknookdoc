import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import bookService from "@/services/api/bookService";
import { useReadingList } from "@/hooks/useReadingList";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [readingStatus, setReadingStatus] = useState(null);
  const { addToList } = useReadingList();
  
  const loadBook = async () => {
    try {
      setLoading(true);
      setError("");
      const bookData = await bookService.getById(id);
      if (bookData) {
        setBook(bookData);
        // Mock reading status check
        setReadingStatus(null);
      } else {
        setError("Book not found");
      }
    } catch (err) {
      setError("Failed to load book. Please try again.");
      console.error("Error loading book:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToList = async (status) => {
    const success = await addToList(id, status);
    if (success) {
      setReadingStatus(status);
      toast.success(`Added "${book.title}" to ${status.replace("-", " ")} list!`);
    }
  };
  
  useEffect(() => {
    loadBook();
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
          <Error message={error} onRetry={loadBook} />
        </div>
      </div>
    );
  }
  
  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4">
          <Empty
            icon="BookOpen"
            title="Book not found"
            description="The book you're looking for doesn't exist."
            actionLabel="Browse Books"
            onAction={() => navigate("/books")}
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
          onClick={() => navigate("/books")}
          className="mb-4"
        >
          <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
          Back to Books
        </Button>
        
        {/* Book Header */}
        <Card variant="elevated">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={book.cover || "/api/placeholder/300/450"}
                alt={book.title}
                className="w-48 h-72 object-cover rounded-lg shadow-lg mx-auto md:mx-0"
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-serif font-bold text-primary mb-2">
                  {book.title}
                </h1>
                <p className="text-xl text-primary/70 mb-4">
                  by {book.author}
                </p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Star" size={20} className="text-warning fill-current" />
                    <span className="text-lg font-medium text-primary">
                      {book.communityRating || "N/A"}
                    </span>
                    <span className="text-primary/60 text-sm">
                      ({Math.floor(Math.random() * 1000) + 100} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-primary/60">
                    <ApperIcon name="Calendar" size={16} />
                    <span className="text-sm">
                      {new Date(book.publishedDate).getFullYear()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-primary/60">
                    <ApperIcon name="FileText" size={16} />
                    <span className="text-sm">
                      {book.pageCount} pages
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {book.genres?.map((genre) => (
                    <Badge key={genre} variant="secondary" size="sm">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                {readingStatus ? (
                  <div className="flex items-center gap-2 text-success">
                    <ApperIcon name="Check" size={16} />
                    <span className="font-medium">
                      Added to {readingStatus.replace("-", " ")} list
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="primary"
                      onClick={() => handleAddToList("currently-reading")}
                      className="flex items-center gap-2"
                    >
                      <ApperIcon name="BookOpen" size={16} />
                      Currently Reading
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleAddToList("want-to-read")}
                      className="flex items-center gap-2"
                    >
                      <ApperIcon name="Bookmark" size={16} />
                      Want to Read
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAddToList("finished")}
                      className="flex items-center gap-2"
                    >
                      <ApperIcon name="CheckCircle" size={16} />
                      Finished
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
        
        {/* Book Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <Card variant="elevated">
              <h3 className="text-lg font-serif font-semibold text-primary mb-3">
                About This Book
              </h3>
              <p className="text-primary/70 leading-relaxed">
                {book.description}
              </p>
            </Card>
            
            {/* Community Reviews */}
            <Card variant="elevated">
              <h3 className="text-lg font-serif font-semibold text-primary mb-4">
                Community Reviews
              </h3>
              
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-surface/50 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={`/api/placeholder/32/32`}
                        alt="Reviewer"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-primary text-sm">
                            Reader{index + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <ApperIcon
                                key={i}
                                name="Star"
                                size={12}
                                className={i < 4 ? "text-warning fill-current" : "text-primary/20"}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-primary/70 text-sm">
                          "This book absolutely captivated me from the first page. The characters are so well-developed and the plot kept me guessing until the very end. Highly recommend!"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="ghost" size="sm">
                  View All Reviews
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Book Details */}
            <Card variant="elevated">
              <h3 className="text-lg font-serif font-semibold text-primary mb-3">
                Book Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary/70">ISBN:</span>
                  <span className="text-primary">{book.isbn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary/70">Pages:</span>
                  <span className="text-primary">{book.pageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary/70">Published:</span>
                  <span className="text-primary">
                    {new Date(book.publishedDate).getFullYear()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary/70">Rating:</span>
                  <span className="text-primary">{book.communityRating}/5</span>
                </div>
              </div>
            </Card>
            
            {/* Similar Books */}
            <Card variant="elevated">
              <h3 className="text-lg font-serif font-semibold text-primary mb-3">
                Similar Books
              </h3>
              <div className="space-y-3">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-surface/50 rounded-lg cursor-pointer">
                    <img
                      src={`/api/placeholder/40/60`}
                      alt="Similar book"
                      className="w-8 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary text-sm line-clamp-1">
                        Similar Book {index + 1}
                      </p>
                      <p className="text-primary/60 text-xs">
                        Author Name
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Book Clubs */}
            <Card variant="elevated">
              <h3 className="text-lg font-serif font-semibold text-primary mb-3">
                Reading This Book
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <ApperIcon name="Users" size={16} className="text-primary/60" />
                  <span className="text-primary/70">
                    3 book clubs are reading this
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ApperIcon name="BookOpen" size={16} className="text-primary/60" />
                  <span className="text-primary/70">
                    142 readers have added this book
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/clubs")}
                className="mt-3 w-full"
              >
                Find Book Clubs
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;