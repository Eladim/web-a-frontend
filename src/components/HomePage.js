import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Django Backend something</h1>
      <p>This is the home page for the backend API.</p>
      <Link to="/login-page">Sign In</Link> {/* Navigation Link */}
    </div>
  );
};

export default HomePage;
