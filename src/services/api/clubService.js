import clubsData from "@/services/mockData/clubs.json";

class ClubService {
  constructor() {
    this.clubs = [...clubsData];
  }
  
  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.clubs]);
      }, 300);
    });
  }
  
  async getById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const club = this.clubs.find(c => c.Id === parseInt(id));
        resolve(club ? { ...club } : null);
      }, 200);
    });
  }
  
  async getJoinedClubs(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock joined clubs - return first 3 clubs
        const joinedClubs = this.clubs.slice(0, 3);
        resolve(joinedClubs);
      }, 300);
    });
  }
  
  async joinClub(clubId, userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const club = this.clubs.find(c => c.Id === parseInt(clubId));
        if (club) {
          club.memberCount += 1;
          resolve({ success: true, club: { ...club } });
        } else {
          resolve({ success: false, error: "Club not found" });
        }
      }, 200);
    });
  }
  
  async leaveClub(clubId, userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const club = this.clubs.find(c => c.Id === parseInt(clubId));
        if (club) {
          club.memberCount = Math.max(0, club.memberCount - 1);
          resolve({ success: true, club: { ...club } });
        } else {
          resolve({ success: false, error: "Club not found" });
        }
      }, 200);
    });
  }
  
  async search(query, filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...this.clubs];
        
        if (query) {
          const searchTerm = query.toLowerCase();
          results = results.filter(club => 
            club.name.toLowerCase().includes(searchTerm) ||
            club.description.toLowerCase().includes(searchTerm) ||
            club.currentBook?.toLowerCase().includes(searchTerm)
          );
        }
        
        if (filters.genre && filters.genre !== "all") {
          results = results.filter(club => 
            club.genre?.toLowerCase() === filters.genre.toLowerCase()
          );
        }
        
        resolve(results);
      }, 400);
    });
  }
  
  async create(clubData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newClub = {
          ...clubData,
          Id: Math.max(...this.clubs.map(c => c.Id)) + 1,
          memberCount: 1,
          discussions: [],
          createdAt: new Date().toISOString(),
        };
        this.clubs.push(newClub);
        resolve({ success: true, club: newClub });
      }, 300);
    });
  }
}

export default new ClubService();