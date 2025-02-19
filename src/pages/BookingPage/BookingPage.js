import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BookingForm from '../../components/specific/BookingForm/BookingForm';
import ratesService from '../../services/ratesService';
import styles from './BookingPage.module.css';
import BookingService from '../../services/bookingService';

const BookingPage = () => {
  const { hotelSlug } = useParams(); // Get hotelSlug from the URL
  const navigate = useNavigate(); // For navigation
  const [locations, setLocations] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [commissionFree, setCommissionFree] = useState(true); // Default to true

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await BookingService.getLocations();

        if (hotelSlug) {
          // Check if the hotelSlug matches any qr_booking_url
          const matchingHotel = data.find(location => {
            if (location.type === 'hotel' && location.qr_booking_url) {
              const urlSlug = location.qr_booking_url.split('/').pop();
              return urlSlug === hotelSlug.toLowerCase(); // Ensure comparison is case-insensitive
            }
            return false;
          });

          if (matchingHotel) {
            setCommissionFree(false);
            console.log(`Commission-free status set to false for hotel ${hotelSlug} with ID ${matchingHotel.id}`);

            // Filter out hotels and add only the matching hotel
            const filteredLocations = data.filter(location => location.type !== 'hotel');
            filteredLocations.push(matchingHotel);

            setLocations(filteredLocations);
          } else {
            console.log("No matching hotel found, redirecting to /reservation");
            navigate('/reservation'); // Redirect if no hotel matches
          }
        } else {
          // If no hotelSlug is provided, just use all locations
          setLocations(data);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setCommissionFree(true); // Default to true if there's an error
        if (hotelSlug) {
          navigate('/reservation'); // Redirect in case of error when a hotelSlug is present
        }
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
  }, [hotelSlug, navigate]);

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
