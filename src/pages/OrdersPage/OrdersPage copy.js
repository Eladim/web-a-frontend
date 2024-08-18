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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, driversData] = await Promise.all([
          OrderService.getOrders(),
          DriverService.getDrivers(),
        ]);

        // Sort the orders by booking_schedule
        const sortedOrders = ordersData.orders.sort((a, b) => {
          const dateA = new Date(a.booking_schedule);
          const dateB = new Date(b.booking_schedule);
        
          return dateA - dateB; // This will sort by both date and time
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.dashboard}> {/* Applying CSS Module class */}
      <div className={styles.sidebar}>Sidebar</div> {/* Applying CSS Module class */}
      <div className={styles.mainContent}> {/* Applying CSS Module class */}
        <div className={styles.navbar}>Navigation bar</div> {/* Applying CSS Module class */}
        <div className={styles.searchBar}> {/* Applying CSS Module class */}
          <input type="text" placeholder="Search..." />
        </div>
        <div className={styles.ordersGrid}> {/* Applying CSS Module class */}
            {orders.map(order => (
            <OrderCard key={order.id} order={order} drivers={drivers} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
