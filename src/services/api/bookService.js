import { toast } from "react-toastify";

class BookService {
  constructor() {
    this.tableName = "book";
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
          { field: { Name: "author" } },
          { field: { Name: "cover" } },
          { field: { Name: "isbn" } },
          { field: { Name: "genres" } },
          { field: { Name: "community_rating" } },
          { field: { Name: "description" } },
          { field: { Name: "published_date" } },
          { field: { Name: "page_count" } }
        ],
        orderBy: [
          { fieldName: "community_rating", sorttype: "DESC" }
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
      console.error("Error fetching books:", error);
      toast.error("Failed to fetch books");
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
          { field: { Name: "author" } },
          { field: { Name: "cover" } },
          { field: { Name: "isbn" } },
          { field: { Name: "genres" } },
          { field: { Name: "community_rating" } },
          { field: { Name: "description" } },
          { field: { Name: "published_date" } },
          { field: { Name: "page_count" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching book with ID ${id}:`, error);
      return null;
    }
  }
  
  async search(query, filters = {}) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "author" } },
          { field: { Name: "cover" } },
          { field: { Name: "isbn" } },
          { field: { Name: "genres" } },
          { field: { Name: "community_rating" } },
          { field: { Name: "description" } },
          { field: { Name: "published_date" } },
          { field: { Name: "page_count" } }
        ],
        where: [],
        orderBy: [
          { fieldName: "community_rating", sorttype: "DESC" }
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
                { fieldName: "title", operator: "Contains", values: [query] },
                { fieldName: "author", operator: "Contains", values: [query] },
                { fieldName: "genres", operator: "Contains", values: [query] }
              ]
            }
          ]
        }];
      }
      
      // Add genre filter
      if (filters.genre && filters.genre !== "all") {
        const genreFilter = {
          fieldName: "genres",
          Operator: "Contains",
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
      
      // Add rating filter
      if (filters.rating) {
        const ratingFilter = {
          fieldName: "community_rating",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.rating]
        };
        
        if (params.whereGroups) {
          params.whereGroups[0].subGroups.push({
            operator: "AND",
            conditions: [ratingFilter]
          });
        } else {
          params.where.push(ratingFilter);
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
      console.error("Error searching books:", error);
      toast.error("Failed to search books");
      return [];
    }
  }
  
  async getRecommendations(userId) {
    // For now, return trending books as recommendations
    return this.getTrending();
  }
  
  async getTrending() {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "author" } },
          { field: { Name: "cover" } },
          { field: { Name: "isbn" } },
          { field: { Name: "genres" } },
          { field: { Name: "community_rating" } },
          { field: { Name: "description" } },
          { field: { Name: "published_date" } },
          { field: { Name: "page_count" } }
        ],
        orderBy: [
          { fieldName: "community_rating", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 10, offset: 0 }
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching trending books:", error);
      toast.error("Failed to fetch trending books");
      return [];
    }
  }
}

export default new BookService();