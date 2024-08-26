import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals'
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { AppProvider } from './context/AppContext';  // Import AppProvider

// Redirect to HTTPS if not already on HTTPS and not in development mode
if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
  window.location.href = 'https://' + window.location.hostname + window.location.pathname + window.location.search;
}



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>  {/* Wrap the application with AuthProvider */}
    <AppProvider>  {/* Wrap the application with AppProvider */}
      <App />
    </AppProvider>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
