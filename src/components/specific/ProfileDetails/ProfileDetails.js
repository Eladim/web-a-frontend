import React from 'react';
import styles from './ProfileDetails.module.css'; // Import the CSS module

const ProfileDetails = ({ username, firstName, lastName, email, telephone, address, accountType }) => {
  return (
    <div className={styles.profileDetailsContainer}>
      <div className={styles.profileField}>
        <label className={styles.profileLabel}>Username</label>
        <span className={styles.profileValue}>{username || 'None'}</span>
      </div>
      <div className={styles.profileField}>
        <label className={styles.profileLabel}>First Name</label>
        <span className={styles.profileValue}>{firstName || 'None'}</span>
      </div>
      <div className={styles.profileField}>
        <label className={styles.profileLabel}>Last Name</label>
        <span className={styles.profileValue}>{lastName || 'None'}</span>
      </div>
      <div className={styles.profileField}>
        <label className={styles.profileLabel}>Email</label>
        <span className={styles.profileValue}>{email || 'None'}</span>
      </div>
      <div className={styles.profileField}>
        <label className={styles.profileLabel}>Telephone</label>
        <span className={styles.profileValue}>{telephone || 'None'}</span>
      </div>
      <div className={styles.profileField}>
        <label className={styles.profileLabel}>Address</label>
        <span className={styles.profileValue}>{address || 'None'}</span>
      </div>
      <div className={styles.profileField}>
        <label className={styles.profileLabel}>Account Type</label>
        <span className={styles.profileValue}>{accountType || 'None'}</span>
      </div>
    </div>
  );
};

export default ProfileDetails;
