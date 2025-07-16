import readingListsData from "@/services/mockData/readingLists.json";

class ReadingListService {
  constructor() {
    this.readingLists = [...readingListsData];
  }
  
  async getUserLists(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userLists = this.readingLists.filter(item => item.userId === userId);
        resolve(userLists);
      }, 300);
    });
  }
  
  async getListByStatus(userId, status) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const statusLists = this.readingLists.filter(item => 
          item.userId === userId && item.status === status
        );
        resolve(statusLists);
      }, 300);
    });
  }
  
  async addToList(userId, bookId, status) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Remove existing entry if it exists
        this.readingLists = this.readingLists.filter(item => 
          !(item.userId === userId && item.bookId === parseInt(bookId))
        );
        
        const newEntry = {
          Id: Math.max(...this.readingLists.map(item => item.Id)) + 1,
          userId,
          bookId: parseInt(bookId),
          status,
          progress: status === "currently-reading" ? 0 : status === "finished" ? 100 : 0,
          startDate: status === "currently-reading" ? new Date().toISOString() : null,
          finishDate: status === "finished" ? new Date().toISOString() : null,
          createdAt: new Date().toISOString(),
        };
        
        this.readingLists.push(newEntry);
        resolve({ success: true, entry: newEntry });
      }, 200);
    });
  }
  
  async removeFromList(userId, bookId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.readingLists = this.readingLists.filter(item => 
          !(item.userId === userId && item.bookId === parseInt(bookId))
        );
        resolve({ success: true });
      }, 200);
    });
  }
  
  async updateProgress(userId, bookId, progress) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const entry = this.readingLists.find(item => 
          item.userId === userId && item.bookId === parseInt(bookId)
        );
        
        if (entry) {
          entry.progress = progress;
          if (progress === 100) {
            entry.status = "finished";
            entry.finishDate = new Date().toISOString();
          }
          resolve({ success: true, entry });
        } else {
          resolve({ success: false, error: "Entry not found" });
        }
      }, 200);
    });
  }
  
  async markAsFinished(userId, bookId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const entry = this.readingLists.find(item => 
          item.userId === userId && item.bookId === parseInt(bookId)
        );
        
        if (entry) {
          entry.status = "finished";
          entry.progress = 100;
          entry.finishDate = new Date().toISOString();
          resolve({ success: true, entry });
        } else {
          resolve({ success: false, error: "Entry not found" });
        }
      }, 200);
    });
  }
}

export default new ReadingListService();