import React, { useState, useEffect } from 'react';
import Map from './GoogleMap'; // Adjust the import path as needed
import BookingService from '../../../services/bookingService';

const TestMap = () => {
  const [locations, setLocations] = useState([]); // Initialize as an empty array
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [savedLat, setSavedLat] = useState(null);  // State variable for latitude
  const [savedLng, setSavedLng] = useState(null);  // State variable for longitude

  useEffect(() => {
    // Fetch locations from the BookingService
    BookingService.getLocations()
      .then((data) => {
        setLocations(data);
        if (data.length > 0) {
          setSelectedLocation(data[0]); // Default to the first location
        }
      })
      .catch((error) => {
        console.error('Error fetching locations:', error);
      });
  }, []);

  const handleLocationChange = (event) => {
    const locationId = parseInt(event.target.value);
    const location = locations.find(loc => loc.id === locationId);
    setSelectedLocation(location);

    // Reset the saved location when a new location is selected
    setSavedLat(null);
    setSavedLng(null);
  };

  const handleSaveLocation = (lat, lng) => {
    setSavedLat(lat);  // Update the latitude state variable
    setSavedLng(lng);  // Update the longitude state variable
    console.log(`Saved Location: Latitude: ${lat}, Longitude: ${lng}`);
  };

  return (
    <div>
      {locations.length > 0 ? (
        <>
          <select onChange={handleLocationChange}>
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>

          {selectedLocation && (
            <Map
              center={{
                lat: selectedLocation.latitude,
                lng: selectedLocation.longitude,
                radius: selectedLocation.perimeter_meters || 300, // Default radius to 300 if not provided
              }}
              onSaveLocation={handleSaveLocation} // Pass the handleSaveLocation function
            />
          )}
        </>
      ) : (
        <p>Loading locations...</p>
      )}
      {savedLat !== null && savedLng !== null && (
        <p>Last saved location: Latitude: {savedLat}, Longitude: {savedLng}</p>
      )}
    </div>
  );
};

export default TestMap;
