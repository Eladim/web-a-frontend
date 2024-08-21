import apiClient from './api';

// Function to handle user login
export const loginService = async ({ username, password }) => {
  try {
    const response = await apiClient.post('/token/', { username, password });

    // Extract the tokens from the response
    const { access, refresh } = response.data;

    // Store the tokens in localStorage
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);

    // Log tokens after storing
    const storedAccessToken = localStorage.getItem('access_token');
    console.log('Stored Access Token:', storedAccessToken);
    console.log('Access Token Length:', storedAccessToken ? storedAccessToken.length : 'undefined or null');

    // Log the entire localStorage
    console.log('Full localStorage:', JSON.stringify(localStorage));

    // Decode the JWT payload to extract the user_id
    const userId = JSON.parse(atob(access.split('.')[1])).user_id;

    // Log the user ID
    console.log('User ID:', userId);

    return { user_id: userId };  // Return the user ID to be stored in authState
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