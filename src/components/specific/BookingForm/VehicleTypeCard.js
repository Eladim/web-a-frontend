import React from 'react';
import styles from './VehicleTypeCard.module.css';

const VehicleTypeCard = ({ type, capacity, initialPrice, pricePerKm }) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <div className={styles.vehicleType}>{type}</div>


      <div className={styles.initialPrice}>{initialPrice}</div>
      </div>
      <div className={styles.cardBody}>
      <div className={styles.capacity}>Capacity: {capacity}</div>
        
        <div className={styles.pricePerKm}>{pricePerKm}/km</div>
      </div>
    </div>
  );
};

export default VehicleTypeCard;
