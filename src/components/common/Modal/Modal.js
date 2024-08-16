import React, { useState } from 'react';
import styles from './Modal.module.css';

const Modal = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsOpen(false);
        document.body.style.overflow = 'initial';
    };

    return (
        <>
            <button className={styles.modalButton} onClick={openModal}>
                Click here to login
            </button>
            <div className={`${styles.modal} ${isOpen ? styles.isOpen : ''}`}>
                <div className={styles.modalContainer}>
                    <div className={styles.modalLeft}>
                        <h1 className={styles.modalTitle}>Welcome!</h1>
                        <p className={styles.modalDesc}>Fanny pack hexagon food truck, street art waistcoat kitsch.</p>
                        <div className={styles.inputBlock}>
                            <label htmlFor="email" className={styles.inputLabel}>Email</label>
                            <input type="email" name="email" id="email" placeholder="Email" />
                        </div>
                        <div className={styles.inputBlock}>
                            <label htmlFor="password" className={styles.inputLabel}>Password</label>
                            <input type="password" name="password" id="password" placeholder="Password" />
                        </div>
                        <div className={styles.modalButtons}>
                            <a href="#" className={styles.forgotPassword}>Forgot your password?</a>
                            <button className={styles.inputButton}>Login</button>
                        </div>
                        <p className={styles.signUp}>Don't have an account? <a href="#">Sign up now</a></p>
                    </div>
                    <div className={styles.modalRight}>
                        <img src="https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=dfd2ec5a01006fd8c4d7592a381d3776&auto=format&fit=crop&w=1000&q=80" alt="" />
                    </div>
                    <button className={styles.iconButton} onClick={closeModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                            <path d="M 25 3 C 12.86158 3 3 12.86158 3 25 C 3 37.13842 12.86158 47 25 47 C 37.13842 47 47 37.13842 47 25 C 47 12.86158 37.13842 3 25 3 z M 25 5 C 36.05754 5 45 13.94246 45 25 C 45 36.05754 36.05754 45 25 45 C 13.94246 45 5 36.05754 5 25 C 5 13.94246 13.94246 5 25 5 z M 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.980469 15.990234 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Modal;
