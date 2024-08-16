import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import styles from './OpenNavigation.module.css'; // Import the CSS module

const OpenNavigation = ({ url }) => {
  const handleIconClick = (event) => {
    event.stopPropagation(); // Stop the click event from propagating
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <FontAwesomeIcon 
      icon={faMapLocationDot} 
      className={styles.icon} 
      onClick={handleIconClick} 
    />
  );
};

export default OpenNavigation;
