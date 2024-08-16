import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

const Button = ({ onClick, children, className, type = "button" }) => {
    return (
        <button className={`${styles.button} ${className}`} onClick={onClick} type={type}>
            {children}
        </button>
    );
};

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    type: PropTypes.string,
};

export default Button;
