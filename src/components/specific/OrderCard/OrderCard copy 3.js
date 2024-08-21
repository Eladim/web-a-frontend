import React, { useState } from 'react';
import styles from './OrderCard.module.css';
import AssignDriver from './AssignDriver';
import OrderService from '../../../services/orderService'
import OpenNavigation from './OpenNavigation'; // Import your new component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';

const OrderCard = ({ order, drivers }) => {

  const handleAssignDriver = async (selectedDriver) => {
    try {
      if (selectedDriver && selectedDriver.id) {
        setOrderStatus('Ongoing');
        const updatedOrder = await OrderService.assignDriverToOrder(order.id, selectedDriver.id);
        console.log('Order updated:', updatedOrder);

        
        // Optionally update the order state here if needed
      } else {
        console.error('No driver selected');
      }
    } catch (error) {
      console.error('Failed to assign driver:', error);
    }
  };
  const [isExpanded, setIsExpanded] = useState(false);
  const [orderStatus, setOrderStatus] = useState(order.status); // New state for tracking order status

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-GB", {
      timeZone: "Europe/Sofia",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };
  const sofiaTime = new Date(order.booking_schedule).toLocaleString("en-GB", {
    timeZone: "Europe/Sofia",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
});


const formatVehicleType = (type) => {
  const capitalizedType = capitalizeFirstLetter(type);
  if (type === 'standard' || type === 'executive') {
    return `${capitalizedType} Car`;
  }
  return capitalizedType;
};

  // Validate and extract start and end coordinates from the order object
  const isValidCoord = (lat, lng) => {
    return lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng);
  };

  
  const hasValidNativeCoords = isValidCoord(order.from_lat, order.from_lng) && isValidCoord(order.to_lat, order.to_lng);

  // Use order's from_lat and from_lng if valid; otherwise, use location's latitude and longitude
  const start = isValidCoord(order.from_lat, order.from_lng)
    ? { lat: order.from_lat, lng: order.from_lng }
    : isValidCoord(order.from_location.latitude, order.from_location.longitude)
      ? { lat: order.from_location.latitude, lng: order.from_location.longitude }
      : null;
      
  // Use order's to_lat and to_lng if valid; otherwise, use location's latitude and longitude
  const end = isValidCoord(order.to_lat, order.to_lng)
    ? { lat: order.to_lat, lng: order.to_lng }
    : isValidCoord(order.to_location.latitude, order.to_location.longitude)
      ? { lat: order.to_location.latitude, lng: order.to_location.longitude }
      : null;

  // Generate the Google Maps URL
  const googleMapsUrl = start && end 
    ? `https://www.google.com/maps/dir/?api=1&origin=My+Location&waypoints=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&travelmode=driving`
    : null;

    const handleIconClick = (event) => {
      event.stopPropagation(); // Stop the click event from propagating
      if (googleMapsUrl) {
        window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
      }
    };

  return (
    <div className={`${styles.orderCard} ${isExpanded ? styles.expanded : ''}`} onClick={toggleExpanded}>
      <div className={styles.topSection}>
        <div>
          <h3>{capitalizeFirstLetter(order.booking_type)}</h3>
          <p><strong>Client Name:</strong> {order.client_name}</p>
          <p><strong>Status:</strong> {orderStatus}</p>
          <p><strong>Scheduled For:</strong> {sofiaTime}</p>
        </div>
        <AssignDriver drivers={drivers} onAssignDriver={handleAssignDriver} />
      </div>
      
      <div className={styles.orderDetails}>
        {/* The order details are always rendered, but controlled by CSS */}
        <p><strong>Details:</strong></p>
        
        <p><strong>Telephone:</strong> {order.client_telephone}</p>
        <p><strong>Booking ID:</strong> {order.booking_id}</p>
        <p><strong>Model:</strong> {formatVehicleType(order.booking_vehicle_type)}</p>
        <p><strong>Group Size:</strong> {order.group_size}</p>
        <p><strong>From:</strong> {order.from_location.name}</p>
        <p><strong>To:</strong> {order.to_location.name}</p>
        <p><strong>Note:</strong> {order.notes}</p>
        <p><strong>Total Cost:</strong> {order.booking_amount}</p>
        <p><strong>Creation date:</strong> {formatDate(order.booking_creation_date)}</p>
        {/* Assign Driver */}
        
        {googleMapsUrl && (
        <p>
          <strong>Navigate with Google Maps</strong>
          {!hasValidNativeCoords && " (Non-Specific Road)"}:   
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
          > Click here
          </a>
        </p>
      )}
                  <FontAwesomeIcon 
            icon={faMapLocationDot} 
            className={`${styles.icon} ${styles.iconPosition}`} 
            onClick={handleIconClick} 
          />
        
        
        <p>{/* Other detailed information about the order */}</p>
      </div>
    </div>
  );
};

export default OrderCard;
