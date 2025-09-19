import React from 'react';
import styles from '../css/CheckoutStepper.module.css';
import { FaToolbox } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { FcShipped } from "react-icons/fc";
import { BsFillBagCheckFill } from "react-icons/bs";


const orderSteps = [
    { label: 'Placed', icon: <FaToolbox /> },
    { label: 'Paid', icon: <FaRegCreditCard /> },
    { label: 'Ready for Delivery', icon: <TbTruckDelivery /> },
    { label: 'Shipped', icon: <FcShipped /> },
    { label: 'Delivered', icon: <BsFillBagCheckFill /> },
];

const statusToStepIndex = {
    PLACED: 0,
    PAID: 1,
    READY_FOR_DELIVERY: 2,
    SHIPPED: 3,
    DELIVERED: 4,
};

const OrderTracker = ({ status }) => {
    const currentStep = statusToStepIndex[status] ?? 0;
    const isCancelled = status === 'CANCELLED';
    return (
        <div style={{ width: '100%', padding: '8px 0' }}>
            <div className={styles.stepperContainer} style={{ opacity: isCancelled ? 0.5 : 1, filter: isCancelled ? 'grayscale(0.7)' : 'none' }}>
                {orderSteps.map((step, idx) => (
                    <div key={step.label} className={styles.stepWrapper}>
                        <div
                            className={
                                idx < currentStep && !isCancelled
                                    ? styles.completed
                                    : idx === currentStep && !isCancelled
                                        ? styles.active
                                        : styles.inactive
                            }
                            style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 90 }}
                        >
                            <span className={styles.stepNumber} style={{ fontSize: 20 }}>{step.icon}</span>
                            <span className={styles.stepLabel}>{step.label}</span>
                        </div>
                        {idx < orderSteps.length - 1 && <div className={styles.connector} />}
                    </div>
                ))}
            </div>
            {isCancelled && (
                <div style={{ color: 'white', background: 'red', borderRadius: 8, padding: '4px 16px', margin: '10px auto 0', width: 'fit-content', fontWeight: 700, fontSize: 16, letterSpacing: 1 }}>
                    CANCELLED
                </div>
            )}
        </div>
    );
};

export default OrderTracker;
