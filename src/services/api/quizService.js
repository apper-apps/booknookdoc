class QuizService {
  constructor() {
    this.quizzes = [
      {
        Id: 1,
        title: "Which ACOTAR Character Are You?",
        description: "Discover your inner Court of Thorns and Roses character",
        category: "Character Match",
        difficulty: "Easy",
        timeLimit: 300,
        questions: 10,
        participants: 12500,
        image: "/api/placeholder/300/200",
        createdAt: new Date().toISOString(),
        createdBy: "user1"
      },
      {
        Id: 2,
        title: "The Hunger Games Trivia Challenge",
        description: "Test your knowledge of Panem and the rebellion",
        category: "Trivia",
        difficulty: "Hard",
        timeLimit: 600,
        questions: 15,
        participants: 8900,
        image: "/api/placeholder/300/200",
        createdAt: new Date().toISOString(),
        createdBy: "user2"
      }
    ];
    
    this.results = [];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.quizzes]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const quiz = this.quizzes.find(q => q.Id === parseInt(id));
        resolve(quiz ? { ...quiz } : null);
      }, 200);
    });
  }

  async getByCategory(category) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.quizzes.filter(q => 
          q.category.toLowerCase() === category.toLowerCase()
        );
        resolve(filtered);
      }, 300);
    });
  }

  async getBookQuizzes(bookId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bookQuizzes = this.quizzes.filter(q => 
          q.bookId === parseInt(bookId)
        );
        resolve(bookQuizzes);
      }, 300);
    });
  }

  async getRecommendationQuizzes() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const recQuizzes = this.quizzes.filter(q => 
          q.category === "Recommendation" || q.category === "Personality"
        );
        resolve(recQuizzes);
      }, 300);
    });
  }

  async submitQuiz(quizId, answers) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = {
          Id: Date.now(),
          quizId: parseInt(quizId),
          userId: "user1",
          answers,
          score: Math.floor(Math.random() * 40) + 60, // 60-100%
          completedAt: new Date().toISOString(),
          timeSpent: Math.floor(Math.random() * 300) + 60 // 1-5 minutes
        };
        
        this.results.push(result);
        resolve({ success: true, result });
      }, 500);
    });
  }

  async getUserResults(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userResults = this.results.filter(r => r.userId === userId);
        resolve(userResults);
      }, 300);
    });
  }

  async create(quizData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newQuiz = {
          ...quizData,
          Id: Math.max(...this.quizzes.map(q => q.Id)) + 1,
          participants: 0,
          createdAt: new Date().toISOString(),
          createdBy: "user1"
        };
        this.quizzes.push(newQuiz);
        resolve({ success: true, quiz: newQuiz });
      }, 300);
    });
  }

  async update(id, quizData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.quizzes.findIndex(q => q.Id === parseInt(id));
        if (index !== -1) {
          this.quizzes[index] = { ...this.quizzes[index], ...quizData };
          resolve({ success: true, quiz: this.quizzes[index] });
        } else {
          resolve({ success: false, error: "Quiz not found" });
        }
      }, 300);
    });
  }

  async delete(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.quizzes.findIndex(q => q.Id === parseInt(id));
        if (index !== -1) {
          this.quizzes.splice(index, 1);
          resolve({ success: true });
        } else {
          resolve({ success: false, error: "Quiz not found" });
        }
      }, 300);
    });
  }

  async search(query, filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...this.quizzes];
        
        if (query) {
          const searchTerm = query.toLowerCase();
          results = results.filter(quiz => 
            quiz.title.toLowerCase().includes(searchTerm) ||
            quiz.description.toLowerCase().includes(searchTerm) ||
            quiz.category.toLowerCase().includes(searchTerm)
          );
        }
        
        if (filters.category && filters.category !== "all") {
          results = results.filter(quiz => 
            quiz.category.toLowerCase() === filters.category.toLowerCase()
          );
        }
        
        if (filters.difficulty && filters.difficulty !== "all") {
          results = results.filter(quiz => 
            quiz.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
          );
        }
        
        resolve(results);
      }, 400);
    });
  }
}

export default new QuizService();