import { toast } from "react-toastify";

class ReadingListService {
  constructor() {
    this.tableName = "reading_list";
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
  
  async getUserLists(userId) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "user_id" } },
          { field: { Name: "book_id" } },
          { field: { Name: "status" } },
          { field: { Name: "progress" } },
          { field: { Name: "start_date" } },
          { field: { Name: "finish_date" } },
          { field: { Name: "created_at" } }
        ],
        where: [
          { fieldName: "user_id", Operator: "EqualTo", Values: [parseInt(userId)] }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching user lists:", error);
      toast.error("Failed to fetch reading lists");
      return [];
    }
  }
  
  async getListByStatus(userId, status) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "user_id" } },
          { field: { Name: "book_id" } },
          { field: { Name: "status" } },
          { field: { Name: "progress" } },
          { field: { Name: "start_date" } },
          { field: { Name: "finish_date" } },
          { field: { Name: "created_at" } }
        ],
        where: [
          { fieldName: "user_id", Operator: "EqualTo", Values: [parseInt(userId)] },
          { fieldName: "status", Operator: "EqualTo", Values: [status] }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching lists by status:", error);
      toast.error("Failed to fetch reading lists");
      return [];
    }
  }
  
  async addToList(userId, bookId, status) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      // First check if entry already exists
      const existingLists = await this.getUserLists(userId);
      const existingEntry = existingLists.find(item => 
        item.user_id === parseInt(userId) && item.book_id === parseInt(bookId)
      );
      
      if (existingEntry) {
        // Update existing entry
        return this.updateStatus(userId, bookId, status);
      }
      
      // Create new entry
      const params = {
        records: [{
          Name: `Reading List Entry ${Date.now()}`,
          user_id: parseInt(userId),
          book_id: parseInt(bookId),
          status: status,
          progress: status === "currently-reading" ? 0 : status === "finished" ? 100 : 0,
          start_date: status === "currently-reading" ? new Date().toISOString() : null,
          finish_date: status === "finished" ? new Date().toISOString() : null,
          created_at: new Date().toISOString()
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
          console.error(`Failed to create ${failedCreations.length} reading list entries:${JSON.stringify(failedCreations)}`);
          
          failedCreations.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulCreations.length > 0) {
          toast.success("Added to reading list successfully!");
          return { success: true, entry: successfulCreations[0].data };
        }
      }
      
      return { success: false, error: "Failed to add to reading list" };
    } catch (error) {
      console.error("Error adding to reading list:", error);
      toast.error("Failed to add to reading list");
      return { success: false, error: error.message };
    }
  }
  
  async removeFromList(userId, bookId) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      // First find the entry
      const existingLists = await this.getUserLists(userId);
      const entryToRemove = existingLists.find(item => 
        item.user_id === parseInt(userId) && item.book_id === parseInt(bookId)
      );
      
      if (!entryToRemove) {
        return { success: false, error: "Entry not found" };
      }
      
      const params = {
        RecordIds: [entryToRemove.Id]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false, error: response.message };
      }
      
      toast.success("Removed from reading list successfully!");
      return { success: true };
    } catch (error) {
      console.error("Error removing from reading list:", error);
      toast.error("Failed to remove from reading list");
      return { success: false, error: error.message };
    }
  }
  
  async updateProgress(userId, bookId, progress) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      // First find the entry
      const existingLists = await this.getUserLists(userId);
      const entryToUpdate = existingLists.find(item => 
        item.user_id === parseInt(userId) && item.book_id === parseInt(bookId)
      );
      
      if (!entryToUpdate) {
        return { success: false, error: "Entry not found" };
      }
      
      const params = {
        records: [{
          Id: entryToUpdate.Id,
          progress: progress,
          status: progress === 100 ? "finished" : entryToUpdate.status,
          finish_date: progress === 100 ? new Date().toISOString() : entryToUpdate.finish_date
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false, error: response.message };
      }
      
      toast.success("Progress updated successfully!");
      return { success: true, entry: response.results[0]?.data };
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress");
      return { success: false, error: error.message };
    }
  }
  
  async updateStatus(userId, bookId, status) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      // First find the entry
      const existingLists = await this.getUserLists(userId);
      const entryToUpdate = existingLists.find(item => 
        item.user_id === parseInt(userId) && item.book_id === parseInt(bookId)
      );
      
      if (!entryToUpdate) {
        return { success: false, error: "Entry not found" };
      }
      
      const params = {
        records: [{
          Id: entryToUpdate.Id,
          status: status,
          progress: status === "currently-reading" ? 0 : status === "finished" ? 100 : 0,
          start_date: status === "currently-reading" ? new Date().toISOString() : entryToUpdate.start_date,
          finish_date: status === "finished" ? new Date().toISOString() : null
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false, error: response.message };
      }
      
      toast.success("Status updated successfully!");
      return { success: true, entry: response.results[0]?.data };
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
      return { success: false, error: error.message };
    }
  }
  
  async markAsFinished(userId, bookId) {
    return this.updateStatus(userId, bookId, "finished");
  }
}

export default new ReadingListService();