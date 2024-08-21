import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar/Sidebar';

const AppLayout = () => {
  const location = useLocation();

  const getActionsForPage = () => {
    switch (location.pathname) {
      case '/orders':
        return [
          { label: 'Show All Orders', onClick: () => console.log('Show All Orders clicked') },
          { label: 'Show In Queue Orders', onClick: () => console.log('Show In Queue Orders clicked') },
          { label: 'Show Ongoing Orders', onClick: () => console.log('Show Ongoing Orders clicked') },
        ];
      case '/profile':
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
  const shouldRenderSidebar = !['/login', '/register', '/forgot-password'].includes(location.pathname);

  return (
    <>
      {shouldRenderSidebar && <Sidebar actions={actions} />} {/* Conditionally render Sidebar */}
      {/* Other components like Header, Footer can go here if needed */}
    </>
  );
};

export default AppLayout;
