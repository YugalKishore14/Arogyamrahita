import React from 'react';
import styles from '../css/CheckoutStepper.module.css';

const steps = [
    { label: 'Cart' },
    { label: 'Delivery Address' },
    { label: 'Payment' }
];

const CheckoutStepper = ({ currentStep }) => {
    return (
        <div className={styles.stepperContainer}>
            {steps.map((step, idx) => (
                <div key={step.label} className={styles.stepWrapper}>
                    <div
                        className={
                            idx < currentStep
                                ? styles.completed
                                : idx === currentStep
                                    ? styles.active
                                    : styles.inactive
                        }
                    >
                        <span className={styles.stepNumber}>{idx + 1}</span>
                        <span className={styles.stepLabel}>{step.label}</span>
                    </div>
                    {idx < steps.length - 1 && <div className={styles.connector} />}
                </div>
            ))}
        </div>
    );
};

export default CheckoutStepper;
