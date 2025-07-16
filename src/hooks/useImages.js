import { useState, useEffect } from "react";
import imageService from "@/services/api/imageService";

export const useImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const loadImages = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await imageService.getAll();
      setImages(data);
    } catch (err) {
      setError("Failed to load images. Please try again.");
      console.error("Error loading images:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const uploadImage = async (imageData) => {
    try {
      setError("");
      const result = await imageService.upload(imageData);
      if (result.success) {
        setImages([result.image, ...images]);
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error("Error uploading image:", err);
      return false;
    }
  };
  
  const getUserImages = async (userId) => {
    try {
      setLoading(true);
      setError("");
      const data = await imageService.getByUserId(userId);
      setImages(data);
    } catch (err) {
      setError("Failed to load user images. Please try again.");
      console.error("Error loading user images:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const getBookImages = async (bookId) => {
    try {
      setLoading(true);
      setError("");
      const data = await imageService.getByBookId(bookId);
      setImages(data);
    } catch (err) {
      setError("Failed to load book images. Please try again.");
      console.error("Error loading book images:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const getFeed = async (userId) => {
    try {
      setLoading(true);
      setError("");
      const data = await imageService.getFeed(userId);
      setImages(data);
    } catch (err) {
      setError("Failed to load feed. Please try again.");
      console.error("Error loading feed:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const likeImage = async (imageId) => {
    try {
      setError("");
      const result = await imageService.like(imageId, "user1");
      if (result.success) {
        setImages(images.map(img => 
          img.Id === imageId ? { ...img, likes: result.likes } : img
        ));
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to like image. Please try again.");
      console.error("Error liking image:", err);
      return false;
    }
  };
  
  const addComment = async (imageId, commentData) => {
    try {
      setError("");
      const result = await imageService.addComment(imageId, commentData);
      if (result.success) {
        setImages(images.map(img => 
          img.Id === imageId 
            ? { ...img, comments: [...img.comments, result.comment] }
            : img
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
  
  const searchImages = async (query, filters = {}) => {
    try {
      setLoading(true);
      setError("");
      const data = await imageService.search(query, filters);
      setImages(data);
    } catch (err) {
      setError("Failed to search images. Please try again.");
      console.error("Error searching images:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadImages();
  }, []);
  
  return {
    images,
    loading,
    error,
    loadImages,
    uploadImage,
    getUserImages,
    getBookImages,
    getFeed,
    likeImage,
    addComment,
    searchImages,
  };
};