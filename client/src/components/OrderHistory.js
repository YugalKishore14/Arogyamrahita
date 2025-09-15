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
            <h3>Order History</h3>
            {orders.map(order => (
                <div key={order._id} className={styles.orderCard}>
                    <div><b>Order ID:</b> {order._id}</div>
                    <div><b>Status:</b> {order.status}</div>
                    <div><b>Total:</b> ₹{order.totalAmount}</div>
                    <div><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</div>
                    <div><b>Items:</b>
                        <ul>
                            {(order.items || []).map((item, idx) => (
                                <li key={idx}>{item.name} x {item.quantity} — ₹{item.price}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderHistory;
