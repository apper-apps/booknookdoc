class ImageService {
  constructor() {
    this.images = [
      {
        Id: 1,
        url: "/api/placeholder/400/300",
        caption: "My current reading setup! So cozy ✨",
        userId: "user1",
        type: "shelfie",
        tags: ["books", "reading", "cozy"],
        bookTags: [1, 3],
        likes: 45,
        comments: [],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        Id: 2,
        url: "/api/placeholder/400/300",
        caption: "Look at this beautiful quote from ACOTAR! 💕",
        userId: "user2",
        type: "quote",
        tags: ["acotar", "quotes", "fantasy"],
        bookTags: [2],
        likes: 89,
        comments: [],
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.images]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const image = this.images.find(img => img.Id === parseInt(id));
        resolve(image ? { ...image } : null);
      }, 200);
    });
  }

  async getByUserId(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userImages = this.images.filter(img => img.userId === userId);
        resolve(userImages);
      }, 300);
    });
  }

  async getByBookId(bookId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bookImages = this.images.filter(img => 
          img.bookTags && img.bookTags.includes(parseInt(bookId))
        );
        resolve(bookImages);
      }, 300);
    });
  }

  async upload(imageData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newImage = {
          ...imageData,
          Id: Math.max(...this.images.map(img => img.Id)) + 1,
          likes: 0,
          comments: [],
          createdAt: new Date().toISOString()
        };
        this.images.push(newImage);
        resolve({ success: true, image: newImage });
      }, 1000); // Simulate upload time
    });
  }

  async update(id, imageData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.images.findIndex(img => img.Id === parseInt(id));
        if (index !== -1) {
          this.images[index] = { ...this.images[index], ...imageData };
          resolve({ success: true, image: this.images[index] });
        } else {
          resolve({ success: false, error: "Image not found" });
        }
      }, 300);
    });
  }

  async delete(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.images.findIndex(img => img.Id === parseInt(id));
        if (index !== -1) {
          this.images.splice(index, 1);
          resolve({ success: true });
        } else {
          resolve({ success: false, error: "Image not found" });
        }
      }, 300);
    });
  }

  async like(id, userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const image = this.images.find(img => img.Id === parseInt(id));
        if (image) {
          image.likes += 1;
          resolve({ success: true, likes: image.likes });
        } else {
          resolve({ success: false, error: "Image not found" });
        }
      }, 200);
    });
  }

  async addComment(id, commentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const image = this.images.find(img => img.Id === parseInt(id));
        if (image) {
          const newComment = {
            ...commentData,
            Id: Date.now(),
            createdAt: new Date().toISOString()
          };
          image.comments.push(newComment);
          resolve({ success: true, comment: newComment });
        } else {
          resolve({ success: false, error: "Image not found" });
        }
      }, 300);
    });
  }

  async search(query, filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...this.images];
        
        if (query) {
          const searchTerm = query.toLowerCase();
          results = results.filter(image => 
            image.caption.toLowerCase().includes(searchTerm) ||
            image.tags.some(tag => tag.toLowerCase().includes(searchTerm))
          );
        }
        
        if (filters.type && filters.type !== "all") {
          results = results.filter(image => image.type === filters.type);
        }
        
        if (filters.userId) {
          results = results.filter(image => image.userId === filters.userId);
        }
        
        if (filters.bookId) {
          results = results.filter(image => 
            image.bookTags && image.bookTags.includes(parseInt(filters.bookId))
          );
        }
        
        resolve(results);
      }, 400);
    });
  }

  async getFeed(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock feed based on followed users
        const feed = [...this.images]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 20);
        resolve(feed);
      }, 300);
    });
  }
}

export default new ImageService();