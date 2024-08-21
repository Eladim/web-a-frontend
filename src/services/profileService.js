import apiClient from './api';

const profileService = {
  // Fetch the user's profile data
  getProfile: async () => {
    try {
      const response = await apiClient.get('users/profile/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile', error);
      throw error;
    }
  },

  // Update the user's profile data
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('users/profile/', profileData);
      return response.data;
    } catch (error) {
      console.error('Failed to update profile', error);
      throw error;
    }
  },
};

export default profileService;
