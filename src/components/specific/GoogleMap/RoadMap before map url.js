import React, { useState, useEffect, useMemo } from 'react';
import { GoogleMap, DirectionsRenderer, Marker, Circle } from '@react-google-maps/api';
import { useLoadGoogleMapsApi } from '../../../hooks/useLoadGoogleMapsApi'; // Adjust the import path accordingly

import startMarkerIcon from '../../../assets/images/PersonPin.png';  // End marker icon
import customPositionMarkerIcon from '../../../assets/images/Pin.png';  // Start marker icon

const RoadMap = ({ start, end, mode = 'DRIVING' }) => { 
  const { isLoaded, loadError } = useLoadGoogleMapsApi();

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [path, setPath] = useState([]);
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);

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
            const path = result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }));
            setPath(path);
            setStartTime(Date.now()); // Initialize the start time
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  }, [isLoaded, start, end, mode]);

  useEffect(() => {
    if (path.length > 0 && startTime) {
      const totalTime = 3000; // Total time for the animation in milliseconds
      const interval = 16; // Frame rate (approximately 60 frames per second)

      const animate = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / totalTime, 1); // Progress from 0 to 1
        const easedProgress = easeOutCubic(progress); // Apply easing function

        const newIndex = Math.floor(easedProgress * (path.length - 1));
        setCurrentPositionIndex(newIndex);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      const easeOutCubic = t => (--t) * t * t + 1; // Cubic easing-out function

      requestAnimationFrame(animate);
    }
  }, [path, startTime]);

  

  const mapContainerStyle = {
    width: '100%',
    height: '550px',
  };

  const center = useMemo(() => ({
    lat: (start.lat + end.lat) / 2,
    lng: (start.lng + end.lng) / 2,
  }), [start, end]);
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=My+Location&waypoints=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&travelmode=driving`;

  const mapOptions = {
    styles: [
      {
        elementType: 'geometry',
        
        stylers: [{ color: '#f5f5f5' }]
      },
      
      {
        elementType: 'labels.icon',
        stylers: [{ visibility: 'on' }]
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
          <>
            <DirectionsRenderer
              directions={directionsResponse}
              options={{
                suppressMarkers: true, // Suppress default A and B markers
                polylineOptions: {
                  strokeColor: '#0080FF',
                  strokeOpacity: 0.8,
                  strokeWeight: 7, // Increase the weight for a bolder line
                },
              }}
            />
          </>
        )}

        {/* Custom Start Marker */}
        <Marker
          position={start}
          icon={{
            url: startMarkerIcon,
            scaledSize: new window.google.maps.Size(60, 60), // Adjust the size for a more refined look
          }}
        />

        {/* Custom End Marker */}
        <Marker
          position={end}
          icon={{
            url: customPositionMarkerIcon,
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
