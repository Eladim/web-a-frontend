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
  vehicleType, // Add vehicleType prop to handle group size logic
}) => {
  const [minDateTime, setMinDateTime] = useState('');
  const [defaultDateTime, setDefaultDateTime] = useState('');
  const [maxGroupSize, setMaxGroupSize] = useState(1); // Default max group size

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

    // Set max group size based on vehicle type
    if (type === 'number' && name === 'group_size') {
      switch (vehicleType) {
        case 'standard':
        case 'executive':
          setMaxGroupSize(4);
          break;
        case 'van':
          setMaxGroupSize(8);
          break;
        case 'minibus':
          setMaxGroupSize(16);
          break;
        default:
          setMaxGroupSize(1); // Default case
      }
    }
  }, [type, name, vehicleType]);

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
          max={type === 'number' && name === 'group_size' ? maxGroupSize : undefined}
        />
      )}
      {error && <p className={styles.formError}>{error}</p>}
    </div>
  );
};

export default FormInput;
