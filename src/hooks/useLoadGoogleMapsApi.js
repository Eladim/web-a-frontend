import { useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places']; // Define libraries outside to ensure they are stable

export const useLoadGoogleMapsApi = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  return { isLoaded, loadError };
};
