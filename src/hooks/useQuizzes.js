import { useState, useEffect } from "react";
import quizService from "@/services/api/quizService";

export const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await quizService.getAll();
      setQuizzes(data);
    } catch (err) {
      setError("Failed to load quizzes. Please try again.");
      console.error("Error loading quizzes:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const getQuizById = async (id) => {
    try {
      setError("");
      const quiz = await quizService.getById(id);
      return quiz;
    } catch (err) {
      setError("Failed to load quiz. Please try again.");
      console.error("Error loading quiz:", err);
      return null;
    }
  };
  
  const submitQuiz = async (quizId, answers) => {
    try {
      setError("");
      const result = await quizService.submitQuiz(quizId, answers);
      return result;
    } catch (err) {
      setError("Failed to submit quiz. Please try again.");
      console.error("Error submitting quiz:", err);
      return { success: false };
    }
  };
  
  const getBookQuizzes = async (bookId) => {
    try {
      setLoading(true);
      setError("");
      const data = await quizService.getBookQuizzes(bookId);
      setQuizzes(data);
    } catch (err) {
      setError("Failed to load book quizzes. Please try again.");
      console.error("Error loading book quizzes:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const getRecommendationQuizzes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await quizService.getRecommendationQuizzes();
      setQuizzes(data);
    } catch (err) {
      setError("Failed to load recommendation quizzes. Please try again.");
      console.error("Error loading recommendation quizzes:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const searchQuizzes = async (query, filters = {}) => {
    try {
      setLoading(true);
      setError("");
      const data = await quizService.search(query, filters);
      setQuizzes(data);
    } catch (err) {
      setError("Failed to search quizzes. Please try again.");
      console.error("Error searching quizzes:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const createQuiz = async (quizData) => {
    try {
      setError("");
      const result = await quizService.create(quizData);
      if (result.success) {
        setQuizzes([result.quiz, ...quizzes]);
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to create quiz. Please try again.");
      console.error("Error creating quiz:", err);
      return false;
    }
  };
  
  useEffect(() => {
    loadQuizzes();
  }, []);
  
  return {
    quizzes,
    loading,
    error,
    loadQuizzes,
    getQuizById,
    submitQuiz,
    getBookQuizzes,
    getRecommendationQuizzes,
    searchQuizzes,
    createQuiz,
  };
};