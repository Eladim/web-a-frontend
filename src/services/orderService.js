// services/orderService.js

import apiClient from './api';

const OrderService = {
  /**
   * Fetch all orders that are not completed
   * @returns {Promise} - Promise resolving to the list of orders
   */
  getOrders() {
    return apiClient.get('/vehicles/orders/')
    .then(response => {
        console.log('Fetched Orders:', response.data);  // Log the fetched orders
        return response.data;
      })
      .catch(error => {
        console.error('There was an error fetching the orders!', error);
        throw error;
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
      

  /**
   * Mark an order as complete
   * @param {number} orderId - The ID of the order to mark as complete
   * @returns {Promise} - Promise resolving to the updated order
   */
  markOrderAsComplete(orderId) {
    return apiClient.post(`/vehicles/orders/${orderId}/complete/`)
      .then(response => {
        console.log('Order marked as complete successfully:', response.data);
        return response.data;
      })
      .catch(error => {
        console.error(`There was an error marking the order with ID ${orderId} as complete!`, error);
        throw error;
      });
  },

  /**
   * Fetch the details of a specific order by ID
   * @param {number} orderId - The ID of the order to fetch
   * @returns {Promise} - Promise resolving to the order details
   */
  getOrderById(orderId) {
    return apiClient.get(`/orders/${orderId}/`)
      .then(response => response.data)
      .catch(error => {
        console.error(`There was an error fetching the order with ID ${orderId}!`, error);
        throw error;
      });
  },

  /**
   * Assign a driver to an order
   * @param {number} orderId - The ID of the order to assign a driver
   * @param {number} driverId - The ID of the driver to assign
   * @returns {Promise} - Promise resolving to the updated order
   */
  assignDriver(orderId, driverId) {
    return apiClient.post(`/orders/${orderId}/`, { driver_id: driverId })
      .then(response => response.data)
      .catch(error => {
        console.error(`There was an error assigning a driver to order with ID ${orderId}!`, error);
        throw error;
      });
  }
  
};

export default OrderService;
