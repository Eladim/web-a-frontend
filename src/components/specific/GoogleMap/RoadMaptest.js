import React from 'react';
import RoadMap from './RoadMap';

const App = () => {
  const start = { lat: 42.68735646111376, lng: 23.41534125026888 }; // New York City
  const end = { lat: 41.82864139423816, lng: 23.47109197416657 };  // Los Angeles

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&travelmode=driving`;

  return (
    <div>
      <h1>Road Map Example</h1>
      <RoadMap start={start} end={end} />
      <p>Navigate with Google Maps: <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">Click here</a></p>
    </div>
  );
};

export default App;
