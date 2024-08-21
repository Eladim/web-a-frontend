import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import styles from './Qr.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import logo from '../../../assets/images/tourismBluess.png';

const CustomQRCode = ({ fullReferralUrl, onDownload }) => {
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
                    onClick={onDownload} // Trigger download on click
                />
                <h1 className={styles.pickMeUp}>Scan me</h1>
            </div>
        </div>
    );
};

export default CustomQRCode;
