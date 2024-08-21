import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { loginService, logoutService, registerService } from '../services/authService';

export const useAuth = () => {
  const { authState, setAuthState } = useContext(AuthContext);
  const [error, setError] = useState(null);

  // Login function
  const login = async ({ username, password }) => {
    try {
      const user = await loginService({ username, password });

      // Set the authentication state with decoded user data
      setAuthState(user);

      // Clear any previous errors
      setError(null);

      return user;
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      throw err;
    }
  };

  // Register function
  const register = async ({ email, password, name }) => {
    try {
      const user = await registerService({ email, password, name });

      // Automatically log the user in after registration (optional)
      await login({ email, password });

      // Clear any previous errors
      setError(null);

      return user;
    } catch (err) {
      setError('Registration failed. Please try again.');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    // Clear the auth state and localStorage
    setAuthState(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Call the logout service (if any)
    logoutService();
  };

  return { authState, login, logout, register, error };
};
