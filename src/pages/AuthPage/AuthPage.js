import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { useAuth } from '../../hooks/useAuth';


const AuthPage = () => {
  const BACK_END_SERVER = process.env.REACT_APP_BACK_END_SERVER || 'http://127.0.0.1:8000';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const user = await login({ email, password });
      console.log('Server Response:', user);

      if (user) {
        // Check user roles and navigate accordingly
        if (user.is_admin) {
          //window.location.href = `${BACK_END_SERVER}/admin`;  // Redirect to backend domain
          navigate('/orders');
        } else if (user.is_driver_operator) {
          navigate('/orders');
        } else if (user.is_driver) {
          navigate('/dashboard');
        } else if (user.is_hotel_operator) {
          navigate('/hotel_dashboard');
        } else {
          navigate('/create_reservation');  // Default redirect
        }
      }
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Login</h1>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password}"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
