import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import logo from './assets/images/tourismBlue.png';

const CustomQRCode = () => {
  const qrRef = useRef(null);

  useEffect(() => {
    const qrCode = new QRCodeStyling({
      width: 500,
      height: 500,
      data: "https://www.google.com", // Replace with your URL
      image: logo, // Replace with your logo URL
      dotsOptions: {
        color: "#555555", // Gray color for the dots
        type: "extra-rounded" // Rounded dots for a modern look
      },
      cornersSquareOptions: {
        color: "#1f4d8a", // Gray color for the corner squares
        type: "extra-rounded" // Extra-rounded corners for a softer look
      },
      cornersDotOptions: {
        color: "#357ABD", // Gray color for the corner dots
        type: "dot" // Use dots for the corners for added style
      },
      backgroundOptions: {
        color: "#ffffff", // White background color
      },
      imageOptions: {
        crossOrigin: "anonymous", // If using an external image
        margin: 10, // Margin around the logo
        imageSize: 0.55, // Increase this value to enlarge the logo (e.g., 0.35 for 35% of the QR code size)
        hideBackgroundDots: true // Hide the dots behind the logo
      },
      qrOptions: {
        errorCorrectionLevel: "H" // High error correction level
      },
    });

    qrCode.append(qrRef.current);

    return () => qrCode.clear();
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ color: '#333' }}>Custom QR Code</h1>
      <div ref={qrRef}></div>
      <div style={{
        marginTop: '10px',
        fontSize: '14px',
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        Travel (Logo image) Company
      </div>
    </div>
  );
};

export default CustomQRCode;
