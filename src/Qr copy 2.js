import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import logo from './assets/images/tourismBlue.png';
import styles from './Qr.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const CustomQRCode = () => {
    const qrRef = useRef(null);
    const qrCode = useRef(null); // Create a ref to store the QRCodeStyling instance

    useEffect(() => {
        qrCode.current = new QRCodeStyling({
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

        qrCode.current.append(qrRef.current);

        return () => qrCode.current.clear();
    }, []);

    const handleDownload = () => {
        qrCode.current.download({
            extension: "png", // Specify the file format
        });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Custom QR Code</h1>
            <div className={styles.qrWrapper}>
                <div className={styles.qrContainer}>
                    <div ref={qrRef} className={styles.qrCode}></div>
                </div>
                <div className={styles.qrOverlay}></div> {/* Overlay for dimming effect */}
                <FontAwesomeIcon 
                    icon={faDownload} 
                    className={styles.downloadIcon} 
                    onClick={handleDownload} 
                />
                <h1 className={styles.pickMeUp}>Scan me</h1>
            </div>
            <div className={styles.companyName}>
                Travel (Logo image) Company
            </div>
        </div>
    );
};

export default CustomQRCode;
