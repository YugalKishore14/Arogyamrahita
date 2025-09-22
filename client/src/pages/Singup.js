import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaCheckCircle,
    FaExclamationTriangle,
} from "react-icons/fa";
import { authAPI } from "../services/Api";
import { useAuth } from "../context/AuthContext";
import logoImage from "../images/arogyamlogo.png";
import { motion } from "framer-motion";
import styles from "../css/AuthForms.module.css";

const Signup = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        number: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = "info") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const emailRegex = /^[a-zA-Z0-9]+@gmail\.com$/;

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (
            formData.name.trim().length < 2 ||
            formData.name.trim().length > 15
        ) {
            newErrors.name = "Name must be between 2–15 characters";
        } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
            newErrors.name = "Name can only contain letters and spaces";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email.trim())) {
            const email = formData.email.trim();
            const atIdx = email.lastIndexOf('@');
            if (atIdx === -1 || email.slice(atIdx) !== '@gmail.com') {
                newErrors.email = "Only @gmail.com domain is allowed.";
            } else if (!/^[a-zA-Z0-9]+$/.test(email.slice(0, atIdx))) {
                newErrors.email = "Only letters and numbers allowed before @.";
            } else {
                newErrors.email = "Invalid Gmail address.";
            }
        }

        if (!formData.number.trim()) {
            newErrors.number = "Phone number is required";
        } else if (!/^[6-9]\d{9}$/.test(formData.number.trim())) {
            newErrors.number = "Enter valid Indian mobile number (10 digits)";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "At least 8 characters required";
        } else if (!/^[A-Z]/.test(formData.password)) {
            newErrors.password = "Password must start with capital letter";
        } else if (!/[a-z]/.test(formData.password)) {
            newErrors.password = "Must include at least one lowercase letter";
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = "Must include at least one uppercase letter";
        } else if (!/\d/.test(formData.password)) {
            newErrors.password = "Must include at least one number";
        } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password)) {
            newErrors.password = "Must include at least one special character";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await authAPI.register({
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                number: formData.number.trim(),
                password: formData.password,
            });
            navigate("/login", {
                state: { message: "Account created! Please login.", email: response.email },
            });
        } catch (error) {
            showNotification(error.response?.data?.message || "Failed to create account", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {notification && (
                <motion.div
                    className={`${styles.customNotification} ${notification.type === "success"
                        ? styles.customNotificationSuccess
                        : styles.customNotificationError}`}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.3 }}
                >
                    <div>
                        {notification.type === "success" ? (
                            <FaCheckCircle className="me-2" />
                        ) : (
                            <FaExclamationTriangle className="me-2" />
                        )}
                        <span>{notification.message}</span>
                    </div>
                    <button
                        className={styles.notificationClose}
                        onClick={() => setNotification(null)}
                    >
                        ×
                    </button>
                </motion.div>
            )}

            <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <Row className="w-100 justify-content-center">
                    <Col md={6} lg={5} xl={4}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="shadow-lg border-0 my-3">
                                <Card.Body className={styles.cardBody}>
                                    <motion.div
                                        className="text-center mb-4"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        <img src={logoImage} alt="Logo" className={styles.logoImage} />
                                        <h2 className={styles.title}>Create Account</h2>
                                        <p className={styles.subTitle}>Join our Arogyam Community</p>
                                    </motion.div>

                                    <Form onSubmit={handleSubmit}>
                                        {/* Full Name */}
                                        <Form.Group className="mb-3">
                                            <Form.Label className={styles.labelName}>
                                                <FaUser className="me-2" /> Full Name
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                                isInvalid={!!errors.name}
                                                className={styles.input}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                        </Form.Group>

                                        {/* Email */}
                                        <Form.Group className="mb-3">
                                            <Form.Label className={styles.labelName}>
                                                <FaEnvelope className="me-2" /> Email
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Enter your email"
                                                isInvalid={!!errors.email}
                                                className={styles.input}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                        </Form.Group>

                                        {/* Phone */}
                                        <Form.Group className="mb-3">
                                            <Form.Label className={styles.labelName}>
                                                <FaUser className="me-2" /> Phone Number
                                            </Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="number"
                                                value={formData.number}
                                                onChange={handleChange}
                                                placeholder="Enter your phone number"
                                                isInvalid={!!errors.number}
                                                className={styles.input}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.number}</Form.Control.Feedback>
                                        </Form.Group>

                                        {/* Password */}
                                        <Form.Group className="mb-3">
                                            <Form.Label className={styles.labelName}>
                                                <FaLock className="me-2" /> Password
                                            </Form.Label>
                                            <div className={styles.passwordHint}>
                                                Password must start with a capital letter.
                                            </div>
                                            {errors.password && (
                                                <div className={styles.passwordError}>
                                                    Please enter a strong password (min 8 chars, one capital, one small, one number, one special character)
                                                </div>
                                            )}
                                            <div className="position-relative">
                                                <Form.Control
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="Enter your password"
                                                    isInvalid={!!errors.password}
                                                    className={`${styles.input} pe-5`}
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.eyeButton}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <FaEyeSlash className={styles.eye} /> : <FaEye className={styles.eye} />}
                                                </button>
                                            </div>
                                            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                        </Form.Group>

                                        {/* Confirm Password */}
                                        <Form.Group className="mb-4">
                                            <Form.Label className={styles.labelName}>
                                                <FaLock className="me-2" /> Confirm Password
                                            </Form.Label>
                                            <div className="position-relative">
                                                <Form.Control
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    placeholder="Confirm your password"
                                                    isInvalid={!!errors.confirmPassword}
                                                    className={`${styles.input} pe-5`}
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.eyeButton}
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? <FaEyeSlash className={styles.eye} /> : <FaEye className={styles.eye} />}
                                                </button>
                                            </div>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.confirmPassword}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        {/* Submit */}
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            className={styles.submitBtn}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2" />
                                                    Creating Account...
                                                </>
                                            ) : (
                                                "Create Account"
                                            )}
                                        </Button>
                                    </Form>

                                    <hr className="my-4" />
                                    <div className="text-center">
                                        <p className={styles.p}>
                                            Already have an account?{" "}
                                            <Link to="/login" className={styles.loginLink}>
                                                Sign In
                                            </Link>
                                        </p>
                                    </div>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Signup;
