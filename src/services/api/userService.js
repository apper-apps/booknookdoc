import { toast } from "react-toastify";

class UserService {
  constructor() {
    this.tableName = "app_User";
    this.apperClient = null;
    this.initializeClient();
  }
  
  initializeClient() {
    if (window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }
  
  async getCurrentUser() {
    // Return the first user as mock current user
    return this.getUserById(1);
  }
  
  async getUserById(id) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username" } },
          { field: { Name: "email" } },
          { field: { Name: "avatar" } },
          { field: { Name: "bio" } },
          { field: { Name: "favorite_books" } },
          { field: { Name: "currently_reading" } },
          { field: { Name: "joined_clubs" } },
          { field: { Name: "favorite_genres" } },
          { field: { Name: "reading_goal" } },
          { field: { Name: "books_read_this_year" } },
          { field: { Name: "joined_at" } },
          { field: { Name: "preferences" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      return null;
    }
  }
  
  async updateProfile(userData) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        records: [{
          Id: userData.Id || 1, // Default to user 1 if no ID provided
          Name: userData.name,
          username: userData.username,
          email: userData.email,
          avatar: userData.avatar,
          bio: userData.bio,
          favorite_books: userData.favoriteBooks,
          currently_reading: userData.currentlyReading,
          joined_clubs: userData.joinedClubs,
          favorite_genres: userData.favoriteGenres ? userData.favoriteGenres.join(',') : '',
          reading_goal: userData.readingGoal,
          books_read_this_year: userData.booksReadThisYear,
          preferences: userData.preferences ? JSON.stringify(userData.preferences) : ''
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false, error: response.message };
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} user profiles:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Profile updated successfully!");
          return { success: true, user: successfulUpdates[0].data };
        }
      }
      
      return { success: false, error: "Failed to update profile" };
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      return { success: false, error: error.message };
    }
  }
  
  async getReadingStats(userId) {
    // Mock stats - in a real app, these would be calculated from reading lists and activities
    return {
      booksRead: 47,
      currentlyReading: 3,
      wantToRead: 23,
      clubsJoined: 5,
      discussionsStarted: 12,
      commentsPosted: 89,
    };
  }
  
  async getRecentActivity(userId) {
    // Mock activity - in a real app, this would come from an activities table
    return [
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
  }
  
  async followUser(userId, targetUserId) {
    // Mock follow functionality
    toast.success("User followed successfully!");
    return { success: true, message: "User followed successfully" };
  }
  
  async unfollowUser(userId, targetUserId) {
    // Mock unfollow functionality
    toast.success("User unfollowed successfully!");
    return { success: true, message: "User unfollowed successfully" };
  }
  
  async getFollowers(userId) {
    // Mock followers - in a real app, this would come from a followers table
    return [
      { Id: 2, username: "BookwormBella", avatar: "/api/placeholder/32/32" },
      { Id: 3, username: "FantasyFan", avatar: "/api/placeholder/32/32" },
      { Id: 4, username: "RomanceReader", avatar: "/api/placeholder/32/32" }
    ];
  }
  
  async getFollowing(userId) {
    // Mock following - in a real app, this would come from a following table
    return [
      { Id: 5, username: "BookClubHost", avatar: "/api/placeholder/32/32" },
      { Id: 6, username: "AuthorLife", avatar: "/api/placeholder/32/32" }
    ];
  }
  
  async getFeed(userId) {
    // Mock feed - in a real app, this would come from a feed/activities table
    return [
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
  }
}

export default new UserService();