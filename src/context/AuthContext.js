import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const savedAuthState = localStorage.getItem('authState');
    return savedAuthState ? JSON.parse(savedAuthState) : null;
  });

  useEffect(() => {
    if (authState?.username) {
      console.log(`Authorized as ${authState.username}`);
    }

    if (authState) {
      localStorage.setItem('authState', JSON.stringify(authState));
      
      // Only set access_token if it's defined
      if (authState.accessToken) {
        localStorage.setItem('access_token', authState.accessToken);
      }
    } else {
      localStorage.removeItem('authState');
      localStorage.removeItem('access_token'); // Remove JWT from localStorage on logout
    }
  }, [authState]);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
