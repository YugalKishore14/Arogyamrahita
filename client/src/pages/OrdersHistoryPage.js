
import React, { useEffect, useState } from 'react';
import { userAPI } from '../services/Api';
import styles from '../css/OrdersHistoryPage.module.css';

const OrdersHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await userAPI.getMyOrders();
        setOrders(Array.isArray(res) ? res : res.orders || []);
      } catch (e) {
        setError('Failed to load order history.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);


  if (loading) return <div style={{ textAlign: 'center', marginTop: 60 }}>Loading order history...</div>;
  if (error) return <div style={{ color: '#b91c1c', textAlign: 'center', marginTop: 60 }}>{error}</div>;
  if (!orders.length) return <div style={{ textAlign: 'center', marginTop: 60 }}>No orders found.</div>;

  return (
    <div className={styles.orderHistoryPage}>
      <div className={styles.orderHistoryHeader}>Order History</div>
      <div className={styles.orderCardsGrid}>
        {orders.map(order => (
          <div key={order._id} className={styles.orderCardPro}>
            <div className={styles.orderStatus}>{order.status}</div>
            <div className={styles.orderDate}>{new Date(order.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, year: 'numeric', month: 'short', day: 'numeric' })}</div>
            <div className={styles.orderTotal}>Total: ₹{order.totalAmount}</div>
            <ul className={styles.orderItemsList}>
              {(order.items || []).map((item, idx) => (
                <li key={idx} className={styles.orderItemRow}>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.orderItemImg}
                    />
                  )}
                  <span className={styles.orderItemName}>{item.name}</span>
                  {item.variant && item.variant.weight && item.variant.weightUnit && (
                    <span className={styles.orderItemVariant}>
                      ({item.variant.weight} {item.variant.weightUnit})
                    </span>
                  )}
                  <span className={styles.orderItemQty}>x {item.quantity}</span>
                  <span className={styles.orderItemPrice}>₹{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersHistoryPage;
