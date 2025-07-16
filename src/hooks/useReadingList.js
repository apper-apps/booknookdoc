import { useState, useEffect } from "react";
import readingListService from "@/services/api/readingListService";
import bookService from "@/services/api/bookService";

export const useReadingList = (userId = "user1") => {
  const [readingLists, setReadingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const loadReadingLists = async () => {
    try {
      setLoading(true);
      setError("");
      const listData = await readingListService.getUserLists(userId);
      
      // Get book details for each list item
      const booksWithDetails = await Promise.all(
        listData.map(async (listItem) => {
          const book = await bookService.getById(listItem.bookId);
          return {
            ...listItem,
            book: book || {
              Id: listItem.bookId,
              title: "Unknown Book",
              author: "Unknown Author",
              cover: "/api/placeholder/120/180"
            }
          };
        })
      );
      
      setReadingLists(booksWithDetails);
    } catch (err) {
      setError("Failed to load reading lists. Please try again.");
      console.error("Error loading reading lists:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const getListByStatus = async (status) => {
    try {
      setLoading(true);
      setError("");
      const listData = await readingListService.getListByStatus(userId, status);
      
      const booksWithDetails = await Promise.all(
        listData.map(async (listItem) => {
          const book = await bookService.getById(listItem.bookId);
          return {
            ...listItem,
            book: book || {
              Id: listItem.bookId,
              title: "Unknown Book",
              author: "Unknown Author",
              cover: "/api/placeholder/120/180"
            }
          };
        })
      );
      
      setReadingLists(booksWithDetails);
    } catch (err) {
      setError("Failed to load reading list. Please try again.");
      console.error("Error loading reading list:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const addToList = async (bookId, status) => {
    try {
      setError("");
      const result = await readingListService.addToList(userId, bookId, status);
      if (result.success) {
        await loadReadingLists();
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to add book to list. Please try again.");
      console.error("Error adding to list:", err);
      return false;
    }
  };
  
  const removeFromList = async (bookId) => {
    try {
      setError("");
      const result = await readingListService.removeFromList(userId, bookId);
      if (result.success) {
        setReadingLists(readingLists.filter(item => item.bookId !== parseInt(bookId)));
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to remove book from list. Please try again.");
      console.error("Error removing from list:", err);
      return false;
    }
  };
  
  const updateProgress = async (bookId, progress) => {
    try {
      setError("");
      const result = await readingListService.updateProgress(userId, bookId, progress);
      if (result.success) {
        setReadingLists(readingLists.map(item => 
          item.bookId === parseInt(bookId)
            ? { ...item, progress, status: progress === 100 ? "finished" : item.status }
            : item
        ));
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to update progress. Please try again.");
      console.error("Error updating progress:", err);
      return false;
    }
  };
  
  const markAsFinished = async (bookId) => {
    try {
      setError("");
      const result = await readingListService.markAsFinished(userId, bookId);
      if (result.success) {
        setReadingLists(readingLists.map(item => 
          item.bookId === parseInt(bookId)
            ? { ...item, status: "finished", progress: 100 }
            : item
        ));
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to mark as finished. Please try again.");
      console.error("Error marking as finished:", err);
      return false;
    }
  };
  
  useEffect(() => {
    loadReadingLists();
  }, [userId]);
  
  return {
    readingLists,
    loading,
    error,
    loadReadingLists,
    getListByStatus,
    addToList,
    removeFromList,
    updateProgress,
    markAsFinished,
  };
};