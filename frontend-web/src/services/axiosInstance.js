import axios from 'axios';

// Determine the base URL based on the environment
// For development, it will connect to the local backend (port 3001)
// For production, it should point to the deployed backend URL (e.g., from Render)
const baseURL = process.env.NODE_ENV === 'production'
  ? 'YOUR_DEPLOYED_BACKEND_URL' // TODO: Replace with actual deployed backend URL
  : 'http://localhost:3001/api'; // Connect to local backend API

const axiosInstance = axios.create({
  baseURL: baseURL,
});

// Optional: Add an interceptor to include the auth token in requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add an interceptor to handle responses (e.g., logout on 401)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized - token might be invalid or expired
      console.log('Unauthorized request, logging out.');
      localStorage.removeItem('authToken');
      // Optionally redirect to login page
      // window.location.href = '/login'; // Force reload to clear state
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
