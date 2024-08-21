import React from 'react';
import CustomQRCode from './Qr'; // Import the Qr.js component
import styles from './Referral.module.css'; // Import the CSS module

const Referral = ({ bookingUrl }) => {
  // Get the current domain
  const currentDomain = window.location.origin;

  // Create the full URL
  const fullReferralUrl = `${currentDomain}${bookingUrl}`;

  return (
    <div className={styles.referralContainer}>
      <h1 className={styles.title}>QR Code</h1>
      <div className={styles.qrCodeWrapper}>
        {/* Wrap CustomQRCode in a scalable container */}
        <div className={styles.scalableContainer}>
          <CustomQRCode fullReferralUrl={fullReferralUrl} />
        </div>
      </div>
      <p className={styles.referralLink}>
        Referral link: <a href={fullReferralUrl}>{fullReferralUrl}</a>
      </p>
    </div>
  );
};

export default Referral;
