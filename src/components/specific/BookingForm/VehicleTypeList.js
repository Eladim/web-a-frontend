import React from 'react';
import VehicleTypeCard from './VehicleTypeCard';
import styles from './VehicleTypeList.module.css';

const VehicleTypeList = ({ vehicleTypes }) => {
  return (
    <div className={styles.vehicleTypeListContainer}>
      {vehicleTypes.map((vehicle) => (
        <VehicleTypeCard
          key={vehicle.id}
          type={vehicle.vehicle_type}
          capacity={vehicle.capacity}
          initialPrice={vehicle.booking_price} // Replace with your actual initial price data
          pricePerKm={vehicle.cost_per_km} // Replace with your actual price per km data
        />
      ))}
    </div>
  );
};

export default VehicleTypeList;
