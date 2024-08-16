// src/components/layout/Navbar.jsx

import React from 'react';
import './Navbar.module.css'; // Optional, if you want to add specific styles for this component

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">My Dashboard</div>
      <ul className="navbar-links">
        <li><a href="/home">Home</a></li>
        <li><a href="/orders">Orders</a></li>
        <li><a href="/profile">Profile</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
