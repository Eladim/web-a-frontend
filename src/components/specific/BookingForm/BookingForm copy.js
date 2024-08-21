import React, { useState, useEffect, useMemo } from 'react';
import BookingService from '../../../services/bookingService';
import FormInput from './FormInput';
import styles from './BookingForm.module.css';
import VehicleTypeList from './VehicleTypeList';
import Map from '../GoogleMap/GoogleMap';  // Import the GoogleMap component
import RoadMap from '../GoogleMap/RoadMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { parseISO, format } from 'date-fns'; // If you use date-fns for date formatting
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import InfoIcon from './InfoIcon';



const BookingForm = ({ vehicleTypes, locations, isSubmitted, setIsSubmitted, commissionFree }) => {
    const [formData, setFormData] = useState({
        client: '',
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        vehicle_type: '',
        type: 'not_specified',
        group_size: 1,
        pick_up_time: '',
        from_location: '',
        to_location: '',
        notes: '',
        from_lat: null,
        from_lng: null,
        to_lat: null,
        to_lng: null,
        amount: '',
        commission_free: commissionFree, // Default to true
        distance: null,
    });
    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            commission_free: commissionFree,
        }));
        console.log('Commission-free status updated:', commissionFree);
    }, [commissionFree]);

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
    const [activeFee, setActiveFee] = useState(null);
    const [showViewMap, setViewMap] = useState(false);
    const [renderViewMap, setRenderViewMap] = useState(false);
    const [filteredFees, setFilteredFees] = useState(null);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [showList, setShowList] = useState(false);
    const [distance, setDistance] = useState('');

    const handleDistanceChange = (newDistance) => {
        setDistance(newDistance);
    };

    const handleMouseEnter = () => {
        setShowList(true);
    };

    const handleMouseLeave = () => {
        setShowList(false);
    };

    const handleViewMapClick = () => {


        const nextShowMapState = !showViewMap;
        setViewMap(nextShowMapState);
        setShowFromMap(false);
        setShowToMap(false);

        if (nextShowMapState) {
            // If we are going to show the map, introduce a delay before rendering
            setRenderViewMap(false); // Ensure the map doesn't render immediately
            setTimeout(() => {
                setRenderViewMap(true);
            }, 500); // 500ms delay before rendering the map
        } else {
            // If we're hiding the map, set renderViewMap to false immediately
            setRenderViewMap(false);
        }
    };


    // Function to check if form is complete
    const checkIsFormComplete = (formData) => {
        return (
            formData.type &&
            formData.from_location &&
            formData.to_location &&
            formData.vehicle_type &&
            formData.pick_up_time
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
            console.log(`Retrieved Distance: ${distance} km`);
        }

        
        const numericDistance = parseFloat(distance.replace('km', '').trim());
        //console.log(`Parsed Numeric Distance: ${numericDistance} km`);
        setIsFormComplete(checkIsFormComplete(formData));
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const localISOTime = new Date(now.getTime() - (offset * 60 * 1000)).toISOString().slice(0, 16);
        setMinDateTime(localISOTime);

        const normalizedValueForLogging = normalizeVehicleTypeForLogging(formData.vehicle_type);

        selectedVehicle = vehicleTypes.find(
            vehicle => vehicle.vehicle_type === normalizedValueForLogging
        );

        if (selectedVehicle && formData.pick_up_time) {
            console.log(`Retrieved Booking Price: ${selectedVehicle.booking_price}`);
            console.log(`Retrieved Cost per KM: ${selectedVehicle.cost_per_km}`);

            // Extract the hour from pick_up_time
            const pickUpTime = parseISO(formData.pick_up_time); // Assuming pick_up_time is in ISO format
            const pickUpHour = format(pickUpTime, 'HH:mm:ss'); // Extract the hour in HH:mm:ss format

            console.log(`Pick Up Hour: ${pickUpHour}`);

            // Filter the applicable fees based on the pick-up hour
            const applicableFees = selectedVehicle.service_fees.filter(fee => {
                const startTime = fee.start_time;
                const endTime = fee.end_time;

                // Handle the cases where the start_time and end_time span midnight
                if (startTime < endTime) {
                    return pickUpHour >= startTime && pickUpHour <= endTime;
                } else {
                    return pickUpHour >= startTime || pickUpHour <= endTime;
                }
            });
            // Sum the fee percentages
            const totalFeePercentage = applicableFees.reduce((acc, fee) => {
                return acc + parseFloat(fee.fee_percentage);
            }, 0);

            console.log(`Total Applicable Fee Percentage: ${totalFeePercentage}%`);

            const bookingPrice = parseFloat(selectedVehicle.booking_price.replace('€', ''));
            const costPerKm = parseFloat(selectedVehicle.cost_per_km.replace('€', ''));
            const effectiveDistance = (numericDistance && !isNaN(numericDistance)) ? numericDistance : 0;
            const activeFeeMultiplier = totalFeePercentage / 100;
            const totalPriceBeforeFee = (effectiveDistance * costPerKm) + bookingPrice;
            const totalPriceAfterFee = totalPriceBeforeFee * (1 + activeFeeMultiplier);

            if (isNaN(totalPriceAfterFee)) {
                totalPriceAfterFee = 0;
            }

            //console.log(`Total Price Before Fee: (€${totalPriceBeforeFee.toFixed(2)})`);
            //console.log(`Total Price After Fee: €${totalPriceAfterFee.toFixed(2)}`);
            
            setFilteredFees(applicableFees);

            setActiveFee(totalFeePercentage);
            setTotalPriceAfterFee(totalPriceAfterFee);
        } else {
           // console.log('No valid vehicle type selected for calculation.');
        }
    }, [formData, locations, vehicleTypes, distance, totalPriceAfterFee]);

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
        setViewMap(false);                                                                                  // HIDES THE ROAD MAP
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
                setShowToMap(false);                                                                //// THIS IS RESPONSIBLE FOR THE SWAP
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
                setShowFromMap(false);                                                                  ///// THIS IS RESPONSIBLE FOR THE SWAP
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

    useEffect(() => {
        // Update the amount field whenever totalPriceAfterFee changes
        updateFormData();
    }, [totalPriceAfterFee]);
    
    const updateFormData = () => {
        //console.log(`Total Price After Fee: €${totalPriceAfterFee ? totalPriceAfterFee.toFixed(2) : 'N/A'}`);
        
        setFormData(prevData => ({
            ...prevData,
            amount: totalPriceAfterFee ? totalPriceAfterFee.toFixed(2) : '',
        }));
        
        //console.log(`Updated amount in formData`);
    };

    const handleChange = (e) => {
        console.log(`Total Price After Fee: €${totalPriceAfterFee ? totalPriceAfterFee.toFixed(2) : 'N/A'}`);
        const { name, value } = e.target;
        if (formData[name] !== value) {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
        console.log('Commission-free status on load:', formData.commission_free);
        //console.log(`Retrieving Distance`);
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
        // Default: Show all locations except those of type 'region'
        return locations.filter(loc => loc.type !== 'region');
    };
    


    const getNotesPlaceholder = (type) => {
        if (type === 'arrival') {
            return 'Flight Number or Airport Terminal details';
        } else if (type === 'departure') {
            return 'Specify Address Location';
        }
        return ''; // No placeholder if type is not specified or is not 'arrival' or 'departure'
    };

    const handleSubmit = async (e) => {
        setIsSubmitting(true);

        e.preventDefault();
            // Create a copy of formData and update the fields if they are empty strings
        const updatedFormData = {
            ...formData,
            from_lat: formData.from_lat === "" ? null : formData.from_lat,
            from_lng: formData.from_lng === "" ? null : formData.from_lng,
            to_lat: formData.to_lat === "" ? null : formData.to_lat,
            to_lng: formData.to_lng === "" ? null : formData.to_lng,
        };
            

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
const start = useMemo(() => {
    if (formData.from_lat && formData.from_lng) {
        return {
            lat: parseFloat(formData.from_lat),
            lng: parseFloat(formData.from_lng),
        };
    } else if (formData.from_location) {
        const location = locations.find(loc => loc.id === parseInt(formData.from_location));
        if (location && !showViewMap) {                                                                              ///Prevents reseting of values
            return {
                lat: location.latitude,
                lng: location.longitude,
            };
        }
    }
    return null; // If neither coordinates nor a valid location is available
}, [formData.from_lat, formData.from_lng, formData.from_location, locations]);

const end = useMemo(() => {
    if (formData.to_lat && formData.to_lng) {
        return {
            lat: parseFloat(formData.to_lat),
            lng: parseFloat(formData.to_lng),
        };
    } else if (formData.to_location) {
        const location = locations.find(loc => loc.id === parseInt(formData.to_location));
        if (location && !showViewMap) {                                                                    ///Prevents reseting of values
            return {
                lat: location.latitude,
                lng: location.longitude,
            };
        }
    }
    return null; // If neither coordinates nor a valid location is available
}, [formData.to_lat, formData.to_lng, formData.to_location, locations]);

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


                    <div className={`${styles.adjustHeight} ${showFromMap ? styles.expand : ''}`}>
                        {showFromMap && renderFromMap && fromLocation && fromLocation.latitude && fromLocation.longitude && (
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
                    <div >
                        {/* Button to show the map */}
                        <button
                            type="button"
                            onClick={handleViewMapClick}
                            disabled={!start || !end} // Disable button if start or end is not valid
                            className={!start || !end ? 'disabled' : ''}                                                        /// Can improve
                        >
                            {showViewMap ? 'Hide Map' : 'View Map'}
                        </button>

                        {/* Conditionally render the map div based on showViewMap and renderViewMap state */}
                        <div className={`${styles.adjustHeight} ${showViewMap ? styles.expandRoadMap : ''}`}>
                            {showViewMap && renderViewMap && (
                                <div>
                                    {/* Some UI where the user can select locations */}

                                    {/* Render the RoadMap component dynamically based on the selected locations */}
                                    <RoadMap start={start} end={end} mode="DRIVING" onDistanceChange={handleDistanceChange} />

                                    {/* Additional UI or forms for selecting locations */}
                                </div>
                            )}
                        </div>
                    </div>


                    <div className={`${styles.buttonAndTotalContainer} ${(isFormComplete && showViewMap) ? styles.show : ''}`}>

                        <div className={styles.totalCost}>
                            <span>{activeFee !== null ? `Service Fee: ${activeFee.toFixed(2)}%  ` : 'Service Fee: N/A  '}</span>
                            <span className={styles.container}>
                                <span
                                    className={styles.iconContainer}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    onTouchStart={handleMouseEnter}
                                    onTouchEnd={handleMouseLeave}
                                >
                                    <FontAwesomeIcon icon={faInfoCircle} className={styles.icon} />
                                    <ul className={`${styles.list} ${showList ? styles.visible : ''}`}>
                                        {filteredFees && filteredFees.length > 0 ? (
                                            filteredFees.map(fee => (
                                                <li key={fee.id}>{fee.name} {parseFloat(fee.fee_percentage).toString().replace(/\.0+$/, '')}%</li>
                                            ))
                                        ) : (
                                            <li>No Fees applied</li>
                                        )}
                                    </ul>
                                </span>
                            </span>
                        </div>

                        {totalPriceAfterFee !== null && (
                            <div className={styles.totalCost}>
                                <span>Total Cost: €{totalPriceAfterFee.toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                    <button
  type={showViewMap ? "submit" : "button"}
  onClick={(e) => {
    if (!showViewMap) {
      e.preventDefault(); // Prevent form submission
      handleViewMapClick(); // Trigger the view map logic
    }
  }}
  disabled={
    (showViewMap && isSubmitting) || (!showViewMap && (!start || !end))
  } // Disable based on conditions
  className={!showViewMap && (!start || !end) ? 'disabled' : ''}
>
  {isSubmitting
    ? 'Submitting...'
    : showViewMap
    ? 'Submit Booking'
    : 'Approve Path'}
</button>



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
