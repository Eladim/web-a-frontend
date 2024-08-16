import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './InfoIcon.module.css'; // Adjust the path to match the renamed CSS module

const InfoIcon = ({ filteredFees = [] }) => {
    const [showList, setShowList] = useState(false);

    const handleMouseEnter = () => {
        setShowList(true);
    };

    const handleMouseLeave = () => {
        setShowList(false);
    };

    return (
        <div>
            <p>HI</p>
            <p>HI</p>
            <p>HI</p>
            <p>HI</p>
            <p>HI</p> 
            <div className={styles.buttonAndTotalContainer}>
                <p className={styles.totalCost}>
                    Service Fee: N/A
                    <span className={styles.container}>
                        <span
                            className={styles.iconContainer}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onTouchStart={handleMouseEnter}
                            onTouchEnd={handleMouseLeave}
                        >
                            <FontAwesomeIcon icon={faInfoCircle} className={styles.icon} />
                            <ul className={styles.list}>
                                {filteredFees.length > 0 ? (
                                    filteredFees.map(fee => (
                                        <li key={fee.id}>{fee.name}</li>
                                    ))
                                ) : (
                                    <li>No Fees applied</li>
                                )}
                            </ul>
                        </span>
                    </span>
                </p>
                <p className={styles.totalCost}>
                    Total Cost: €0.00
                </p>
            </div>
        </div>
    );
};

export default InfoIcon;
