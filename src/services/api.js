import axios from 'axios';

// Base URL for the API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

console.log('API_BASE_URL:', API_BASE_URL);

// Function to get the CSRF token from cookies
const getCSRFToken = () => {
  let csrfToken = null;
  if (document.cookie) {
    document.cookie.split(';').forEach(cookie => {
      const [key, value] = cookie.trim().split('=');
      if (key === 'csrftoken') {
        csrfToken = value;
      }
    });
  }
  return csrfToken;
};

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // Ensure cookies are sent with requests
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCSRFToken(),  // Include the CSRF token in the headers
  },
  // You can add other default configurations here if needed
  // such as headers, timeout, etc.
});

// You can add other interceptors or configurations here if needed

export default apiClient;
