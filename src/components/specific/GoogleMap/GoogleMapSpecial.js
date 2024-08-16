import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, Circle } from '@react-google-maps/api';
import { getDistance } from 'geolib';

// Import your custom marker images
import customMarkerIcon from '../../../assets/images/MapMarker.png';  // Main marker icon
import customPositionMarkerIcon from '../../../assets/images/PositionMarker.png';  // User-selected position marker icon



const Map=  ({ center, onSaveLocation }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,  // Replace with your API key
  });
  

  useEffect(() => {
    console.log('Map center latitude:', center.lat);
    console.log('Map center longitude:', center.lng);
    console.log('Map center longitude:', center.radius);
  }, [center]);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };
  
  const wrapperStyle = {
    width: '550px',
    margin: '0 auto',  // Center the container
  };
  
  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };
  
  // Use latitude and longitude for the center
  const mapCenter = {
    lat: center.lat,
    lng: center.lng,
  };
  
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

  const handleMapClick = (event) => {
    const clickedLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    const distanceFromCenter = getDistance(mapCenter, clickedLocation);

    if (distanceFromCenter <= circleOptions.radius) {
      setSelectedLocation(clickedLocation);
    } else {
      alert('Please select a point within the marked area.');
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
      <button onClick={handleSave} style={{ marginTop: '10px', padding: '10px 20px', fontSize: '16px' }}>
        Save Location
      </button>
    </div>
  );
};

export default Map;
