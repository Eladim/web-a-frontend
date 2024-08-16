// src/hooks/useAuth.js

import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { loginService, logoutService, signupService } from '../services/authService';

export const useAuth = () => {
  const { setAuthState } = useContext(AuthContext);  // Get the context's setAuthState function
  const [error, setError] = useState(null);  // State to manage errors

  // Login function
  const login = async ({ email, password }) => {
    try {
      const user = await loginService({ email, password });  // No token, just the user data
      
      // Set the authentication state with user data
      setAuthState(user);

      // Clear any previous errors
      setError(null);

      // Return the user data to the caller (important for redirection logic)
      return user;
    } catch (err) {
      // Set the error state with a meaningful message
      setError('Invalid credentials. Please try again.');

      // Throw the error so it can be caught by the caller
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    // Clear the auth state in the context
    setAuthState(null);

    // Call the logout service
    logoutService();
  };

  // Signup function (optional if you're handling user registration)
  const signup = async ({ email, password, name }) => {
    try {
      await signupService({ email, password, name });  // Register the user
      
      // Automatically log the user in after signup
      const user = await login({ email, password });

      // Clear any previous errors
      setError(null);

      return user;
    } catch (err) {
      // Set the error state with a meaningful message
      setError('Signup failed. Please try again.');

      // Throw the error so it can be caught by the caller
      throw err;
    }
  };

  return { login, logout, signup, error };  // Return the auth functions and error state
};
