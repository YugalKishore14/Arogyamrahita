
import React, { useEffect, useState } from 'react';
import { userAPI } from '../services/Api';
import styles from '../css/OrdersHistoryPage.module.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  const generateInvoicePDF = (order) => {
    const doc = new jsPDF();

    const formatPhoneNumber = (phone) => {
      if (phone && /^\d{10}$/.test(phone)) {
        return `+91-${phone}`;
      }
      return phone || 'N/A';
    };

    // Header
    doc.setFontSize(18);
    doc.text("AarogyamRahita", 14, 22);
    doc.setFontSize(11);
    doc.text("Sanik Vihar, Meerut", 14, 30);
    doc.text("Phone: (000) 000-0000", 14, 36);

    // Invoice Details
    doc.setFontSize(11);
    doc.text(`Invoice: INV-${order.invoiceNumber || order._id.slice(-6)}`, 140, 22);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 140, 30);

    // Shipping Address
    const sa = order.shippingAddress || {};
    const fullAddress = [sa.address, sa.addressLine2, sa.city, sa.state, sa.pincode].filter(Boolean).join(', ');
    doc.setFontSize(12);
    doc.text("Ship To:", 14, 50);
    doc.setFontSize(11);
    doc.text(sa.name || 'N/A', 14, 58);
    doc.text(fullAddress || 'N/A', 14, 64, { maxWidth: 80 });
    const addressHeight = doc.getTextDimensions(fullAddress, { maxWidth: 80 }).h;
    doc.text(formatPhoneNumber(sa.phone), 14, 64 + addressHeight + 4);

    // Items Table
    const items = (order.items || []).map(it => [
      it.variant && it.variant.weight && it.variant.weightUnit
        ? `${it.name} (${it.variant.weight} ${it.variant.weightUnit})`
        : it.name,
      it.quantity,
      `${it.price.toFixed(2)}`,
      `${(it.price * it.quantity).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 64 + addressHeight + 15,
      head: [['Description', 'Qty', 'Unit Price', 'Amount']],
      body: items,
      theme: 'striped',
      headStyles: { fillColor: [38, 166, 91] },
    });

    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total: ${order.totalAmount.toFixed(2)}`, 140, finalY);

    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 14, finalY + 20);

    const userName = (order.user?.name || "user").replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `Invoice-${userName}-${order.invoiceNumber || order._id}.pdf`;

    // Set PDF properties and open in a new tab
    doc.setProperties({
      title: fileName
    });
    doc.output('dataurlnewwindow', { filename: fileName });
  };

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
            <div className={styles.orderActions}>
              <button onClick={() => generateInvoicePDF(order)} className={styles.invoiceBtn}>
                View/Download Invoice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersHistoryPage;
