import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';

const CustomQRCode = () => {
  const qrRef = useRef(null);

  useEffect(() => {
    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      data: "https://www.google.com", // Google URL
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/512px-Google_2015_logo.svg.png", // Google logo
      dotsOptions: {
        color: "#4a90e2", // Use your primary color or gradient
        type: "rounded" // Rounded dots for a modern look
      },
      cornersSquareOptions: {
        color: "#357ABD", // Another shade of blue or your preferred color
        type: "extra-rounded" // Extra-rounded corners for a softer look
      },
      cornersDotOptions: {
        color: "#e74c3c", // A contrasting color for the corner dots
        type: "dot" // Use dots for the corners for added style
      },
      backgroundOptions: {
        color: "#ffffff" // Background color of the QR code
      },
      imageOptions: {
        crossOrigin: "anonymous", // If using an external image
        margin: 10, // Margin around the logo
        imageSize: 0.25, // Size of the logo in the center
        hideBackgroundDots: true // Hide the dots behind the logo
      }
    });

    qrCode.append(qrRef.current);

    return () => qrCode.clear();
  }, []);

  const handleDownload = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'google-qr-code.png';
    link.click();
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ color: '#333' }}>Google QR Code</h1>
      <div ref={qrRef}></div>
      <button onClick={handleDownload} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#4a90e2', color: '#fff', border: 'none', cursor: 'pointer' }}>
        Download QR Code
      </button>
    </div>
  );
};

export default CustomQRCode;
