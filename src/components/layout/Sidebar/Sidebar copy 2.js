import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import ActionButtons from './ActionButtons'; // Import the ActionButtons component
import styles from './Sidebar.module.css';

const Sidebar = ({ actions }) => {  // Accept actions as a prop
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    console.log('Sign out triggered');
  };

  return (
    <>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <ActionButtons actions={actions} />  {/* Render ActionButtons with passed actions */}
        <button className={styles.toggleBtn} onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <button className={styles.signOutBtn} onClick={handleSignOut}>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </nav>

      {/* Overlay */}
      <div className={`${styles.sidebarOverlay} ${isOpen ? styles.active : ''}`} onClick={toggleSidebar}></div>

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.active : ''}`}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={toggleSidebar}>&times;</button>

        {/* Sidebar Content */}
        <div className={styles.sidebarContent}>
          <ul>
            {/* User & Account Management */}
            <li className={styles.sidebarCategory}>User & Account Management</li>
            <li>
              <Link to="/user-profiles" onClick={toggleSidebar}>User Profiles</Link>
            </li>
            <li>
              <Link to="/role-management" onClick={toggleSidebar}>Role Management</Link>
            </li>
            <li>
              <Link to="/permissions" onClick={toggleSidebar}>Permission Settings</Link>
            </li>
            <li>
              <Link to="/account-settings" onClick={toggleSidebar}>Account Settings</Link>
            </li>

            {/* Financial Overview */}
            <li className={styles.sidebarCategory}>Financial Overview</li>
            <li>
              <Link to="/earnings-summary" onClick={toggleSidebar}>Earnings Summary</Link>
            </li>
            <li>
              <Link to="/commission-obligations" onClick={toggleSidebar}>Commission Obligations</Link>
            </li>
            <li>
              <Link to="/payment-logs" onClick={toggleSidebar}>Payment Logs</Link>
            </li>
            <li>
              <Link to="/invoices" onClick={toggleSidebar}>Invoices</Link>
            </li>

            {/* Booking & Order Management */}
            <li className={styles.sidebarCategory}>Booking & Order Management</li>
            <li>
              <Link to="/bookings" onClick={toggleSidebar}>Active Bookings</Link>
            </li>
            <li>
              <Link to="/orders" onClick={toggleSidebar}>Order Tracking</Link>
            </li>
            <li>
              <Link to="/booking-history" onClick={toggleSidebar}>Booking History</Link>
            </li>
            <li>
              <Link to="/manage-cancellations" onClick={toggleSidebar}>Manage Cancellations</Link>
            </li>

            {/* System Administration */}
            <li className={styles.sidebarCategory}>System Administration</li>
            <li>
              <a href={`${process.env.REACT_APP_BACK_END_SERVER}/admin`} onClick={toggleSidebar}>
                Django Admin
              </a>
            </li>
            <li>
              <Link to="/system-logs" onClick={toggleSidebar}>System Logs</Link>
            </li>
            <li>
              <Link to="/integrations" onClick={toggleSidebar}>Manage Integrations</Link>
            </li>
            <li>
              <Link to="/site-config" onClick={toggleSidebar}>Site Configuration</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
