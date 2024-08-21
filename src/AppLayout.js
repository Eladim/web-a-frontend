import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar/Sidebar';
import { AuthContext } from './context/AuthContext';
import { AppContext } from './context/AppContext';  // Import AppContext

const AppLayout = () => {
  const location = useLocation();
  const { authState } = useContext(AuthContext);
  const { updateFilterStatus } = useContext(AppContext);  // Access the context

  const getActionsForPage = () => {
    switch (location.pathname) {
      case '/orders':
        return [
          
          { label: 'Show In Queue Orders', onClick: () => updateFilterStatus('In Queue') },
          { label: 'Show Ongoing Orders', onClick: () => updateFilterStatus('Ongoing') },
          { label: 'Show All Orders', onClick: () => updateFilterStatus('All') },
        ];
      case '/profile-hotel-operator':
        return [
          { label: 'Edit Profile', onClick: () => console.log('Edit Profile clicked') },
          { label: 'View History', onClick: () => console.log('View History clicked') },
        ];
      default:
        return [];
    }
  };

  const actions = getActionsForPage();

  // Conditionally render the sidebar
  const shouldRenderSidebar = !['/login', '/register', '/forgot-password', '/'].includes(location.pathname) &&
  !location.pathname.startsWith('/reservation');

  return (
    <>
      {shouldRenderSidebar && (
        <Sidebar actions={actions} isAdmin={authState?.isAdmin} />
      )}
      {/* Other components like Header, Footer can go here if needed */}
    </>
  );
};

export default AppLayout;
