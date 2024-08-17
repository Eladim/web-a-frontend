import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    // Explicitly log the type and value of the token
    console.log('Token Type:', typeof token);
    console.log('Token Value:', token);
    console.log('Token Length:', token ? token.length : 'undefined or null');

    if (token && token.length > 0) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Authorization Header:', config.headers['Authorization']);  // Log the full Authorization header
      console.log('Making Request with a JWT Token');
    } else {
      console.error('Access token is missing');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
