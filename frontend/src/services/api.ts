import axios from 'axios';

export const SERVER_URL = axios.create({
  baseURL: 'http://localhost:5070',
  withCredentials: false,
});

// Intercept requests to add Authorization header
SERVER_URL.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
