import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './styles/Auth.css';  // Import the shared CSS file

const clientId = '710414038631-oimlio8uu2feaoodto9bhemrfur3lnqp.apps.googleusercontent.com';
const backendUrl = process.env.REACT_APP_NGROK_URL;

const Register = ({ onRegisterSuccess }) => {
  const handleRegisterSuccess = async (response) => {
    try {
      const res = await axios.post(`${backendUrl}/api/auth/google/`, {
        token: response.credential,
      });
      console.log('Registration Success: ', res.data);
      localStorage.setItem('authToken', res.data.token);  // Save token in local storage
      onRegisterSuccess(res.data);  // Pass the user data to the parent component
    } catch (error) {
      console.error('Registration Error: ', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="register-page">
        <div className="auth-container">
          <h2>Sign Up</h2>
          <GoogleLogin
            onSuccess={handleRegisterSuccess}
            onError={() => {
              console.log('Registration Failed');
            }}
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;
