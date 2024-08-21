import React, { useEffect, useState } from 'react';
import OrderService from '../../services/orderService';
import DriverService from '../../services/driverService';
import OrderCard from '../../components/specific/OrderCard/OrderCard';  // Import the OrderCard component
import styles from './OrdersPage.module.css'; // Import the CSS module

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [showOngoing, setShowOngoing] = useState(false); // State to toggle ongoing orders

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, driversData] = await Promise.all([
          OrderService.getOrders(),
          DriverService.getDrivers(),
        ]);

        // Sort the orders by booking_schedule (date and time)
        const sortedOrders = ordersData.orders.sort((a, b) => {
          const dateA = new Date(a.booking_schedule);
          const dateB = new Date(b.booking_schedule);
          return dateA - dateB; // Sort by both date and time
        });
        
        setOrders(sortedOrders);  
        setDrivers(driversData);  
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter orders based on the showOngoing state
  const filteredOrders = showOngoing 
    ? orders.filter(order => order.status === 'Ongoing') 
    : orders;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>Sidebar</div>
      <div className={styles.mainContent}>
        <div className={styles.navbar}>
          <button onClick={() => setShowOngoing(!showOngoing)}>
            {showOngoing ? 'Show All Orders' : 'Show Ongoing Orders'}
          </button>
        </div>
        <div className={styles.searchBar}>
          <input type="text" placeholder="Search..." />
        </div>
        <div className={styles.ordersGrid}>
          {filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} drivers={drivers} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
