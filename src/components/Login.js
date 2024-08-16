import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './styles/Auth.css';  // Import the shared CSS file

const clientId = '710414038631-oimlio8uu2feaoodto9bhemrfur3lnqp.apps.googleusercontent.com';
const backendUrl = process.env.REACT_APP_NGROK_URL;

const Login = ({ onLoginSuccess }) => {
  const handleLoginSuccess = async (response) => {
    try {
      const res = await axios.post(`${backendUrl}/api/auth/google/`, {
        token: response.credential,
      });
      console.log('Login Success: ', res.data);
      onLoginSuccess(res.data);  // Pass the user data to the parent component
    } catch (error) {
      console.error('Login Error: ', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="login-page">
        <div className="auth-container">
          <h2>Sign in</h2>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
