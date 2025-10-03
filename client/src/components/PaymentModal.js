import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import styles from "../css/PaymentModal.module.css";
import "react-phone-input-2/lib/style.css";
const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
];

const PaymentModal = ({ isOpen, onClose, onPlaceOrder }) => {
    const [method] = useState("cod");
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [address, setAddress] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        addressLine2: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
    });
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handlePay = async () => {
        const newErrors = {};

        if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(address.name.trim())) {
            newErrors.name = "Name can only contain letters and single spaces between words.";
        }
        if (!address.phone || address.phone.length < 10) {
            newErrors.phone = "Please enter a valid phone number with country code.";
        }
        if (!/^[a-zA-Z0-9.]+@gmail\.com$/.test(address.email)) {
            newErrors.email = "Please enter a valid Gmail address (e.g., example@gmail.com). No spaces or special characters allowed.";
        }
        if (!/^[a-zA-Z0-9\s,.-/]+$/.test(address.address.trim())) {
            newErrors.address = "Address can only contain letters, numbers, and basic symbols (, . - /).";
        }
        if (address.addressLine2.trim() && !/^[a-zA-Z0-9\s,.-/]+$/.test(address.addressLine2.trim())) {
            newErrors.addressLine2 = "Address Line 2 can only contain letters, numbers, and basic symbols (, . - /).";
        }
        if (address.landmark.trim() && !/^[a-zA-Z0-9\s,.-/]+$/.test(address.landmark.trim())) {
            newErrors.landmark = "Landmark can only contain letters, numbers, and basic symbols (, . - /).";
        }
        if (!/^[a-zA-Z0-9\s]+$/.test(address.city)) {
            newErrors.city = "City can only contain letters, numbers and spaces.";
        }
        if (!address.state) {
            newErrors.state = "Please select a state.";
        }
        if (!/^[0-9]{6}$/.test(address.pincode)) {
            newErrors.pincode = "Please enter a valid 6-digit pincode.";
        }

        if (Object.keys(newErrors).length > 0) {
            setError(Object.values(newErrors).join(" \n"));
            return;
        }

        if (
            !address.name ||
            !address.phone ||
            !address.email ||
            !address.address ||
            !address.city ||
            !address.pincode
        ) {
            setError("Please fill all address fields.");
            return;
        }

        setError("");
        setProcessing(true);
        try {
            await onPlaceOrder(
                address,
                () => {
                    setProcessing(false);
                    setSuccess(true);
                },
                (err) => {
                    setProcessing(false);
                    setError("Order failed. Try again.");
                }
            );
        } catch (e) {
            setProcessing(false);
            setError("Order failed. Try again.");
        }
    };

    const handleClose = () => {
        setSuccess(false);
        setProcessing(false);
        setAddress({
            name: "",
            phone: "",
            email: "",
            address: "",
            addressLine2: "",
            landmark: "",
            city: "",
            state: "",
            pincode: "",
        });
        setError("");
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>Delivery Address</h2>
                {success ? (
                    <>
                        <p className={styles.successMessage}>
                            Order Placed Successfully!
                        </p>
                        <button
                            onClick={handleClose}
                            className={`${styles.btn} ${styles.primaryBtn}`}
                        >
                            Close
                        </button>
                    </>
                ) : (
                    <>
                        <div className={styles.formContainer}>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={address.name}
                                onChange={(e) =>
                                    setAddress({ ...address, name: e.target.value })
                                }
                                className={styles.input}
                                disabled={processing}
                            />
                            <PhoneInput
                                country={"in"}
                                value={address.phone}
                                onChange={(phone) => setAddress({ ...address, phone })}
                                inputClass={styles.phoneInput}
                                disabled={processing}
                                style={{ marginBottom: "15px" }}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={address.email}
                                onChange={(e) => setAddress({ ...address, email: e.target.value })}
                                className={styles.input}
                                style={{ marginTop: 0 }}
                                disabled={processing}
                            />
                            <textarea
                                placeholder="Delivery Address"
                                value={address.address}
                                onChange={(e) => setAddress({ ...address, address: e.target.value })}
                                className={styles.textareaa}
                                disabled={processing}

                            />
                            <textarea
                                placeholder="Address Line 2"
                                value={address.addressLine2}
                                onChange={(e) =>
                                    setAddress({ ...address, addressLine2: e.target.value })
                                }
                                className={styles.textareaa}
                                disabled={processing}
                            />
                            <input
                                type="text"
                                placeholder="Landmark"
                                value={address.landmark}
                                onChange={(e) =>
                                    setAddress({ ...address, landmark: e.target.value })
                                }
                                className={styles.input}
                                disabled={processing}
                            />

                            <select
                                className={`${styles.select} form-control`}
                                value={address.state}
                                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                            >
                                <option value="">-- Select State --</option>
                                {states.map((state, index) => (
                                    <option key={index} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="City"
                                value={address.city}
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                className={styles.input}
                                disabled={processing}
                            />
                            <input
                                type="text"
                                placeholder="Pincode"
                                value={address.pincode}
                                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                className={styles.input}
                                disabled={processing}
                            />
                        </div>
                        {error && (
                            <div className={styles.error}>{error}</div>
                        )}
                        <button
                            onClick={handlePay}
                            disabled={processing}
                            className={`${styles.btn} ${styles.primaryBtn}`}
                        >
                            {processing ? "Placing Order..." : "Place Order"}
                        </button>
                        <br />
                        <button
                            onClick={handleClose}
                            disabled={processing}
                            className={`${styles.btn} ${styles.secondaryBtn}`}
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;