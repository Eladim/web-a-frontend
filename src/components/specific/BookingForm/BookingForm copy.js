import React, { useState, useEffect } from 'react';
import BookingService from '../../../services/bookingService';
import FormInput from './FormInput';
import styles from './BookingForm.module.css';
import VehicleTypeList from './VehicleTypeList';
import Map from '../GoogleMap/GoogleMap';  // Import the GoogleMap component
import RoadMap from '../GoogleMap/RoadMap'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const BookingForm = ({ vehicleTypes, locations, isSubmitted, setIsSubmitted }) => {
    const [formData, setFormData] = useState({
        client: '',
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        vehicle_type: 'STANDARD_CAR',
        type: 'not_specified',
        group_size: 1,
        pick_up_time: '',
        from_location: '',
        to_location: '',
        notes: '',
        from_lat: '',
        from_lng: '',
        to_lat: '',
        to_lng: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [distanceToAirport, setDistanceToAirport] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [minDateTime, setMinDateTime] = useState('');
    const [totalPriceAfterFee, setTotalPriceAfterFee] = useState(null);
    const [isFormComplete, setIsFormComplete] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [savedLat, setSavedLat] = useState(null);  // State variable for latitude
    const [savedLng, setSavedLng] = useState(null);  // State variable for longitude
    const [selectedMapType, setSelectedMapType] = useState(''); // 'from' or 'to'
    const [showFromMap, setShowFromMap] = useState(false); // State to control "From Location" map visibility
    const [showToMap, setShowToMap] = useState(false); // State to control "To Location" map visibility
    const [fromLocation, setFromLocation] = useState(null);
    const [toLocation, setToLocation] = useState(null);
    const [savedFromLat, setSavedFromLat] = useState(null);  // State variable for "From" latitude
    const [savedFromLng, setSavedFromLng] = useState(null);  // State variable for "From" longitude
    const [savedToLat, setSavedToLat] = useState(null);  // State variable for "To" latitude
    const [savedToLng, setSavedToLng] = useState(null);  // State variable for "To" longitude
    const [renderFromMap, setRenderFromMap] = useState(false);
    const [renderToMap, setRenderToMap] = useState(false);




    // Function to check if form is complete
    const checkIsFormComplete = (formData) => {
        return (
            formData.type &&
            formData.from_location &&
            formData.to_location &&
            formData.vehicle_type &&
            formData.notes
        );
    };


    useEffect(() => {
        // Fetch locations from API





        let selectedLocation = null;
        let distanceToAirport = 0;
        let selectedVehicle = null;

        if (formData.type === 'arrival') {
            selectedLocation = locations.find(loc => loc.id === parseInt(formData.to_location));
        } else if (formData.type === 'departure') {
            selectedLocation = locations.find(loc => loc.id === parseInt(formData.from_location));
        }

        if (selectedLocation && selectedLocation.type === 'hotel') {
            distanceToAirport = selectedLocation.distance_to_airport;
            console.log(`Retrieved Distance to Airport: ${distanceToAirport} km`);
        }

        setIsFormComplete(checkIsFormComplete(formData));
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const localISOTime = new Date(now.getTime() - (offset * 60 * 1000)).toISOString().slice(0, 16);
        setMinDateTime(localISOTime);

        const normalizedValueForLogging = normalizeVehicleTypeForLogging(formData.vehicle_type);

        selectedVehicle = vehicleTypes.find(
            vehicle => vehicle.vehicle_type === normalizedValueForLogging
        );

        if (selectedVehicle) {
            console.log(`Retrieved Booking Price: ${selectedVehicle.booking_price}`);
            console.log(`Retrieved Cost per KM: ${selectedVehicle.cost_per_km}`);

            const activeFee = selectedVehicle.active_fee;
            const bookingPrice = parseFloat(selectedVehicle.booking_price.replace('€', ''));
            const costPerKm = parseFloat(selectedVehicle.cost_per_km.replace('€', ''));

            const activeFeeMultiplier = activeFee / 100;
            const totalPriceBeforeFee = (distanceToAirport * costPerKm) + bookingPrice;
            const totalPriceAfterFee = totalPriceBeforeFee * (1 + activeFeeMultiplier);

            console.log(`Total Price Before Fee: (€${totalPriceBeforeFee.toFixed(2)})`);
            console.log(`Active Fee Applied: ${activeFee}%`);
            console.log(`Total Price After Fee: €${totalPriceAfterFee.toFixed(2)}`);

            setTotalPriceAfterFee(totalPriceAfterFee);
        } else {
            console.log('No valid vehicle type selected for calculation.');
        }
    }, [formData, locations, vehicleTypes]);

    // Handle changes to "From Location"
    useEffect(() => {
        const location = locations.find(loc => loc.id === parseInt(formData.from_location));
        setFromLocation(location);
    }, [formData.from_location, formData.type, locations]);

    // Handle changes to "To Location"
    useEffect(() => {
        const location = locations.find(loc => loc.id === parseInt(formData.to_location));
        setToLocation(location);

    }, [formData.to_location, formData.type, locations]);

    const handleCombinedChange = (event, type) => {
        handleChange(event);           // Call the original handleChange
        handleLocationChange(event, type); 
          // Call the handleLocationChange with the type
    };



    const handleSaveLocation = (lat, lng) => {
        if (selectedMapType === 'from') {
            setSavedFromLat(lat);  // Update the "From" latitude state variable
            setSavedFromLng(lng);  // Update the "From" longitude state variable

            // Update formData for "From" location
            setFormData(prevData => ({
                ...prevData,
                from_lat: lat,
                from_lng: lng,
            }));

            console.log(`Saved From Location: Latitude: ${lat}, Longitude: ${lng}`);
        } else if (selectedMapType === 'to') {
            setSavedToLat(lat);  // Update the "To" latitude state variable
            setSavedToLng(lng);  // Update the "To" longitude state variable

            // Update formData for "To" location
            setFormData(prevData => ({
                ...prevData,
                to_lat: lat,
                to_lng: lng,
            }));

            console.log(`Saved To Location: Latitude: ${lat}, Longitude: ${lng}`);
        }
    };




    const handleLocationChange = (event, type) => {
        const locationId = parseInt(event.target.value);
        const location = locations.find(loc => loc.id === locationId);
    
        setSelectedLocation(location);
    
        if (type === 'from') {
            
            setSelectedMapType(type);
            setFormData(prevData => ({
                ...prevData,
                from_location: locationId,
                from_lat: '', // Reset latitude
                from_lng: '', // Reset longitude
            }));
            setSavedFromLat(null);
            setSavedFromLng(null);
    
            if (event.target.value === "") {
                setShowFromMap(false);  // Hide the "From Location" map if the default is selected
                setRenderFromMap(false); // Stop rendering the map
            } else {
                // Delay rendering the map if a valid location is selected
                // setShowToMap(false);                                                                //// THIS IS RESPONSIBLE FOR THE SWAP
                setShowFromMap(true);
                setTimeout(() => {
                    setRenderFromMap(true);
                }, 500); // 500ms delay before rendering the map
            }
        } else if (type === 'to') {
            
            setSelectedMapType(type);
            setFormData(prevData => ({
                ...prevData,
                to_location: locationId,
                to_lat: '', // Reset latitude
                to_lng: '', // Reset longitude
            }));
            setSavedToLat(null);
            setSavedToLng(null);
    
            if (event.target.value === "") {
                setShowToMap(false);  // Hide the "To Location" map if the default is selected
                setRenderToMap(false); // Stop rendering the map
            } else {
                // Delay rendering the map if a valid location is selected
                // setShowFromMap(false);                                                                  ///// THIS IS RESPONSIBLE FOR THE SWAP
                setShowToMap(true);
                setTimeout(() => {
                    setRenderToMap(true);
                }, 500); // 500ms delay before rendering the map
            }
        }
    };
    const handleMapToggle = (type) => {
        if (type === 'from') {
            setShowFromMap(prev => !prev);  // Toggle "From Location" map visibility
            setShowToMap(false);            // Ensure "To Location" map is closed

            // Delay the rendering of the "From Location" map
            if (!showFromMap) { // If the map is being opened
                setTimeout(() => {
                    setRenderFromMap(true);
                }, 500); // 1 second delay
            } else {
                setRenderFromMap(false);
            }
            setRenderToMap(false); // Immediately hide the "To Location" map
        } else if (type === 'to') {
            setShowToMap(prev => !prev);  // Toggle "To Location" map visibility
            setShowFromMap(false);        // Ensure "From Location" map is closed

            // Delay the rendering of the "To Location" map
            if (!showToMap) { // If the map is being opened
                setTimeout(() => {
                    setRenderToMap(true);
                }, 500); // 1 second delay
            } else {
                setRenderToMap(false);
            }
            setRenderFromMap(false); // Immediately hide the "From Location" map
        }
        setSelectedMapType(type);  // Toggle the visibility of the map
    };


    const handleToggleShowAll = () => {
        setShowAll(!showAll);
    };

    const normalizeVehicleTypeForLogging = (vehicleType) => {
        switch (vehicleType.toLowerCase()) {
            case 'standard':
                return 'Standard Car';
            case 'executive':
                return 'Executive Car';
            case 'van':
                return 'Van';
            case 'minibus':
                return 'Minibus';
            default:

                return vehicleType;  // Return the original value for other types
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        console.log(`Retrieving Distance`);

    };

    const getFilteredLocations = (type, locationType) => {
        if (type === 'arrival') {
            // For arrival, show transfer points in 'from_location' and hotels in 'to_location'
            if (locationType === 'TRANSFER_POINT') {
                return locations.filter(loc => loc.type === 'transfer_point');
            } else if (locationType === 'HOTEL') {
                return locations.filter(loc => loc.type === 'hotel');
            }
        } else if (type === 'departure') {
            // For departure, show hotels in 'from_location' and transfer points in 'to_location'
            if (locationType === 'HOTEL') {
                return locations.filter(loc => loc.type === 'hotel');
            } else if (locationType === 'TRANSFER_POINT') {
                return locations.filter(loc => loc.type === 'transfer_point');
            }
        }
        // Default to showing all locations if no specific type is selected
        return locations;
    };



    const getNotesPlaceholder = (type) => {
        if (type === 'arrival') {
            return 'Flight Ticket or Airport Terminal details';
        } else if (type === 'departure') {
            return 'Specify Address Location';
        }
        return ''; // No placeholder if type is not specified or is not 'arrival' or 'departure'
    };

    const handleSubmit = async (e) => {
        setIsSubmitting(true);

        e.preventDefault();

        try {
            const response = await BookingService.createBooking(formData);
            console.log('Booking successful:', response);
            setIsSubmitted(true);  // Show success message
            setTimeout(() => {
                setAnimate(true);
            }, 100);
        } catch (error) {
            console.error('Booking submission failed:', error);
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            }

        } finally {
            setIsSubmitting(false);
        }
    };

    // Create the start and end coordinates from formData dynamically
    const start = formData.from_lat && formData.from_lng ? {
        lat: parseFloat(formData.from_lat),
        lng: parseFloat(formData.from_lng),
    } : null;

    const end = formData.to_lat && formData.to_lng ? {
        lat: parseFloat(formData.to_lat),
        lng: parseFloat(formData.to_lng),
    } : null;

    return (
        <div className={styles.bookingFormContainer}>
            {isSubmitted ? (
                <div className={`${styles.successMessage} ${animate ? styles.shrink : ''}`}>
                    <h2>Reservation Confirmed</h2>
                    <p>Your reservation was received, and we've sent an email to <strong>{formData.guest_email}</strong> with your order details. Thank you for choosing our services!</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {!formData.client && (
                        <>
                            <FormInput
                                label="Name"
                                name="guest_name"
                                value={formData.guest_name}
                                onChange={handleChange}
                                error={errors.guest_name}
                                placeholder={"Ivan Borisov"}
                                required
                            />
                            <FormInput
                                label="Email"
                                type="email"
                                name="guest_email"
                                value={formData.guest_email}
                                onChange={handleChange}
                                error={errors.guest_email}
                                placeholder={"name@example.com"}
                                required
                            />
                            <FormInput
                                label="Phone"
                                name="guest_phone"
                                value={formData.guest_phone}
                                onChange={handleChange}
                                error={errors.guest_phone}
                                placeholder={"+359 87 574 7658"}
                                required
                            />
                        </>
                    )}
                    <div className={styles.vehicleTypeContainer}>

                        <FormInput
                            label="Vehicle Type"
                            type="select"
                            name="vehicle_type"
                            value={formData.vehicle_type}
                            onChange={handleChange}
                            error={errors.vehicle_type}
                            required
                        >
                            <option value="">Select Vehicle Type</option>
                            <option value="standard">Standard Car</option>
                            <option value="executive">Executive Car</option>
                            <option value="van">Van</option>
                            <option value="minibus">Minibus</option>
                        </FormInput>


                        <div className={styles.toggleContainer}>
                            <span>View Prices</span>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={showAll}
                                    onChange={handleToggleShowAll}
                                    className={styles.toggleInput}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                    </div>

                    {/* Conditionally render the VehicleTypeList */}
                    {/* Conditionally render the VehicleTypeList with animation */}
                    <div className={`${styles.vehicleTypeListContainer} ${showAll ? styles.show : ''}`}>
                        <VehicleTypeList vehicleTypes={vehicleTypes} />
                    </div>

                    <FormInput
                        label="Group Size"
                        type="number"
                        name="group_size"
                        value={formData.group_size}
                        onChange={handleChange}
                        error={errors.group_size}
                        required
                        min="1"  // Ensure the group size cannot be less than 1
                    />

                    <FormInput
                        label="Booking Type"
                        type="select"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        error={errors.type}
                        required
                    >
                        <option value="">Select Booking Type</option>
                        <option value="arrival">Arrival</option>
                        <option value="departure">Departure</option>
                    </FormInput>

                    <FormInput
                        label="From Location"
                        type="select"
                        name="from_location"
                        value={formData.from_location ? String(formData.from_location) : ""}
                        onChange={(e) => handleCombinedChange(e, 'from')}
                        error={errors.from_location}
                        required
                    >
                        <option value="">Select From Location</option>
                        {formData.type === 'arrival'
                            ? getFilteredLocations(formData.type, 'TRANSFER_POINT').map(location => (
                                <option key={location.id} value={location.id}>
                                    {location.name}
                                </option>
                            ))
                            : getFilteredLocations(formData.type, 'HOTEL').map(location => (
                                <option key={location.id} value={location.id}>
                                    {location.name}
                                </option>
                            ))
                        }
                    </FormInput>


                    <div className={styles.mapToggleContainer}>
                        <button type="button" onClick={() => handleMapToggle('from')} className={styles.mapToggleButton}>
                            <FontAwesomeIcon icon="fa-regular fa-map-location-dot" />
                            Select on Map
                        </button>
                    </div>

                    {savedFromLat !== null && savedFromLng !== null && (
                        <p>Last saved location: Latitude: {savedFromLat}, Longitude: {savedFromLng}</p>
                    )}
                    <div className={`${styles.adjustHeight} ${showFromMap  ? styles.expand : ''}`}>
                        {showFromMap && renderFromMap && fromLocation && fromLocation.latitude && fromLocation.longitude  && (
                            <div className={styles.mapContainer}>
                                <Map
                                    center={{
                                        lat: fromLocation.latitude,
                                        lng: fromLocation.longitude,
                                        radius: fromLocation.perimeter_meters || 300, // Default radius to 300 if not provided
                                    }}
                                    onSaveLocation={handleSaveLocation}
                                />
                            </div>
                        )}
                    </div>
                    <FormInput
                        label="To Location"
                        type="select"
                        name="to_location"
                        value={formData.to_location}
                        onChange={(e) => handleCombinedChange(e, 'to')}
                        error={errors.to_location}
                        required
                    >
                        <option value="">Select To Location</option>
                        {formData.type === 'arrival'
                            ? getFilteredLocations(formData.type, 'HOTEL').map(location => (
                                <option key={location.id} value={location.id}>
                                    {location.name}
                                </option>
                            ))
                            : getFilteredLocations(formData.type, 'TRANSFER_POINT').map(location => (
                                <option key={location.id} value={location.id}>
                                    {location.name}
                                </option>
                            ))
                        }
                    </FormInput>

                    <div className={styles.mapToggleContainer}>
                        <button type="button" onClick={() => handleMapToggle('to')} className={styles.mapToggleButton}>
                            <FontAwesomeIcon icon="fa-regular fa-map-location-dot" />
                            Select on Map
                        </button>
                    </div>

                    {savedToLat !== null && savedToLng !== null && (
                        <p>Last saved location: Latitude: {savedToLat}, Longitude: {savedToLng}</p>
                    )}
                    <div className={`${styles.adjustHeight} ${showToMap ? styles.expand : ''}`}>
                        {showToMap && renderToMap && toLocation && toLocation.latitude && toLocation.longitude && (
                            <div className={styles.mapContainer}>
                                <Map
                                    center={{
                                        lat: toLocation.latitude,
                                        lng: toLocation.longitude,
                                        radius: toLocation.perimeter_meters || 300, // Default radius to 300 if not provided
                                    }}
                                    onSaveLocation={handleSaveLocation}
                                />
                            </div>
                        )}
                    </div>



                    <FormInput
                        label="Schedule Date"
                        type="datetime-local"
                        name="pick_up_time"
                        value={formData.pick_up_time}
                        onChange={handleChange}
                        error={errors.pick_up_time}
                        min={minDateTime}
                        required
                    />


                    <FormInput
                        label="Notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        error={errors.notes}
                        placeholder={getNotesPlaceholder(formData.type)}  // Use the dynamic placeholder here
                    />
                            <div>
            {/* Some UI where the user can select locations */}

            {/* Render the RoadMap component dynamically based on the selected locations */}
            {start && end ? (
                <RoadMap start={start} end={end} mode="DRIVING" />
            ) : (
                <p>Please select both the start and end locations.</p>
            )}

            {/* Additional UI or forms for selecting locations */}
        </div>

                    <div className={`${styles.buttonAndTotalContainer} ${isFormComplete ? styles.show : ''}`}>
                        
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                        </button>

                        {totalPriceAfterFee !== null && (
                            <p className={styles.totalCost}>
                                Total Cost: €{totalPriceAfterFee.toFixed(2)}
                            </p>
                        )}
                    </div>

                    {errors.non_field_errors && (
                        <div className={styles.formError}>
                            {errors.non_field_errors.map((error, index) => (
                                <p key={index}>{error}</p>
                            ))}
                        </div>
                    )}
                </form>
            )}
        </div>
    );
};

export default BookingForm;
