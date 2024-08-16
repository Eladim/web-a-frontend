import React from 'react';
import styles from './VehicleTypeModal.module.css';

const VehicleTypeModal = ({ vehicleTypes, isOpen, onClose, onSelectVehicle }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Select Vehicle Type</h2>
        <ul className={styles.vehicleList}>
          {vehicleTypes.map(vehicle => (
            <li
              key={vehicle.id}
              className={styles.vehicleItem}
              onClick={() => onSelectVehicle(vehicle.type)}
            >
              <div className={styles.vehicleInfo}>
                <span className={styles.vehicleType}>{vehicle.type}</span>
                <span className={styles.capacity}>Capacity: {vehicle.capacity}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.closeButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleTypeModal;
