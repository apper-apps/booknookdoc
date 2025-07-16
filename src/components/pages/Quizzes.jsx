import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const Quizzes = () => {
  const navigate = useNavigate();
  
  const bookQuizzes = [
    {
      id: 1,
      title: "Which ACOTAR Character Are You?",
      description: "Discover your inner Court of Thorns and Roses character",
      image: "/api/placeholder/300/200",
      participants: 12500,
      category: "Character Match",
      difficulty: "Easy",
      time: "5 min"
    },
    {
      id: 2,
      title: "The Hunger Games Trivia Challenge",
      description: "Test your knowledge of Panem and the rebellion",
      image: "/api/placeholder/300/200",
      participants: 8900,
      category: "Trivia",
      difficulty: "Hard",
      time: "10 min"
    },
    {
      id: 3,
      title: "Harry Potter House Sorting Quiz",
      description: "Find your true Hogwarts house with this detailed quiz",
      image: "/api/placeholder/300/200",
      participants: 25000,
      category: "House Sorting",
      difficulty: "Medium",
      time: "8 min"
    },
    {
      id: 4,
      title: "Throne of Glass Knowledge Test",
      description: "How well do you know Celaena's journey?",
      image: "/api/placeholder/300/200",
      participants: 5600,
      category: "Trivia",
      difficulty: "Expert",
      time: "15 min"
    }
  ];

  const recommendationQuizzes = [
    {
      id: 5,
      title: "What Should You Read Based on Your Coffee Order?",
      description: "Your coffee preferences reveal your perfect book match",
      image: "/api/placeholder/300/200",
      participants: 18700,
      category: "Recommendation",
      difficulty: "Easy",
      time: "3 min"
    },
    {
      id: 6,
      title: "Find Your Romance Trope",
      description: "Discover which romance trope describes your love life",
      image: "/api/placeholder/300/200",
      participants: 15400,
      category: "Recommendation",
      difficulty: "Easy",
      time: "5 min"
    },
    {
      id: 7,
      title: "Your Reading Personality",
      description: "What type of reader are you? Take our personality quiz",
      image: "/api/placeholder/300/200",
      participants: 22100,
      category: "Personality",
      difficulty: "Medium",
      time: "10 min"
    },
    {
      id: 8,
      title: "Mood-Based Book Recommender",
      description: "Tell us your mood and we'll find your perfect read",
      image: "/api/placeholder/300/200",
      participants: 13200,
      category: "Recommendation",
      difficulty: "Easy",
      time: "4 min"
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const categories = [
    { id: "all", label: "All Quizzes", count: bookQuizzes.length + recommendationQuizzes.length },
    { id: "book", label: "Book Quizzes", count: bookQuizzes.length },
    { id: "recommendation", label: "Recommendations", count: recommendationQuizzes.length },
    { id: "trivia", label: "Trivia", count: bookQuizzes.filter(q => q.category === "Trivia").length },
    { id: "personality", label: "Personality", count: recommendationQuizzes.filter(q => q.category === "Personality").length }
  ];

  const getFilteredQuizzes = () => {
    const allQuizzes = [...bookQuizzes, ...recommendationQuizzes];
    
    if (selectedCategory === "all") return allQuizzes;
    if (selectedCategory === "book") return bookQuizzes;
    if (selectedCategory === "recommendation") return recommendationQuizzes;
    if (selectedCategory === "trivia") return allQuizzes.filter(q => q.category === "Trivia");
    if (selectedCategory === "personality") return allQuizzes.filter(q => q.category === "Personality");
    
    return allQuizzes;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "success";
      case "medium": return "warning";
      case "hard": return "error";
      case "expert": return "accent";
      default: return "default";
    }
  };

  const handleTakeQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleCreateQuiz = () => {
    toast.info("Create your own quiz feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <Card variant="elevated" className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif font-bold text-primary">
              Book Quizzes
            </h1>
            <p className="text-primary/70">
              Test your knowledge, discover new books, and find your literary personality
            </p>
          </div>
        </Card>

        {/* Categories */}
        <Card variant="elevated">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "primary" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.label}
                <Badge variant="secondary" size="xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </Card>

        {/* Popular Quizzes */}
        <Card variant="elevated">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-semibold text-primary">
              Popular This Week
            </h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getFilteredQuizzes().slice(0, 4).map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="interactive" className="group">
                  <div className="space-y-3">
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={quiz.image}
                        alt={quiz.title}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge 
                          variant={getDifficultyColor(quiz.difficulty)} 
                          size="xs"
                        >
                          {quiz.difficulty}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-serif font-semibold text-primary text-sm line-clamp-2">
                        {quiz.title}
                      </h3>
                      <p className="text-primary/70 text-xs line-clamp-2">
                        {quiz.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-primary/60">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Clock" size={12} />
                        <span>{quiz.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Users" size={12} />
                        <span>{quiz.participants.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleTakeQuiz(quiz.id)}
                      className="w-full"
                    >
                      Take Quiz
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* All Quizzes */}
        <Card variant="elevated">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-semibold text-primary">
              All Quizzes
            </h2>
            <Button variant="accent" size="sm" onClick={handleCreateQuiz}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Create Quiz
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredQuizzes().map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="interactive" className="group">
                  <div className="space-y-3">
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={quiz.image}
                        alt={quiz.title}
                        className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge 
                          variant={getDifficultyColor(quiz.difficulty)} 
                          size="xs"
                        >
                          {quiz.difficulty}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="default" size="xs">
                          {quiz.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-serif font-semibold text-primary text-sm line-clamp-2">
                        {quiz.title}
                      </h3>
                      <p className="text-primary/70 text-xs line-clamp-2">
                        {quiz.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-primary/60">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Clock" size={12} />
                        <span>{quiz.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Users" size={12} />
                        <span>{quiz.participants.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleTakeQuiz(quiz.id)}
                      className="w-full"
                    >
                      Take Quiz
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Create Your Own Quiz CTA */}
        <Card variant="elevated" className="text-center bg-gradient-to-r from-accent/5 to-pink-500/5">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-accent/20 to-pink-500/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Lightbulb" size={32} className="text-accent" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-semibold text-primary">
                Create Your Own Quiz
              </h3>
              <p className="text-primary/70">
                Share your favorite books with the community by creating fun, engaging quizzes that test knowledge or recommend new reads!
              </p>
            </div>
            <Button
              variant="accent"
              size="lg"
              onClick={handleCreateQuiz}
            >
              <ApperIcon name="Plus" size={20} className="mr-2" />
              Start Creating
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Quizzes;