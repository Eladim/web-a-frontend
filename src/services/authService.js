import { jwtDecode as jwt_decode } from 'jwt-decode';
import apiClient from './api';

export const loginService = async ({ username, password }) => {
  try {
    const response = await apiClient.post('/token/', { username, password });

    const { access, refresh } = response.data;

    // Decode the JWT payload to extract user info
    const decodedToken = jwt_decode(access);
    const userInfo = {
      userId: decodedToken.user_id,
      username: decodedToken.username,
      isAdmin: decodedToken.is_admin,
      isHotelOperator: decodedToken.is_hotel_operator,
      isClient: decodedToken.is_client,
      isDriver: decodedToken.is_driver,
      isDriverOperator: decodedToken.is_driver_operator,
      accessToken: access,  // Keep the access token for future API requests
      refreshToken: refresh, // Store refresh token if needed
    };

    // Store the tokens in localStorage
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);

    return userInfo;  // Return the decoded user info
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};





// Function to handle user registration
export const registerService = async ({ email, password, name }) => {
  try {
    const response = await apiClient.post('/api/register/', {
      email,
      password,
      name,
    });

    return response.data;  // Assuming your backend returns user data or a success message
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};
// Or, if you're simply clearing tokens client-side without a backend call:

export const logoutService = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  return 'Logged out successfully';
};




// Function to handle user logout
/*export const logoutService = async () => {
  try {
    // Optional: You can call a logout endpoint if your backend does something special
    const response = await apiClient.post('/logout/');
    if (response.data.success) {
      return response.data.message;
    } else {
      throw new Error('Logout failed');
    }
  } catch (error) {
    console.error('Logout failed:', error);
    throw new Error(error.message || 'Logout failed');
  }
};*/