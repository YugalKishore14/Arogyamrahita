import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import styles from "../css/PaymentModal.module.css";
import "react-phone-input-2/lib/style.css";
import { useAuth } from "../context/AuthContext";

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
    const { user } = useAuth();
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
    const [pincodeDetails, setPincodeDetails] = useState(null);

    // Auto-fill from user profile
    useEffect(() => {
        if (isOpen && user) {
            setAddress({
                name: user.name || "",
                phone: user.number || "",
                email: user.email || "",
                address: user.address || "",
                addressLine2: user.addressLine2 || "",
                landmark: user.landmark || "",
                city: user.city || "",
                state: user.state || "",
                pincode: user.pincode || "",
            });
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    // Pincode Validation + Auto-fill City/State
    const handlePincodeChange = async (pincode) => {
        setAddress({ ...address, pincode });
        setError("");
        setPincodeDetails(null);

        if (pincode.length === 6) {
            try {
                setProcessing(true);
                const response = await fetch(
                    `https://api.postalpincode.in/pincode/${pincode}`
                );
                const data = await response.json();
                if (data && data[0].Status === "Success") {
                    const office = data[0].PostOffice[0];
                    const city = office.District;
                    const state = office.State;

                    setPincodeDetails(data[0].PostOffice);

                    // Auto-fill City + State
                    setAddress((prev) => ({
                        ...prev,
                        city,
                        state,
                    }));
                } else {
                    setError("Invalid pincode. Please check and try again.");
                }
            } catch (err) {
                setError("Failed to verify pincode. Please check your connection.");
            } finally {
                setProcessing(false);
            }
        }
    };

    // Place Order Handler with Validation
    const handlePay = async () => {
        const newErrors = {};

        // Name validation
        if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(address.name.trim())) {
            newErrors.name =
                "Name can only contain letters and single spaces between words.";
        }

        // Phone validation (10–15 digits)
        if (
            !address.phone ||
            !/^\d{10,15}$/.test(address.phone.replace(/\D/g, ""))
        ) {
            newErrors.phone = "Enter a valid phone number with country code.";
        }

        // Gmail validation
        if (!/^[a-zA-Z0-9.]+@gmail\.com$/.test(address.email)) {
            newErrors.email =
                "Enter a valid Gmail address (e.g., example@gmail.com).";
        }

        // Address validation
        if (!/^[a-zA-Z0-9\s,.\-\/]+$/.test(address.address.trim())) {
            newErrors.address =
                "Address can only contain letters, numbers, and symbols (, . - /).";
        }

        if (
            address.addressLine2.trim() &&
            !/^[a-zA-Z0-9\s,.\-\/]+$/.test(address.addressLine2.trim())
        ) {
            newErrors.addressLine2 =
                "Address Line 2 can only contain letters, numbers, and symbols (, . - /).";
        }

        if (
            address.landmark.trim() &&
            !/^[a-zA-Z0-9\s,.\-\/]+$/.test(address.landmark.trim())
        ) {
            newErrors.landmark =
                "Landmark can only contain letters, numbers, and symbols (, . - /).";
        }

        if (!/^[a-zA-Z0-9\s]+$/.test(address.city)) {
            newErrors.city = "City can only contain letters, numbers and spaces.";
        }

        if (!address.state) {
            newErrors.state = "Please select a state.";
        }

        if (!/^[0-9]{6}$/.test(address.pincode)) {
            newErrors.pincode = "Please enter a valid 6-digit pincode.";
        } else if (pincodeDetails) {
            const isCityValid = pincodeDetails.some(
                (office) => office.District.toLowerCase() === address.city.toLowerCase()
            );
            const isStateValid = pincodeDetails.some(
                (office) => office.State.toLowerCase() === address.state.toLowerCase()
            );
            if (!isCityValid)
                newErrors.city = `The city does not match the entered pincode.`;
            if (!isStateValid)
                newErrors.state = `The state does not match the entered pincode.`;

            const localities = pincodeDetails.map((office) =>
                office.Name.toLowerCase()
            );
            const addressLine1Lower = address.address.toLowerCase();
            const addressLine2Lower = address.addressLine2.toLowerCase();

            const isAddressValid = localities.some(
                (loc) => addressLine1Lower.includes(loc) || (addressLine2Lower && addressLine2Lower.includes(loc))
            );

            if (!isAddressValid)
                newErrors.address = `Address does not seem to match the area for the entered pincode.`;
        }

        // If errors exist
        if (Object.keys(newErrors).length > 0) {
            setError(Object.values(newErrors).join("\n"));
            return;
        }

        // Required fields
        if (
            !address.name ||
            !address.phone ||
            !address.email ||
            !address.address ||
            !address.city ||
            !address.pincode
        ) {
            setError("Please fill all required address fields.");
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
                () => {
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
                        <p className={styles.successMessage}>Order Placed Successfully!</p>
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
                                onChange={(e) =>
                                    setAddress({ ...address, email: e.target.value })
                                }
                                className={styles.input}
                                style={{ marginTop: 0 }}
                                disabled={processing}
                            />

                            <textarea
                                placeholder="Address Line 1"
                                value={address.address}
                                onChange={(e) =>
                                    setAddress({ ...address, address: e.target.value })
                                }
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

                            <input
                                type="text"
                                placeholder="Pincode"
                                value={address.pincode}
                                onChange={(e) => handlePincodeChange(e.target.value)}
                                className={styles.input}
                                disabled={processing}
                            />
                            <input
                                type="text"
                                placeholder="City"
                                value={address.city}
                                onChange={(e) =>
                                    setAddress({ ...address, city: e.target.value })
                                }
                                className={styles.input}
                                disabled={processing}
                            />
                            <select
                                className={`${styles.select} form-control`}
                                value={address.state}
                                onChange={(e) =>
                                    setAddress({ ...address, state: e.target.value })
                                }
                            >
                                <option value="">-- Select State --</option>
                                {states.map((state, index) => (
                                    <option key={index} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {error && (
                            <div className={styles.error}>
                                {error.split("\n").map((line, idx) => (
                                    <p key={idx}>{line}</p>
                                ))}
                            </div>
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
