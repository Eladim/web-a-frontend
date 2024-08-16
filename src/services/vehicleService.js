import apiClient from './api';

const VehicleService = {
  // Method to fetch the list of vehicle types
  getVehicleTypes: async () => {
    try {
      const response = await apiClient.get('/vehicles/types/');
      console.log('Vehicle types fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching vehicle types:', error);
      throw error;
    }
  },
  
  // You can add more methods here if needed, like for adding, updating, or deleting vehicle types
};

export default VehicleService;
