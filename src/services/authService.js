// src/services/authService.js

import apiClient from './api';

export const loginService = async ({ email, password }) => {
  try {
    const requestData = {
      email,
      password,
    };

    console.log('Sending request with data:', requestData);
    const apiUrl = '/login/';
    console.log('Connecting to API endpoint:', apiUrl);

    const response = await apiClient.post(apiUrl, requestData);

    console.log('Server Response:', response.data);

    // Check if login was successful and return the user data
    if (response.data.success) {
      return response.data.user;  // This should contain the user object
    } else {
      throw new Error(response.data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login request failed:', error);
    throw error;
  }
};

// Function to handle user registration
export const signupService = async ({ email, password, name }) => {
  try {
    const response = await apiClient.post('/register/', {
      email,
      password,
      name,
    });
    return response.data; // Handle response as needed
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};

// Function to handle user logout
export const logoutService = async () => {
  try {
    const response = await apiClient.post('/logout/');
    if (response.data.success) {
      // Handle successful logout if needed
      return response.data.message;
    } else {
      throw new Error('Logout failed');
    }
  } catch (error) {
    throw new Error(error.message || 'Logout failed');
  }
};
