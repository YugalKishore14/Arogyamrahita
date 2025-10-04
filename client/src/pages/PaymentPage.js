import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/PaymentPage.module.css';
import CheckoutStepper from '../components/CheckoutStepper';
import confetti from 'canvas-confetti';

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


            const duration = 3000;
            const end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 5,
                    startVelocity: 30,
                    spread: 360,
                    ticks: 200,
                    origin: {
                        x: Math.random(),
                        y: 0
                    }
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            })();

            setTimeout(() => {
                setShowSuccess(false);
                navigate('/order-completed');
            }, duration + 500);
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
                    <input type="radio" id="card" name="payment" value="card" disabled />
                    <label htmlFor="card" className={styles.disabledLabel}>Card (Coming Soon)</label>
                </div>
                <div className={styles.paymentOption}>
                    <input type="radio" id="upi" name="payment" value="upi" disabled />
                    <label htmlFor="upi" className={styles.disabledLabel}>UPI (Coming Soon)</label>
                </div>
                <button type="submit" className={styles.payButton}>
                    Pay with Cash
                </button>
            </form>

            {showSuccess && (
                <div className={styles.overlay}>
                    <div className={styles.successBox}>
                        <span role="img" aria-label="success" style={{ fontSize: "40px" }}>✅</span>
                        <h2>Your Order is Successful!</h2>
                        <p>Thank you for shopping with us 🎉</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;
