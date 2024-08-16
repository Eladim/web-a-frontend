import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { GoogleMap, useLoadScript, Marker, Circle } from '@react-google-maps/api';
import styles from './GoogleMap.module.css';
import { getDistance } from 'geolib';

// Import your custom marker images
import customMarkerIcon from '../../../assets/images/MapMarker.png';  // Main marker icon
import customPositionMarkerIcon from '../../../assets/images/PositionMarker.png';  // User-selected position marker icon




const Map=  ({ center, onSaveLocation }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,  // Replace with your API key
  });

  const [errorMessage, setErrorMessage] = useState(null);
  
  

  useEffect(() => {
    console.log('Map center latitude:', center.lat);
    console.log('Map center longitude:', center.lng);
    console.log('Map radius:', center.radius);
  }, [center]);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };
  
  const wrapperStyle = {
    width: '100%',
    margin: '0 auto',  // Center the container
  };
  
  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };
  
  // Use latitude and longitude for the center
  const mapCenter = useMemo(() => ({
    lat: center.lat,
    lng: center.lng,
  }), [center.lat, center.lng]);
  
  
  const radiusInMeters = center.radius; // Radius of the circle in meters
  
  // Convert radius from meters to degrees (approximate)
  const radiusInDegreesLat = (radiusInMeters / 111000);  // Latitude degrees
  const radiusInDegreesLng = (radiusInMeters / 111000);  // Longitude degrees (approximate)
  const zoomLevel = 0.75;
  
  // Calculate dynamic bounds relative to the map center and 5 times the radius

  
  const circleOptions = {
    strokeColor: '#0080FF',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#B2D8FF',
    fillOpacity: 0.20,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: radiusInMeters,  // Radius in meters
    zIndex: 1,
  };

  const [map, setMap] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);


  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };
  const animatePanTo = (map, startLatLng, endLatLng, duration = 0) => {
    const startTime = performance.now();
  
    const animate = () => {
      const currentTime = performance.now();
      const timeElapsed = (currentTime - startTime) / duration;
      const progress = Math.min(timeElapsed, 1);
  
      const easedProgress = easeInOutQuad(progress);
  
      const newLat = startLatLng.lat + (endLatLng.lat - startLatLng.lat) * easedProgress;
      const newLng = startLatLng.lng + (endLatLng.lng - startLatLng.lng) * easedProgress;
  
      map.panTo({ lat: newLat, lng: newLng });
  
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
  
    requestAnimationFrame(animate);
  };
  
  

  const handleMapClick = (event) => {
    const clickedLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      
    };
    onSaveLocation(clickedLocation.lat, clickedLocation.lng);

    const distanceFromCenter = getDistance(mapCenter, clickedLocation);

    if (distanceFromCenter <= circleOptions.radius) {
      
  
      // Get the current center of the map
      const currentCenter = map.getCenter();
      const startLatLng = {
        lat: currentCenter.lat(),
        lng: currentCenter.lng(),
      };
  
      // Animate panning to the clicked location
      animatePanTo(map, startLatLng, clickedLocation);
      setSelectedLocation(clickedLocation);
      setErrorMessage(null); // Clear any previous error messages
    } else {
      setErrorMessage('Please select a point within the marked area.');
    }
  };

  const handleDragEnd = useCallback(() => {
    if (map && center) {

      const dynamicBounds = {
        north: center.lat + zoomLevel * radiusInDegreesLat,
        south: center.lat - zoomLevel * radiusInDegreesLat,
        east: center.lng + zoomLevel * radiusInDegreesLng,
        west: center.lng - zoomLevel * radiusInDegreesLng,
      };

      const currentCenter = map.getCenter();
      const currentLat = currentCenter.lat();
      const currentLng = currentCenter.lng();

      // Check if the current center is outside the allowed bounds
      if (
        currentLat > dynamicBounds.north ||
        currentLat < dynamicBounds.south ||
        currentLng > dynamicBounds.east ||
        currentLng < dynamicBounds.west
      ) {
        // Pan back to the closest allowed point within the bounds
        const boundedLat = Math.min(Math.max(currentLat, dynamicBounds.south), dynamicBounds.north);
        const boundedLng = Math.min(Math.max(currentLng, dynamicBounds.west), dynamicBounds.east);
        map.panTo({ lat: boundedLat, lng: boundedLng });
      }
    }
  }, [map, center]);

  const handleSave = () => {
    if (selectedLocation) {
      const { lat, lng } = selectedLocation;
      if (onSaveLocation) {
        onSaveLocation(lat, lng);  // Pass lat and lng to the parent component
      }
    } else {
      alert('No location selected.');
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div style={wrapperStyle}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={mapCenter}  // Center on the specified latitude and longitude
        options={options}
        onLoad={mapInstance => setMap(mapInstance)}  // Capture the map instance
        onClick={handleMapClick}  // Handle map clicks
        onDragEnd={handleDragEnd}  // Handle map drag end to enforce soft constraints
      >
        <>
          <Circle
            center={mapCenter}
            options={circleOptions}  // Options for the circle
          />
          <Marker 
            position={mapCenter} 
            icon={{
              url: customMarkerIcon,
              scaledSize: new window.google.maps.Size(50, 50),  // Adjust the size as needed
            }}  // Custom larger marker icon
          />
          {selectedLocation && (
            <Marker 
              position={selectedLocation} 
              icon={{
                url: customPositionMarkerIcon,  // Use the custom icon for the user's marker
                scaledSize: new window.google.maps.Size(40, 40),  // Adjust the size as needed
              }}  
            />
          )}
        </>
      </GoogleMap>
      {errorMessage && (
      <div className={styles.formError}>
        <p>{errorMessage}</p>
      </div>
    )}
      <button type="button" onClick={handleSave}>
        Save Location
      </button>
    </div>
  );
};

export default Map;
