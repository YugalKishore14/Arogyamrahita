import React, { useEffect, useState } from 'react';
import { userAPI } from '../services/Api';
import styles from '../css/UserProfile.module.css';

const OrderHistory = () => {
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

    if (loading) return <div>Loading order history...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!orders.length) return <div>No orders found.</div>;

    return (
        <div className={styles.orderHistorySection}>
            {/* <h3>Order History</h3> */}
            {orders.map(order => (
                <div key={order._id} className={styles.orderCard}>
                    {/* <div><b>Order ID:</b> {order._id}</div> */}
                    <div><b>Status:</b> {order.status}</div>
                    <div><b>Total:</b> ₹{order.totalAmount}</div>
                    <div><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</div>
                    <div><b>Items:</b>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {(order.items || []).map((item, idx) => (
                                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee', background: '#fafafa' }}
                                        />
                                    )}
                                    <span style={{ fontWeight: 500 }}>{item.name}</span>
                                    <span style={{ color: '#6b7280', fontSize: 14 }}>x {item.quantity}</span>
                                    <span style={{ marginLeft: 'auto', fontWeight: 500 }}>₹{item.price}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderHistory;
