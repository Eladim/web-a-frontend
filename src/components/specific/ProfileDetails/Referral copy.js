import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import CustomQRCode from './Qr'; // Import the Qr.js component
import styles from './Referral.module.css'; // Import the CSS module

const Referral = ({ bookingUrl }) => {
  const qrContainerRef = useRef(null); // Reference for the scalable container

  // Get the current domain
  const currentDomain = window.location.origin;

  // Create the full URL
  const fullReferralUrl = `${currentDomain}${bookingUrl}`;

  const handleDownload = () => {
    // Capture the scalable container with all its contents
    html2canvas(qrContainerRef.current, {
      backgroundColor: null,
    }).then((canvas) => {
      // Create a link to download the captured image
      const link = document.createElement('a');
      link.download = 'qr-code-with-frame.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  return (
    <div className={styles.referralContainer}>
      <h1 className={styles.title}>QR Code</h1>
      <div className={styles.qrCodeWrapper}>
        {/* Wrap CustomQRCode in a scalable container */}
        <div ref={qrContainerRef} className={styles.scalableContainer}>
          <CustomQRCode fullReferralUrl={fullReferralUrl} onDownload={handleDownload} />
        </div>
      </div>
      <p className={styles.referralLink}>
        Referral link: <a href={fullReferralUrl}>{fullReferralUrl}</a>
      </p>
      {/* Button to trigger the download */}
    </div>
  );
};

export default Referral;
