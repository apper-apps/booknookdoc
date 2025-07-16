import { toast } from "react-toastify";

class ClubService {
  constructor() {
    this.tableName = "club";
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
          { field: { Name: "description" } },
          { field: { Name: "cover_image" } },
          { field: { Name: "member_count" } },
          { field: { Name: "current_book" } },
          { field: { Name: "genre" } },
          { field: { Name: "created_at" } },
          { field: { Name: "moderators" } }
        ],
        orderBy: [
          { fieldName: "member_count", sorttype: "DESC" }
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
      console.error("Error fetching clubs:", error);
      toast.error("Failed to fetch clubs");
      return [];
    }
  }
  
  async getById(id) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "cover_image" } },
          { field: { Name: "member_count" } },
          { field: { Name: "current_book" } },
          { field: { Name: "genre" } },
          { field: { Name: "created_at" } },
          { field: { Name: "moderators" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching club with ID ${id}:`, error);
      return null;
    }
  }
  
  async getJoinedClubs(userId) {
    // For now, return top 3 clubs - in a real app, you'd have a membership table
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "cover_image" } },
          { field: { Name: "member_count" } },
          { field: { Name: "current_book" } },
          { field: { Name: "genre" } }
        ],
        pagingInfo: { limit: 3, offset: 0 }
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching joined clubs:", error);
      return [];
    }
  }
  
  async joinClub(clubId, userId) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      // First get the current club data
      const club = await this.getById(clubId);
      if (!club) {
        return { success: false, error: "Club not found" };
      }
      
      // Update member count
      const params = {
        records: [{
          Id: parseInt(clubId),
          member_count: (club.member_count || 0) + 1
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false, error: response.message };
      }
      
      toast.success("Successfully joined the club!");
      return { success: true, club: response.results[0]?.data };
    } catch (error) {
      console.error("Error joining club:", error);
      toast.error("Failed to join club");
      return { success: false, error: error.message };
    }
  }
  
  async leaveClub(clubId, userId) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      // First get the current club data
      const club = await this.getById(clubId);
      if (!club) {
        return { success: false, error: "Club not found" };
      }
      
      // Update member count
      const params = {
        records: [{
          Id: parseInt(clubId),
          member_count: Math.max(0, (club.member_count || 0) - 1)
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false, error: response.message };
      }
      
      toast.success("Successfully left the club!");
      return { success: true, club: response.results[0]?.data };
    } catch (error) {
      console.error("Error leaving club:", error);
      toast.error("Failed to leave club");
      return { success: false, error: error.message };
    }
  }
  
  async search(query, filters = {}) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "cover_image" } },
          { field: { Name: "member_count" } },
          { field: { Name: "current_book" } },
          { field: { Name: "genre" } }
        ],
        where: [],
        orderBy: [
          { fieldName: "member_count", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 50, offset: 0 }
      };
      
      // Add search query filter
      if (query) {
        params.whereGroups = [{
          operator: "OR",
          subGroups: [
            {
              operator: "OR",
              conditions: [
                { fieldName: "Name", operator: "Contains", values: [query] },
                { fieldName: "description", operator: "Contains", values: [query] },
                { fieldName: "current_book", operator: "Contains", values: [query] }
              ]
            }
          ]
        }];
      }
      
      // Add genre filter
      if (filters.genre && filters.genre !== "all") {
        const genreFilter = {
          fieldName: "genre",
          Operator: "EqualTo",
          Values: [filters.genre]
        };
        
        if (params.whereGroups) {
          params.whereGroups[0].subGroups.push({
            operator: "AND",
            conditions: [genreFilter]
          });
        } else {
          params.where.push(genreFilter);
        }
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching clubs:", error);
      toast.error("Failed to search clubs");
      return [];
    }
  }
  
  async create(clubData) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        records: [{
          Name: clubData.name,
          description: clubData.description,
          cover_image: clubData.coverImage || "/api/placeholder/400/200",
          member_count: 1,
          current_book: clubData.currentBook || "",
          genre: clubData.genre,
          moderators: clubData.moderators || "",
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
          console.error(`Failed to create ${failedCreations.length} clubs:${JSON.stringify(failedCreations)}`);
          
          failedCreations.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulCreations.length > 0) {
          toast.success("Club created successfully!");
          return { success: true, club: successfulCreations[0].data };
        }
      }
      
      return { success: false, error: "Failed to create club" };
    } catch (error) {
      console.error("Error creating club:", error);
      toast.error("Failed to create club");
      return { success: false, error: error.message };
    }
  }
}

export default new ClubService();