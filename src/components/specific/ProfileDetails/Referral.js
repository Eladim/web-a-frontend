import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import CustomQRCode from './Qr'; // Import the Qr.js component
import styles from './Referral.module.css'; // Import the CSS module

const Referral = ({ bookingUrl, status  }) => {
  const qrContainerRef = useRef(null); // Reference for the scalable container

  // Get the current domain
  const currentDomain = window.location.origin;

  // Create the full URL
  const fullReferralUrl = `${currentDomain}${bookingUrl}`;
  const handleDownload = () => {
    // Capture the scalable container with all its contents
    html2canvas(qrContainerRef.current, {
      backgroundColor: null,
      scale: 2, // Increase the scale for higher resolution (2x the original size)
    }).then((canvas) => {
      // Optionally, you can downscale the canvas back to original size
      const scaledCanvas = document.createElement('canvas');
      const context = scaledCanvas.getContext('2d');
      scaledCanvas.width = canvas.width / 2;  // Divide by the same factor as the scale
      scaledCanvas.height = canvas.height / 2; // Divide by the same factor as the scale
      context.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

      // Create a link to download the captured image
      const link = document.createElement('a');
      link.download = 'qr-code-with-frame.png';
      link.href = scaledCanvas.toDataURL('image/png');
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
      <span>
        Status: {status} {/* Display the status here */}
      </span>
      <p className={styles.referralLink}>
        Referral link: <a href={fullReferralUrl}>{fullReferralUrl}</a>
      </p>
      {/* Button to trigger the download */}
    </div>
  );
};

export default Referral;
