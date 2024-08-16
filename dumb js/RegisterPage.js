import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Register from '../src/components/Register';

const RegisterPage = ({ setUser }) => {
  const navigate = useNavigate();

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    navigate('/profile');  // Redirect to the profile page after successful registration
  };

  return (
    <div>
      <h1>Register Page</h1>
      <Register onRegisterSuccess={handleRegisterSuccess} />
      <div>
        <p>Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
