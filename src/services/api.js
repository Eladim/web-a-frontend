import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get a new access token using the refresh token
const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh: refresh_token });
    const { access } = response.data;

    // Store the new access token
    localStorage.setItem('access_token', access);
    return access;
  } catch (error) {
    // Handle error (e.g., redirect to login page if refresh fails)
    console.error('Failed to refresh token', error);
    throw error;
  }
};

// Interceptor to add JWT token to requests and refresh if necessary
apiClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('access_token');
    const excludeTokenForUrls = ['/bookings/locations/'];

    // Check if the current request URL is in the exclude list
    const shouldExcludeToken = excludeTokenForUrls.some(url => config.url.includes(url));

    if (token && token.length > 0 && !shouldExcludeToken) {
      config.headers['Authorization'] = `Bearer ${token}`;
      //console.log('Authorization Header:', config.headers['Authorization']);  // Log the full Authorization header
      //console.log('Making Request with a JWT Token');
    } else {
      console.log('No Authorization Header Added');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle 401 errors and refresh the token
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        // Retry the original request with the new token
        return apiClient(originalRequest);
      } catch (err) {
        // Handle the case where refresh token fails (e.g., log out user)
        console.error('Failed to refresh token and retry request', err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
