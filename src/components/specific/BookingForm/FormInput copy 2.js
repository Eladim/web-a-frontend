import React, { useState, useEffect } from 'react';
import styles from './FormInput.module.css'; // Import the CSS module

const FormInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  required = false,
  children,
  placeholder,
}) => {
  const [minDateTime, setMinDateTime] = useState('');
  const [defaultDateTime, setDefaultDateTime] = useState('');

  useEffect(() => {
    if (type === 'datetime-local') {
      // Set the minimum date-time to 15 minutes ahead of the current time
      const now = new Date();
      const minOffsetInMinutes = 15;
      const defaultOffsetInMinutes = 30;
      
      const minDate = new Date(now.getTime() + minOffsetInMinutes * 60000);
      const defaultDate = new Date(now.getTime() + defaultOffsetInMinutes * 60000);

      const minOffset = minDate.getTimezoneOffset();
      const defaultOffset = defaultDate.getTimezoneOffset();
      
      const localMinISOTime = new Date(minDate.getTime() - minOffset * 60 * 1000)
        .toISOString()
        .slice(0, 16);
      
      const localDefaultISOTime = new Date(defaultDate.getTime() - defaultOffset * 60 * 1000)
        .toISOString()
        .slice(0, 16);

      setMinDateTime(localMinISOTime);
      setDefaultDateTime(localDefaultISOTime);
    }
  }, [type]);

  const handleFocus = () => {
    if (!value && type === 'datetime-local') {
      onChange({
        target: {
          name,
          value: defaultDateTime,
        },
      });
    }
  };

  return (
    <div className={styles.formGroup}>
      <label htmlFor={name} className={styles.formLabel}>
        {label}
      </label>

      {type === 'select' ? (
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
          onFocus={handleFocus}
          required={required}
          placeholder={placeholder}
          min={type === 'datetime-local' ? minDateTime : undefined}
        />
      )}
      {error && <p className={styles.formError}>{error}</p>}
    </div>
  );
};

export default FormInput;
