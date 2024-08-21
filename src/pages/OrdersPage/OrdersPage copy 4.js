import React, { useEffect, useState } from 'react';
import OrderService from '../../services/orderService';
import DriverService from '../../services/driverService';
import OrderCard from '../../components/specific/OrderCard/OrderCard';  // Import the OrderCard component
import styles from './OrdersPage.module.css'; // Import the CSS module

import { AppContext } from '../../';  

const OrdersPage = () => {
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const { filterStatus } = useContext(AppContext);  // Access the context

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, driversData] = await Promise.all([
          OrderService.getOrders(),
          DriverService.getDrivers(),
        ]);

        const sortedOrders = ordersData.orders.sort((a, b) => {
          const dateA = new Date(a.booking_schedule);
          const dateB = new Date(b.booking_schedule);
          return dateA - dateB;
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

  const handleOrderStatusChange = (orderId, newStatus) => {
    if (newStatus === 'Completed') {
      // Wait for the animation to complete before removing the order
      setTimeout(() => {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      }, 500); // Adjust the delay (in milliseconds) based on your animation duration
    } else {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    }
  };



  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const filteredOrders = filterStatus === 'All'
  ? orders
  : orders.filter(order => order.status === filterStatus);
  
  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>Sidebar</div>
      <div className={styles.mainContent}>
        <div className={styles.navbar}>
          <button onClick={() => setFilterStatus('All')}>
            Show All Orders
          </button>
          <button onClick={() => setFilterStatus('In Queue')}>
            Show In Queue Orders
          </button>
          <button onClick={() => setFilterStatus('Ongoing')}>
            Show Ongoing Orders
          </button>
        </div>
        <div className={styles.searchBar}>
          <input type="text" placeholder="Search..." />
        </div>
        <div className={styles.ordersGrid}>
          {filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} drivers={drivers} onStatusChange={handleOrderStatusChange} />
          ))}
        </div>
      </div>
    </div>
  );
};


export default OrdersPage;
