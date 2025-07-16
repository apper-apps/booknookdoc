import booksData from "@/services/mockData/books.json";

class BookService {
  constructor() {
    this.books = [...booksData];
  }
  
  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.books]);
      }, 300);
    });
  }
  
  async getById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const book = this.books.find(b => b.Id === parseInt(id));
        resolve(book ? { ...book } : null);
      }, 200);
    });
  }
  
  async search(query, filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...this.books];
        
        if (query) {
          const searchTerm = query.toLowerCase();
          results = results.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.genres.some(genre => genre.toLowerCase().includes(searchTerm))
          );
        }
        
        if (filters.genre && filters.genre !== "all") {
          results = results.filter(book => 
            book.genres.some(genre => genre.toLowerCase() === filters.genre.toLowerCase())
          );
        }
        
        if (filters.rating) {
          results = results.filter(book => book.communityRating >= filters.rating);
        }
        
        resolve(results);
      }, 400);
    });
  }
  
  async getRecommendations(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock recommendation logic - return random books
        const shuffled = [...this.books].sort(() => 0.5 - Math.random());
        resolve(shuffled.slice(0, 6));
      }, 300);
    });
  }
  
  async getTrending() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock trending books - return highest rated books
        const trending = [...this.books]
          .sort((a, b) => (b.communityRating || 0) - (a.communityRating || 0))
          .slice(0, 10);
        resolve(trending);
      }, 300);
    });
  }
}

export default new BookService();