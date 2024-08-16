import React, { useState, useEffect } from 'react';
import BookingForm from '../../components/specific/BookingForm/BookingForm';  // Adjust the import path as necessary
import ratesService from '../../services/ratesService'; // Import your service to fetch vehicles
import styles from './BookingPage.module.css';  // Import your CSS module
import BookingService from '../../services/bookingService';

const BookingPage = () => {
  const [locations, setLocations] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false); // Add isSubmitted state here
  

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await BookingService.getLocations();
        setLocations(data);  // Store fetched locations
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    
    const fetchVehicleTypes = async () => {
      try {
        const data = await ratesService.getVehicleTypes();
        setVehicleTypes(data);
      } catch (error) {
        console.error('Failed to fetch vehicle types:', error);
      }
    };


    fetchLocations();
    fetchVehicleTypes();

    
  }, []);

  return (
    <div className={styles.bookingPageContainer}>
      {!isSubmitted && <h1>Book Your Ride</h1>} {/* Conditionally render the title */}
      <BookingForm locations={locations} vehicleTypes={vehicleTypes} isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted} />
    </div>
  );
};

export default BookingPage;
