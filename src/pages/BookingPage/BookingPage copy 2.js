import React, { useState, useEffect } from 'react';
import BookingForm from '../../components/specific/BookingForm/BookingForm';  // Adjust the import path as necessary
import ratesService from '../../services/ratesService'; // Import your service to fetch vehicles
import styles from './BookingPage.module.css';  // Import your CSS module
import BookingService from '../../services/bookingService';
import { useParams } from 'react-router-dom';

const BookingPage = () => {
  const { hotelSlug } = useParams(); // Get hotelSlug from the URL
  const [locations, setLocations] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false); // Add isSubmitted state here
  const [commissionFree, setCommissionFree] = useState(true); // Default to true

  useEffect(() => {
    if (hotelSlug) {
      // If a hotel slug is present, set commission_free to false
      setCommissionFree(false);
      console.log(`Commission-free status set to false for hotel ${hotelSlug}`);
    } else {
      console.log("No hotelSlug found in URL");
    }
  }, [hotelSlug]);

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
      {!isSubmitted && <h1>Book Your Ride</h1>}
      <BookingForm
        locations={locations}
        vehicleTypes={vehicleTypes}
        isSubmitted={isSubmitted}
        setIsSubmitted={setIsSubmitted}
        commissionFree={commissionFree}  // Pass commissionFree to the form
      />
    </div>
  );
};

export default BookingPage;
