import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../src/components/Login';

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // Save user data to local storage or state management as needed
  };

  const handleSignUpClick = () => {
    navigate('/register');
  };

  return (
    <div>
      <h1>Login Page</h1>
      <Login onLoginSuccess={handleLoginSuccess} />
      <div>
        <p>Don't have an account?</p>
        <button onClick={handleSignUpClick}>Sign Up</button>
      </div>
    </div>
  );
};

export default LoginPage;
