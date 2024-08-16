import React, { useState } from 'react';
import Modal from '../../components/common/Modal/Modal.js';
import ScrollDown from '../../components/common/ScrollDown/ScrollDown';
import styles from './LoginPage.module.css';

const LoginPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleScrollTrigger = () => {
        setIsModalOpen(true);
    };

    return (
        <div className={styles.container}>
            {!isModalOpen && <ScrollDown onScrollTrigger={handleScrollTrigger} />}
            <Modal />
        </div>
    );
};

export default LoginPage;
