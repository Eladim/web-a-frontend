import React, { useState, useEffect, useMemo } from 'react';
import { GoogleMap, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { useLoadGoogleMapsApi } from '../../../hooks/useLoadGoogleMapsApi'; // Adjust the import path accordingly

import startMarkerIcon from '../../../assets/images/Pin.png';  // End marker icon
import customPositionMarkerIcon from '../../../assets/images/Pin.png';  // Start marker icon

const RoadMap = ({ start, end, mode = 'DRIVING' }) => { 
  const { isLoaded, loadError } = useLoadGoogleMapsApi();

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    if (isLoaded && start && end) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: start,
          destination: end,
          travelMode: window.google.maps.TravelMode[mode],
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
            setDistance(result.routes[0].legs[0].distance.text);
            setDuration(result.routes[0].legs[0].duration.text);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  }, [isLoaded, start, end, mode]);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = useMemo(() => ({
    lat: (start.lat + end.lat) / 2,
    lng: (start.lng + end.lng) / 2,
  }), [start, end]);

  const mapOptions = {
    styles: [
      {
        elementType: 'geometry',
        stylers: [{ color: '#f5f5f5' }]
      },
      {
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [{ color: '#616161' }]
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#f5f5f5' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#dadada' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#c9c9c9' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9e9e9e' }]
      }
    ],
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
        options={mapOptions} // Apply custom map styles
      >
        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            options={{
              suppressMarkers: true, // Suppress default A and B markers
              polylineOptions: {
                strokeColor: '#0080FF',
                strokeOpacity: 0.8,
                strokeWeight: 6, // Increase the weight for a bolder line
              },
            }}
          />
        )}
        
        {/* Custom Start Marker */}
        <Marker
          position={start}
          icon={{
            url: customPositionMarkerIcon,
            scaledSize: new window.google.maps.Size(40, 40), // Adjust the size for a more refined look
          }}
        />
        
        {/* Custom End Marker */}
        <Marker
          position={end}
          icon={{
            url: startMarkerIcon,
            scaledSize: new window.google.maps.Size(40, 40), // Adjust the size for a more refined look
          }}
        />

      </GoogleMap>
      {distance && duration && (
        <div>
          <p>Distance: {distance}</p>
          <p>Duration: {duration}</p>
        </div>
      )}
    </div>
  );
};

export default RoadMap;
