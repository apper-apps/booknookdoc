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
  
  async followUser(userId, targetUserId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "User followed successfully" });
      }, 300);
    });
  }
  
  async unfollowUser(userId, targetUserId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "User unfollowed successfully" });
      }, 300);
    });
  }
  
  async getFollowers(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const followers = [
          { Id: 2, username: "BookwormBella", avatar: "/api/placeholder/32/32" },
          { Id: 3, username: "FantasyFan", avatar: "/api/placeholder/32/32" },
          { Id: 4, username: "RomanceReader", avatar: "/api/placeholder/32/32" }
        ];
        resolve(followers);
      }, 300);
    });
  }
  
  async getFollowing(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const following = [
          { Id: 5, username: "BookClubHost", avatar: "/api/placeholder/32/32" },
          { Id: 6, username: "AuthorLife", avatar: "/api/placeholder/32/32" }
        ];
        resolve(following);
      }, 300);
    });
  }
  
  async getFeed(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const feed = [
          {
            Id: 1,
            type: "book_review",
            user: { Id: 2, username: "BookwormBella", avatar: "/api/placeholder/32/32" },
            content: "Just finished reading The Seven Husbands of Evelyn Hugo and I'm crying! 😭✨",
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            likes: 23,
            comments: 5
          },
          {
            Id: 2,
            type: "club_join",
            user: { Id: 3, username: "FantasyFan", avatar: "/api/placeholder/32/32" },
            content: "joined the Fantasy Lovers book club",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            likes: 8,
            comments: 2
          }
        ];
        resolve(feed);
      }, 300);
    });
  }
}

export default new UserService();