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
        <p>
            Here is some text and an info icon
            <span className={styles.container}>
                <span
                    className={styles.iconContainer}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleMouseEnter}
                    onTouchEnd={handleMouseLeave}
                >
                    <FontAwesomeIcon icon={faInfoCircle} className={styles.icon} />
                    {showList && (
                        <ul className={styles.list}>
                            {filteredFees.length > 0 ? (
                                filteredFees.map(fee => (
                                    <li key={fee.id}>{fee.name}</li>
                                ))
                            ) : (
                                <li>No Fees applied</li>
                            )}
                        </ul>
                    )}
                </span>
            </span>
        </p>
    );
};

export default InfoIcon;
