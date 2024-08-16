import React from 'react';
import styles from './FormInput.module.css'; // Import the CSS module
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; // Import default styles or customize

const FormInput = ({ label, type = 'text', name, value, onChange, error, required = false, children, placeholder, }) => (
  <div className={styles.formGroup}>
    <label htmlFor={name} className={styles.formLabel}>{label}</label>
    
    {
    
    
    type === 'select' ? (
      <select
        className={styles.formControl}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >
        {children}
      </select>
    ) : (
      <input
        className={styles.formControl}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    )}
    {error && <p className={styles.formError}>{error}</p>}
  </div>
);

export default FormInput;
