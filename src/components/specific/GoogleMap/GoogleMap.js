import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { GoogleMap,  Marker, Circle } from '@react-google-maps/api';
import styles from './GoogleMap.module.css';
import { getDistance } from 'geolib';
import {useLoadGoogleMapsApi} from '../../../hooks/useLoadGoogleMapsApi'

// Import your custom marker images
import customMarkerIcon from '../../../assets/images/MapMarker.png';  // Main marker icon
import customPositionMarkerIcon from '../../../assets/images/PositionMarker.png';  // User-selected position marker icon

// Define libraries outside of the component
const libraries = ['places'];

const Map = ({ center, onSaveLocation }) => {
  const { isLoaded, loadError } = useLoadGoogleMapsApi();
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

  const mapCenter = useMemo(() => ({
    lat: center.lat,
    lng: center.lng,
  }), [center.lat, center.lng]);

  const radiusInMeters = center.radius;

  const radiusInDegreesLat = radiusInMeters / 111000;  // Latitude degrees
  const radiusInDegreesLng = radiusInMeters / 111000;  // Longitude degrees (approximate)
  const zoomLevel = 2;

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
      const currentCenter = map.getCenter();
      const startLatLng = {
        lat: currentCenter.lat(),
        lng: currentCenter.lng(),
      };

      animatePanTo(map, startLatLng, clickedLocation);
      setSelectedLocation(clickedLocation);
      setErrorMessage(null);
      
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

      if (
        currentLat > dynamicBounds.north ||
        currentLat < dynamicBounds.south ||
        currentLng > dynamicBounds.east ||
        currentLng < dynamicBounds.west
      ) {
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
        onSaveLocation(lat, lng);
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
        center={mapCenter}
        options={options}
        onLoad={mapInstance => setMap(mapInstance)}
        onClick={handleMapClick}
        onDragEnd={handleDragEnd}
      >
        <>
          <Circle
            center={mapCenter}
            options={circleOptions}
          />
          <Marker 
            position={mapCenter} 
            icon={{
              url: customMarkerIcon,
              scaledSize: new window.google.maps.Size(50, 50),
            }}
          />
          {selectedLocation && (
            <Marker 
              position={selectedLocation} 
              icon={{
                url: customPositionMarkerIcon,
                scaledSize: new window.google.maps.Size(40, 40),
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
      <hr className={styles.horizontalLine} />
    </div>
  );
};

export default Map;
