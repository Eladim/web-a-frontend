import apiClient from './api';

// Define the DriverService object
const DriverService = {
  /**
   * Fetch all drivers
   * @returns {Promise} - Promise resolving to the list of drivers
   */
  getDrivers() {
    return apiClient.get('/vehicles/drivers/')
      .then(response => {
        console.log('Fetched Drivers:', response.data);
        return response.data; // Assuming the data returned is a list of drivers
      })
      .catch(error => {
        console.error('Error fetching drivers:', error);
        throw error;  // Re-throw the error to be handled by the calling function
      });
  },

    /**
   * Assign a driver to an order
   * @param {number} orderId - The ID of the order to assign a driver to
   * @param {number} driverId - The ID of the driver to assign
   * @returns {Promise} - Promise resolving to the updated order
   */

  assignDriverToOrder(orderId, driverId) {
    return apiClient.post(`/vehicles/driver-to-order/${orderId}/assign_driver/`, { driver_id: driverId })
      .then(response => {
        console.log('Driver assigned successfully:', response.data);
        return response.data;
      })
      .catch(error => {
        console.error('Error assigning driver:', error);
        throw error;
      });
  },

  
};

// Export the DriverService object
export default DriverService;
