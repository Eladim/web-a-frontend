import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import html2canvas from 'html2canvas';
import styles from './Qr.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import logo from '../../../assets/images/tourismBluess.png';

const CustomQRCode = ({ fullReferralUrl }) => {
    const qrRef = useRef(null);
    const qrWrapperRef = useRef(null);
    const qrCode = useRef(null);

    useEffect(() => {
        qrCode.current = new QRCodeStyling({
            width: 500,
            height: 500,
            data: fullReferralUrl, // Use the fullReferralUrl prop instead of a hardcoded URL
            image: logo,
            dotsOptions: {
                color: "#555555",
                type: "extra-rounded"
            },
            cornersSquareOptions: {
                color: "#1f4d8a",
                type: "extra-rounded"
            },
            cornersDotOptions: {
                color: "#357ABD",
                type: "dot"
            },
            backgroundOptions: {
                color: "#ffffff",
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 10,
                imageSize: 0.55,
                hideBackgroundDots: true
            },
            qrOptions: {
                errorCorrectionLevel: "H"
            },
        });

        qrCode.current.append(qrRef.current);

        return () => qrCode.current.clear();
    }, [fullReferralUrl]);

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
        </div>
    );
};

export default CustomQRCode;
