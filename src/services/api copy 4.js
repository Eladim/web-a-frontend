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
    const excludeTokenForUrls = ['/bookings/locations/'];

    // Check if the current request URL is in the exclude list
    const shouldExcludeToken = excludeTokenForUrls.some(url => config.url.includes(url));

    if (token && token.length > 0 && !shouldExcludeToken) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Authorization Header:', config.headers['Authorization']);  // Log the full Authorization header
      console.log('Making Request with a JWT Token');
    } else {
      console.log('No Authorization Header Added');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
