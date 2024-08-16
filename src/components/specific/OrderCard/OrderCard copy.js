import React, { useState } from 'react';
import styles from './OrderCard.module.css';
import AssignDriver from './AssignDriver';
import OrderService from '../../../services/orderService'

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
        <p><strong>Booking Fee:</strong> {order.booking_amount}</p>
        <p><strong>Creation date:</strong> {formatDate(order.booking_creation_date)}</p>
        {/* Assign Driver */}
        
        
        <p>{/* Other detailed information about the order */}</p>
      </div>
    </div>
  );
};

export default OrderCard;
