import apiClient from './api';

const BookingService = {
  createBooking: (bookingData) => {
    console.log('Sending booking data:', bookingData);  // Log the data being sent

    return apiClient.post('/bookings/create_booking/', bookingData, {
      headers: {
        'Content-Type': 'application/json',  // Set headers without Authorization
      }
    })
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

        // Check if the error response contains non_field_errors
        if (error.response.data && error.response.data.non_field_errors) {
          // Handle specific backend error message
          throw new Error(error.response.data.non_field_errors.join(' '));
        }
      }
      throw new Error('Failed to create booking. Please try again.');
    });
  },

  getLocations: () => {
    return apiClient.get('/bookings/locations/', {
      headers: {
        'Content-Type': 'application/json',  // Ensure only Content-Type is set, without Authorization
      }
    })
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
