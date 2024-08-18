import React, { useState, useEffect } from 'react';
import BookingForm from '../../components/specific/BookingForm/BookingForm';
import ratesService from '../../services/ratesService';
import styles from './BookingPage.module.css';
import BookingService from '../../services/bookingService';
import { useParams } from 'react-router-dom';

const BookingPage = () => {
  const { hotelSlug } = useParams(); // Get hotelSlug from the URL
  const [locations, setLocations] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [commissionFree, setCommissionFree] = useState(true); // Default to true

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await BookingService.getLocations();
        setLocations(data);  // Store fetched locations

        // Check if the hotelSlug matches any qr_booking_url
        const matchingHotel = data.find(location => {
          // Ensure we're only checking locations of type 'hotel' with a valid qr_booking_url
          if (location.type === 'hotel' && location.qr_booking_url) {
            // Extract the last part of the URL to compare with hotelSlug
            const urlSlug = location.qr_booking_url.split('/').pop();
            return urlSlug === hotelSlug;
          }
          return false;
        });

        if (matchingHotel) {
          setCommissionFree(false);
          console.log(`Commission-free status set to false for hotel ${hotelSlug} with ID ${matchingHotel.id}`);
        } else {
          setCommissionFree(true);
          console.log("No matching hotel found, default commission-free set to true");
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setCommissionFree(true); // Default to true if there's an error
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

  }, [hotelSlug]);

  // Only render BookingForm if commissionFree has been determined
  if (commissionFree === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.bookingPageContainer}>
      {!isSubmitted && <h1>Book Your Ride</h1>}
      <BookingForm
        locations={locations}
        vehicleTypes={vehicleTypes}
        isSubmitted={isSubmitted}
        setIsSubmitted={setIsSubmitted}
        commissionFree={commissionFree}
      />
    </div>
  );
};

export default BookingPage;
