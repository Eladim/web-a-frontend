import React, { createContext, useState } from 'react';

// Create a new context
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Shared state across the application
  const [filterStatus, setFilterStatus] = useState('All');

  // Function to update the filter status
  const updateFilterStatus = (status) => {
    setFilterStatus(status);
  };

  return (
    <AppContext.Provider value={{ filterStatus, updateFilterStatus }}>
      {children}
    </AppContext.Provider>
  );
};
