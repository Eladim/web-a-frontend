// src/components/layout/Sidebar.jsx

import React from 'react';
import './Sidebar.module.css'; // Optional, if you want to add specific styles for this component

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul className="sidebar-links">
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/orders">Orders</a></li>
        <li><a href="/settings">Settings</a></li>
        <li><a href="/logout">Logout</a></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
