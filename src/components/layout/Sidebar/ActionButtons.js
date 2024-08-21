import React from 'react';
import styles from './ActionButtons.module.css'; // Use the same styles for consistency

const ActionButtons = ({ actions }) => {
  return (
    <div className={styles.actionButtons}>
      {actions.map((action, index) => (
        <button
          key={index}
          className={styles.navButton}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
