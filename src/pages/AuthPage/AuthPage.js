import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { useAuth } from '../../hooks/useAuth';

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login({ username, password });
      console.log('Server Response:', user);

      // Navigate based on user role or any condition you need
      if (user.isAdmin) {
        navigate('/orders');  // Redirect to orders page for admins
      } else if (user.isDriverOperator) {
        navigate('/orders');  // Redirect to orders page for driver operators
      } else if (user.isHotelOperator) {
        navigate('/profile-hotel-operator');  // Redirect to hotel operator profile page
      } else if (user.isDriver) {
        // Redirect to a page specific to drivers, if needed
      } else if (user.isClient) {
        // Redirect to a client-specific page, if needed
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
          <label htmlFor="username" className={styles.label}>Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            required
          />
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
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
