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

        setOrders(ordersData.orders);  
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
