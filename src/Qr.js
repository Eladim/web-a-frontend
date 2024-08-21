import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import html2canvas from 'html2canvas';
import styles from './Qr.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import logo from './assets/images/tourismBlue.png';

const CustomQRCode = () => {
    const qrRef = useRef(null);
    const qrWrapperRef = useRef(null);
    const qrCode = useRef(null);

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
        html2canvas(qrWrapperRef.current, {
            backgroundColor: null,
        }).then((canvas) => {
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;

            // Create a new canvas for clipping
            const clippedCanvas = document.createElement('canvas');
            clippedCanvas.width = width;
            clippedCanvas.height = height;
            const clippedCtx = clippedCanvas.getContext('2d');

            // Draw the original canvas onto the new canvas
            clippedCtx.save();
            clippedCtx.beginPath();
            clippedCtx.moveTo(20, 0);
            clippedCtx.arcTo(width, 0, width, height, 30);  // Top-right corner
            clippedCtx.arcTo(width, height, 0, height, 30);  // Bottom-right corner
            clippedCtx.arcTo(0, height, 0, 0, 30);  // Bottom-left corner
            clippedCtx.arcTo(0, 0, width, 0, 30);  // Top-left corner
            clippedCtx.closePath();
            clippedCtx.clip();

            clippedCtx.drawImage(canvas, 0, 0, width, height);
            clippedCtx.restore();

            // Download the clipped image
            const link = document.createElement('a');
            link.download = 'qr-code-with-frame.png';
            link.href = clippedCanvas.toDataURL('image/png');
            link.click();
        });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Custom QR Code</h1>
            <div className={styles.qrWrapper} ref={qrWrapperRef}>
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
