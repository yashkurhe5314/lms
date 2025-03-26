import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get student's course progress
export const getProgress = async (courseId) => {
  try {
    const response = await axios.get(`${API_URL}/student/progress/${courseId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get course content
export const getCourseContent = async (courseId) => {
  try {
    const response = await axios.get(`${API_URL}/student/course/${courseId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get specific lesson
export const getLesson = async (lessonId) => {
  try {
    const response = await axios.get(`${API_URL}/student/lesson/${lessonId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Save notes
export const saveNotes = async (lessonId, content) => {
  try {
    const response = await axios.post(`${API_URL}/student/notes/${lessonId}`, {
      content
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Mark lesson as completed
export const completeLesson = async (lessonId) => {
  try {
    const response = await axios.post(`${API_URL}/student/complete/${lessonId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update last accessed lesson
export const updateLastAccessed = async (lessonId) => {
  try {
    const response = await axios.put(`${API_URL}/student/last-accessed/${lessonId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}; 