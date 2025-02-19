import React, { useEffect } from 'react';
import styles from './ScrollDown.module.css';

const ScrollDown = ({ onScrollTrigger }) => {
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > window.innerHeight / 3) {
                onScrollTrigger();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [onScrollTrigger]);

    return (
        <div className={styles.scrollDown}>
            SCROLL DOWN
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <path d="M16 3C8.832031 3 3 8.832031 3 16s5.832031 13 13 13 13-5.832031 13-13S23.167969 3 16 3zm0 2c6.085938 0 11 4.914063 11 11 0 6.085938-4.914062 11-11 11-6.085937 0-11-4.914062-11-11C5 9.914063 9.914063 5 16 5zm-1 4v10.28125l-4-4-1.40625 1.4375L16 23.125l6.40625-6.40625L21 15.28125l-4 4V9z" />
            </svg>
        </div>
    );
};

export default ScrollDown;
