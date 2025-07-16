import usersData from "@/services/mockData/users.json";

class UserService {
  constructor() {
    this.users = [...usersData];
    this.currentUser = this.users[0]; // Mock current user
  }
  
  async getCurrentUser() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...this.currentUser });
      }, 200);
    });
  }
  
  async getUserById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.users.find(u => u.Id === parseInt(id));
        resolve(user ? { ...user } : null);
      }, 200);
    });
  }
  
  async updateProfile(userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        Object.assign(this.currentUser, userData);
        resolve({ success: true, user: { ...this.currentUser } });
      }, 300);
    });
  }
  
  async getReadingStats(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          booksRead: 47,
          currentlyReading: 3,
          wantToRead: 23,
          clubsJoined: 5,
          discussionsStarted: 12,
          commentsPosted: 89,
        };
        resolve(stats);
      }, 300);
    });
  }
  
  async getRecentActivity(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const activities = [
          {
            Id: 1,
            type: "book_finished",
            title: "Finished reading",
            description: "The Seven Husbands of Evelyn Hugo",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            Id: 2,
            type: "discussion_posted",
            title: "Posted in Fantasy Lovers",
            description: "What did you think of the ending?",
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          },
          {
            Id: 3,
            type: "club_joined",
            title: "Joined Romance Readers",
            description: "New member in the club",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          },
        ];
        resolve(activities);
      }, 300);
    });
  }
}

export default new UserService();