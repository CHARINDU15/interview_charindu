// frontend/src/services/api.js
import axios from 'axios';

const API_URL = "http://localhost:5000/api";
console.log('API_URL:', API_URL); // Add this line to verify the environment variable

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with the request
});

export const createResource = async (resourceData, token) => {
  return api.post('/resources/create', resourceData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateResource = async (resourceId, resourceData, token) => {
  return api.put(`/resources/${resourceId}`, resourceData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteResource = async (resourceId, token) => {
  return api.delete(`/resources/${resourceId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addComment = async (commentData, token) => {
  return api.post('/resources/comment', commentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const reactToResource = async (reactionData, token) => {
  return api.post('/resources/react', reactionData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default api;