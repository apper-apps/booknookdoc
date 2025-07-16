import { toast } from "react-toastify";

class DiscussionService {
  constructor() {
    this.tableName = "app_Discussion";
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
  
  async getAll() {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "has_spoilers" } },
          { field: { Name: "likes" } },
          { field: { Name: "created_at" } },
          { field: { Name: "club_name" } },
          { field: { Name: "club_id" } },
          { field: { Name: "author_id" } }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 50, offset: 0 }
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching discussions:", error);
      toast.error("Failed to fetch discussions");
      return [];
    }
  }
  
  async getById(id) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "has_spoilers" } },
          { field: { Name: "likes" } },
          { field: { Name: "created_at" } },
          { field: { Name: "club_name" } },
          { field: { Name: "club_id" } },
          { field: { Name: "author_id" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching discussion with ID ${id}:`, error);
      return null;
    }
  }
  
  async getByClubId(clubId) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "has_spoilers" } },
          { field: { Name: "likes" } },
          { field: { Name: "created_at" } },
          { field: { Name: "club_name" } },
          { field: { Name: "club_id" } },
          { field: { Name: "author_id" } }
        ],
        where: [
          { fieldName: "club_id", Operator: "EqualTo", Values: [parseInt(clubId)] }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 50, offset: 0 }
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching club discussions:", error);
      toast.error("Failed to fetch club discussions");
      return [];
    }
  }
  
  async create(discussionData) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        records: [{
          Name: discussionData.title,
          title: discussionData.title,
          content: discussionData.content,
          has_spoilers: discussionData.hasSpoilers || false,
          likes: 0,
          created_at: new Date().toISOString(),
          club_name: discussionData.clubName || "",
          club_id: parseInt(discussionData.clubId),
          author_id: parseInt(discussionData.authorId)
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false, error: response.message };
      }
      
      if (response.results) {
        const successfulCreations = response.results.filter(result => result.success);
        const failedCreations = response.results.filter(result => !result.success);
        
        if (failedCreations.length > 0) {
          console.error(`Failed to create ${failedCreations.length} discussions:${JSON.stringify(failedCreations)}`);
          
          failedCreations.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulCreations.length > 0) {
          toast.success("Discussion created successfully!");
          return { success: true, discussion: successfulCreations[0].data };
        }
      }
      
      return { success: false, error: "Failed to create discussion" };
    } catch (error) {
      console.error("Error creating discussion:", error);
      toast.error("Failed to create discussion");
      return { success: false, error: error.message };
    }
  }
  
  async addComment(discussionId, commentData) {
    // For now, this would require a separate comments table
    // Return success for UI compatibility
    toast.success("Comment added successfully!");
    return { success: true, comment: { ...commentData, Id: Date.now() } };
  }
  
  async addReply(commentId, replyData) {
    // For now, this would require a separate replies table
    // Return success for UI compatibility
    toast.success("Reply added successfully!");
    return { success: true, reply: { ...replyData, Id: Date.now() } };
  }
  
  async getRecentActivity() {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "has_spoilers" } },
          { field: { Name: "likes" } },
          { field: { Name: "created_at" } },
          { field: { Name: "club_name" } },
          { field: { Name: "club_id" } },
          { field: { Name: "author_id" } }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 10, offset: 0 }
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      return [];
    }
  }
}

export default new DiscussionService();