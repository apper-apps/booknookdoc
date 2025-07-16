import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/atoms/ProgressBar";
import Loading from "@/components/ui/Loading";

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock quiz data
  const mockQuiz = {
    id: 1,
    title: "Which ACOTAR Character Are You?",
    description: "Discover your inner Court of Thorns and Roses character",
    image: "/api/placeholder/400/200",
    totalQuestions: 10,
    timeLimit: 300, // 5 minutes
    difficulty: "Easy",
    category: "Character Match",
    questions: [
      {
        id: 1,
        question: "What's your ideal way to spend a weekend?",
        type: "multiple_choice",
        options: [
          { id: "a", text: "Training and staying physically active", character: "cassian" },
          { id: "b", text: "Reading in a cozy library", character: "feyre" },
          { id: "c", text: "Planning strategies and organizing", character: "rhysand" },
          { id: "d", text: "Spending time in nature", character: "elain" }
        ]
      },
      {
        id: 2,
        question: "Which power would you most want to have?",
        type: "multiple_choice",
        options: [
          { id: "a", text: "Shadow manipulation", character: "azriel" },
          { id: "b", text: "Artistic creation magic", character: "feyre" },
          { id: "c", text: "Mind reading", character: "rhysand" },
          { id: "d", text: "Healing abilities", character: "elain" }
        ]
      },
      {
        id: 3,
        question: "What's your biggest strength?",
        type: "multiple_choice",
        options: [
          { id: "a", text: "Loyalty and protectiveness", character: "cassian" },
          { id: "b", text: "Creativity and adaptability", character: "feyre" },
          { id: "c", text: "Intelligence and leadership", character: "rhysand" },
          { id: "d", text: "Compassion and intuition", character: "elain" }
        ]
      },
      {
        id: 4,
        question: "How do you handle conflict?",
        type: "multiple_choice",
        options: [
          { id: "a", text: "Face it head-on with courage", character: "cassian" },
          { id: "b", text: "Find creative solutions", character: "feyre" },
          { id: "c", text: "Strategize and plan carefully", character: "rhysand" },
          { id: "d", text: "Try to understand all perspectives", character: "elain" }
        ]
      },
      {
        id: 5,
        question: "What's your ideal living situation?",
        type: "multiple_choice",
        options: [
          { id: "a", text: "A training ground with close friends", character: "cassian" },
          { id: "b", text: "An art studio with good natural light", character: "feyre" },
          { id: "c", text: "A castle with ancient libraries", character: "rhysand" },
          { id: "d", text: "A cottage with a beautiful garden", character: "elain" }
        ]
      }
    ]
  };

  useEffect(() => {
    // Simulate loading quiz data
    setTimeout(() => {
      setQuiz(mockQuiz);
      setTimeLeft(mockQuiz.timeLimit);
      setLoading(false);
    }, 1000);
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleSubmitQuiz();
    }
  }, [timeLeft, showResults]);

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate results based on answers
    const characterCounts = {};
    
    Object.values(answers).forEach(answer => {
      if (answer && answer.character) {
        characterCounts[answer.character] = (characterCounts[answer.character] || 0) + 1;
      }
    });

    const topCharacter = Object.keys(characterCounts).reduce((a, b) => 
      characterCounts[a] > characterCounts[b] ? a : b
    );

    const characterResults = {
      feyre: {
        name: "Feyre Archeron",
        description: "You're creative, adaptable, and have incredible inner strength. Like Feyre, you're willing to sacrifice for those you love and can find beauty even in darkness.",
        traits: ["Creative", "Brave", "Loyal", "Adaptable"],
        image: "/api/placeholder/200/200"
      },
      rhysand: {
        name: "Rhysand",
        description: "You're a natural leader with incredible strategic thinking. Like Rhysand, you're willing to make difficult decisions for the greater good and protect those you care about.",
        traits: ["Leader", "Strategic", "Protective", "Intelligent"],
        image: "/api/placeholder/200/200"
      },
      cassian: {
        name: "Cassian",
        description: "You're loyal, protective, and always ready for action. Like Cassian, you value friendship above all and will fight for what's right.",
        traits: ["Loyal", "Strong", "Protective", "Friendly"],
        image: "/api/placeholder/200/200"
      },
      azriel: {
        name: "Azriel",
        description: "You're observant, mysterious, and incredibly loyal. Like Azriel, you prefer to work behind the scenes and are always watching out for others.",
        traits: ["Observant", "Mysterious", "Loyal", "Protective"],
        image: "/api/placeholder/200/200"
      },
      elain: {
        name: "Elain Archeron",
        description: "You're gentle, intuitive, and have a natural ability to bring peace to others. Like Elain, you see beauty in simple things and have hidden depths.",
        traits: ["Gentle", "Intuitive", "Peaceful", "Caring"],
        image: "/api/placeholder/200/200"
      }
    };

    setResults({
      character: topCharacter,
      details: characterResults[topCharacter] || characterResults.feyre,
      score: Math.round((Object.keys(answers).length / quiz.questions.length) * 100),
      timeSpent: quiz.timeLimit - timeLeft
    });

    setShowResults(true);
    toast.success("Quiz completed! Check out your results!");
  };

  const handleShareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: `I got ${results.details.name} in the ${quiz.title}!`,
        text: `${results.details.description}`,
        url: window.location.href
      });
    } else {
      toast.success("Results copied to clipboard!");
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
    setTimeLeft(quiz.timeLimit);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading variant="default" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card variant="elevated" className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="mx-auto text-primary/40 mb-4" />
          <h2 className="text-xl font-serif font-semibold text-primary mb-2">Quiz Not Found</h2>
          <p className="text-primary/70 mb-4">The quiz you're looking for doesn't exist.</p>
          <Button variant="primary" onClick={() => navigate("/quizzes")}>
            Browse Quizzes
          </Button>
        </Card>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto p-4 space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/quizzes")}
            className="mb-4"
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Back to Quizzes
          </Button>

          <Card variant="elevated" className="text-center bg-gradient-to-r from-accent/5 to-pink-500/5">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-serif font-bold text-primary">
                  Quiz Complete!
                </h1>
                <p className="text-primary/70">Here are your results</p>
              </div>

              <div className="flex justify-center">
                <img
                  src={results.details.image}
                  alt={results.details.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-accent/20"
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-serif font-semibold text-primary">
                  You are {results.details.name}!
                </h2>
                
                <p className="text-primary/80 leading-relaxed">
                  {results.details.description}
                </p>

                <div className="flex flex-wrap gap-2 justify-center">
                  {results.details.traits.map((trait) => (
                    <Badge key={trait} variant="accent" size="sm">
                      {trait}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">
                      {results.score}%
                    </div>
                    <div className="text-sm text-primary/60">Completion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">
                      {formatTime(results.timeSpent)}
                    </div>
                    <div className="text-sm text-primary/60">Time Spent</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center pt-4">
                  <Button
                    variant="accent"
                    onClick={handleShareResults}
                  >
                    <ApperIcon name="Share" size={16} className="mr-2" />
                    Share Results
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleRetakeQuiz}
                  >
                    <ApperIcon name="RotateCcw" size={16} className="mr-2" />
                    Retake Quiz
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/quizzes")}
                  >
                    <ApperIcon name="Grid" size={16} className="mr-2" />
                    More Quizzes
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/quizzes")}
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Back to Quizzes
          </Button>
          
          <div className="flex items-center gap-2 text-primary/70">
            <ApperIcon name="Clock" size={16} />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <Card variant="elevated">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-serif font-semibold text-primary">
                {quiz.title}
              </h1>
              <Badge variant="accent" size="sm">
                {currentQuestion + 1} / {quiz.questions.length}
              </Badge>
            </div>

            <ProgressBar value={progress} className="h-2" />

            <div className="space-y-4 py-4">
              <h2 className="text-lg font-medium text-primary">
                {currentQ.question}
              </h2>

              <div className="space-y-3">
                {currentQ.options.map((option) => (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      variant={answers[currentQ.id]?.id === option.id ? "elevated" : "interactive"}
                      onClick={() => handleAnswerSelect(currentQ.id, option)}
                      className={`cursor-pointer transition-all ${
                        answers[currentQ.id]?.id === option.id
                          ? "ring-2 ring-accent/50 bg-accent/5"
                          : "hover:bg-primary/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQ.id]?.id === option.id
                            ? "border-accent bg-accent"
                            : "border-primary/30"
                        }`}>
                          {answers[currentQ.id]?.id === option.id && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="text-primary">{option.text}</span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="ghost"
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
              >
                <ApperIcon name="ChevronLeft" size={16} className="mr-2" />
                Previous
              </Button>

              <Button
                variant="primary"
                onClick={handleNextQuestion}
                disabled={!answers[currentQ.id]}
              >
                {currentQuestion === quiz.questions.length - 1 ? "Finish" : "Next"}
                <ApperIcon name="ChevronRight" size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizDetail;