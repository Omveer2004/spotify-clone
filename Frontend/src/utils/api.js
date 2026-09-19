import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // Send cookies
});

// Automatically inject JWT from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('spotify_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
