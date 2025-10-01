import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/PaymentPage.module.css';
import CheckoutStepper from '../components/CheckoutStepper';


const PaymentPage = ({ onPayment }) => {
    const [selectedMethod, setSelectedMethod] = useState('cash');
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSelect = (method) => {
        setSelectedMethod(method);
    };

    const handlePay = (e) => {
        e.preventDefault();
        if (selectedMethod === 'cash') {
            onPayment && onPayment('cash');
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                navigate('/order-completed');
            }, 1800);
        }
    };

    return (
        <div className={styles.paymentPageContainer}>
            <CheckoutStepper currentStep={2} />
            <h2>Select Payment Method</h2>
            <form onSubmit={handlePay} className={styles.paymentForm}>
                <div className={styles.paymentOption}>
                    <input
                        type="radio"
                        id="cash"
                        name="payment"
                        value="cash"
                        checked={selectedMethod === 'cash'}
                        onChange={() => handleSelect('cash')}
                    />
                    <label htmlFor="cash">Cash on Delivery</label>
                </div>
                <div className={styles.paymentOption}>
                    <input
                        type="radio"
                        id="card"
                        name="payment"
                        value="card"
                        disabled
                    />
                    <label htmlFor="card" className={styles.disabledLabel}>
                        Card (Coming Soon)
                    </label>
                </div>
                <div className={styles.paymentOption}>
                    <input
                        type="radio"
                        id="upi"
                        name="payment"
                        value="upi"
                        disabled
                    />
                    <label htmlFor="upi" className={styles.disabledLabel}>
                        UPI (Coming Soon)
                    </label>
                </div>
                <button type="submit" className={styles.payButton}>
                    Pay with Cash
                </button>
            </form>
            {showSuccess && (
                <div className={styles.successPopup}>
                    <div className={styles.successBox}>
                        <span role="img" aria-label="success" style={{ fontSize: 32 }}>✅</span>
                        <div>Your order is successful!</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;