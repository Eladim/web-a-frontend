import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const mapContainerStyle = {
    width: '100%',
    height: '400px',
};

const center = {
    lat: 42.68547485748699,
    lng: 23.400799697692207,
};

const DistanceAndDirectionsMap = () => {
    const [directionsResponse, setDirectionsResponse] = useState(null);

    const directionsCallback = useCallback((response) => {
        if (response !== null) {
            if (response.status === 'OK') {
                setDirectionsResponse(response);
            } else {
                console.error('Error fetching directions:', response);
            }
        }
    }, []);

    useEffect(() => {
        // You can trigger the DirectionsService here if you want to fetch directions on mount.
    }, []);

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={7}
            >
                <DirectionsService
                    options={{
                        destination: { lat: 41.836381523297995, lng: 23.477137576127376 },
                        origin: { lat: 42.68547485748699, lng: 23.400799697692207 },
                        travelMode: 'DRIVING',
                    }}
                    callback={directionsCallback}
                />
                {directionsResponse && (
                    <DirectionsRenderer
                        options={{
                            directions: directionsResponse,
                        }}
                    />
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default DistanceAndDirectionsMap;
