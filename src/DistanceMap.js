import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 42.698334,
  lng: 23.319941
};

const DistanceMap = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);

  const directionsCallback = useCallback((response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setDirectionsResponse(response);
      } else {
        console.log('response: ', response);
      }
    }
  }, []);

  const origin =  'кв. Глазне, ул. Бански суходол 3, 2770 Bansko, Bulgaria'
  const destination = 'Noviyat Grad, ul. "Hristo G. Danov" 14, 2770 Bansko, Bulgaria'

  if (loadError) {
    return <div>Error loading Google Maps: {loadError.message}</div>;
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10} // Set an initial zoom level
    >
      <DirectionsService
        options={{
          destination: destination,
          origin: origin,
          travelMode: 'DRIVING'
        }}
        callback={directionsCallback}
      />
      {directionsResponse && (
        <DirectionsRenderer
          options={{
            directions: directionsResponse,
            preserveViewport: true // Prevent the DirectionsRenderer from changing the zoom level
          }}
        />
      )}
    </GoogleMap>
  ) : <div>Loading...</div>;
}

export default React.memo(DistanceMap);
