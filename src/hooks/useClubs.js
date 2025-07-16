import { useState, useEffect } from "react";
import clubService from "@/services/api/clubService";

export const useClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const loadClubs = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await clubService.getAll();
      setClubs(data);
    } catch (err) {
      setError("Failed to load clubs. Please try again.");
      console.error("Error loading clubs:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const joinClub = async (clubId, userId = "user1") => {
    try {
      setError("");
      const result = await clubService.joinClub(clubId, userId);
      if (result.success) {
        setClubs(clubs.map(club => 
          club.Id === clubId ? result.club : club
        ));
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to join club. Please try again.");
      console.error("Error joining club:", err);
      return false;
    }
  };
  
  const leaveClub = async (clubId, userId = "user1") => {
    try {
      setError("");
      const result = await clubService.leaveClub(clubId, userId);
      if (result.success) {
        setClubs(clubs.map(club => 
          club.Id === clubId ? result.club : club
        ));
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to leave club. Please try again.");
      console.error("Error leaving club:", err);
      return false;
    }
  };
  
  const searchClubs = async (query, filters = {}) => {
    try {
      setLoading(true);
      setError("");
      const data = await clubService.search(query, filters);
      setClubs(data);
    } catch (err) {
      setError("Failed to search clubs. Please try again.");
      console.error("Error searching clubs:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const getJoinedClubs = async (userId = "user1") => {
    try {
      setLoading(true);
      setError("");
      const data = await clubService.getJoinedClubs(userId);
      setClubs(data);
    } catch (err) {
      setError("Failed to load joined clubs. Please try again.");
      console.error("Error loading joined clubs:", err);
    } finally {
      setLoading(false);
    }
  };
};
  
  const createClub = async (clubData) => {
    try {
      setError("");
      const result = await clubService.create(clubData);
      if (result.success) {
        setClubs([result.club, ...clubs]);
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to create club. Please try again.");
      console.error("Error creating club:", err);
      return false;
    }
  };
  
  useEffect(() => {
    loadClubs();
  }, []);
  
  return {
    clubs,
    loading,
    error,
    loadClubs,
    joinClub,
    leaveClub,
    searchClubs,
    getJoinedClubs,
    createClub,
};