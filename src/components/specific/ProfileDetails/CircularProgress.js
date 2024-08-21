// src/components/common/CircularProgress/CircularProgress.jsx

import React, { useEffect, useState } from 'react';
import styles from './CircularProgress.module.css';

const CircularProgress = ({ total, value, percentage: providedPercentage, description }) => {
  const [percentage, setPercentage] = useState(0);
  const [displayValue, setDisplayValue] = useState(null);

  useEffect(() => {
    let targetPercentage;
    let targetValue;

    if (providedPercentage !== undefined) {
      targetPercentage = providedPercentage;
      targetValue = (providedPercentage / 100) * total;
    } else if (total && value !== undefined && value !== null) {
      targetPercentage = (value / total) * 100;
      targetValue = value;
    } else {
      return;
    }

    const duration = 2000; // duration in milliseconds
    const stepTime = 20; // update every 20ms
    const percentageStep = (targetPercentage / duration) * stepTime;
    const valueStep = (targetValue / duration) * stepTime;

    let currentPercentage = 0;
    let currentValue = 0;

    const incrementPercentage = () => {
      currentPercentage += percentageStep;
      currentValue += valueStep;

      if (currentPercentage >= targetPercentage) {
        currentPercentage = targetPercentage;
        currentValue = targetValue;
        clearInterval(intervalId);
      }

      setPercentage(currentPercentage);
      setDisplayValue(currentValue);
    };

    const intervalId = setInterval(incrementPercentage, stepTime);

    return () => clearInterval(intervalId);
  }, [total, value, providedPercentage]);

  return (
    <div className={styles.container}>
        
      <div className={styles.textWrapper}>
      <div className={styles.descriptionText}>
          <span>{description}</span>
        </div>
      {value !== null && value !== undefined && (
        <div className={styles.valueDisplay}>
          <span>€{Math.round(displayValue)}</span> {/* Display the value dynamically */}
        </div>
      )}

      </div>
      <div
        className={styles.circle}
        style={{
          background: `conic-gradient(#4a90e2 ${percentage * 3.6}deg, #f9f9f9 0deg)`,
        }}
      >
        <span className={styles.circleText}>{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

export default CircularProgress;
