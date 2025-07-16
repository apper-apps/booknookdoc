import { useState, useEffect } from "react";
import discussionService from "@/services/api/discussionService";

export const useDiscussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const loadDiscussions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await discussionService.getAll();
      setDiscussions(data);
    } catch (err) {
      setError("Failed to load discussions. Please try again.");
      console.error("Error loading discussions:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const getClubDiscussions = async (clubId) => {
    try {
      setLoading(true);
      setError("");
      const data = await discussionService.getByClubId(clubId);
      setDiscussions(data);
    } catch (err) {
      setError("Failed to load club discussions. Please try again.");
      console.error("Error loading club discussions:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const getRecentActivity = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await discussionService.getRecentActivity();
      setDiscussions(data);
    } catch (err) {
      setError("Failed to load recent activity. Please try again.");
      console.error("Error loading recent activity:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const createDiscussion = async (discussionData) => {
    try {
      setError("");
      const result = await discussionService.create(discussionData);
      if (result.success) {
        setDiscussions([result.discussion, ...discussions]);
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to create discussion. Please try again.");
      console.error("Error creating discussion:", err);
      return false;
    }
  };
  
  const addComment = async (discussionId, commentData) => {
    try {
      setError("");
      const result = await discussionService.addComment(discussionId, commentData);
      if (result.success) {
        setDiscussions(discussions.map(discussion => 
          discussion.Id === parseInt(discussionId) 
            ? { ...discussion, comments: [...(discussion.comments || []), result.comment] }
            : discussion
        ));
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to add comment. Please try again.");
      console.error("Error adding comment:", err);
      return false;
    }
  };
  
  const addReply = async (commentId, replyData) => {
    try {
      setError("");
      const result = await discussionService.addReply(commentId, replyData);
      return result.success;
    } catch (err) {
      setError("Failed to add reply. Please try again.");
      console.error("Error adding reply:", err);
      return false;
    }
  };
  
  useEffect(() => {
    loadDiscussions();
  }, []);
  
  return {
    discussions,
    loading,
    error,
    loadDiscussions,
    getClubDiscussions,
    getRecentActivity,
    createDiscussion,
    addComment,
    addReply,
  };
};