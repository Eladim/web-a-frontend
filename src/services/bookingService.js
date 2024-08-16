import apiClient from './api';

const BookingService = {
  createBooking: (bookingData) => {
    console.log('Sending booking data:', bookingData);  // Log the data being sent

    return apiClient.post('/bookings/create_booking/', bookingData)
      .then(response => {
        console.log('Booking created successfully:', response.data);  // Log success response
        return response.data;
      })
      .catch(error => {
        console.error('Error creating booking:', error);  // Log error details
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        }
        throw error;
      });
  },

  getLocations: () => {
    return apiClient.get('/bookings/locations/')
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error('Error fetching locations:', error);
        throw error;
      });
  },
  
  // You can add more methods here for other booking-related operations, with similar logging patterns
};

export default BookingService;
