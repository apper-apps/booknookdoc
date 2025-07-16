import { useState, useEffect } from "react";
import bookService from "@/services/api/bookService";

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const loadBooks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await bookService.getAll();
      setBooks(data);
    } catch (err) {
      setError("Failed to load books. Please try again.");
      console.error("Error loading books:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const searchBooks = async (query, filters = {}) => {
    try {
      setLoading(true);
      setError("");
      const data = await bookService.search(query, filters);
      setBooks(data);
    } catch (err) {
      setError("Failed to search books. Please try again.");
      console.error("Error searching books:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const getRecommendations = async (userId = "user1") => {
    try {
      setLoading(true);
      setError("");
      const data = await bookService.getRecommendations(userId);
      setBooks(data);
    } catch (err) {
      setError("Failed to load recommendations. Please try again.");
      console.error("Error loading recommendations:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const getTrending = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await bookService.getTrending();
      setBooks(data);
    } catch (err) {
      setError("Failed to load trending books. Please try again.");
      console.error("Error loading trending books:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadBooks();
  }, []);
  
  return {
    books,
    loading,
    error,
    loadBooks,
    searchBooks,
    getRecommendations,
    getTrending,
  };
};