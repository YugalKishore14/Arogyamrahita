import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    InputGroup,
    Spinner,
    Alert,
} from "react-bootstrap";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaRobot,
    FaCheckCircle,
    FaExclamationTriangle,
} from "react-icons/fa";
import { authAPI } from "../services/Api";
import "../css/AuthForms.css";
import { useAuth } from "../context/AuthContext";
import logoImage from "../images/arogyamlogo.png";
import Header from "../components/Header";
import Fotter from "../components/Fotter";

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
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.number.trim()) {
            newErrors.number = "Phone number is required";
        } else if (!/^\+?[0-9]{7,15}$/.test(formData.number.trim())) {
            newErrors.number = "Enter valid phone number";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.register({
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                number: formData.number.trim(),
                password: formData.password,
            });

            showNotification("Account created successfully! Please login.", "success");
            setTimeout(() => {
                navigate("/login", {
                    state: {
                        message: "Account created! Please login to continue.",
                        email: response.email,
                    },
                });
            }, 1200);
        } catch (error) {
            showNotification(
                error.response?.data?.message || "Failed to create account",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            {notification && (
                <div
                    className={`custom-notification custom-notification-${notification.type}`}
                >
                    <div className="d-flex align-items-center">
                        {notification.type === "success" ? (
                            <FaCheckCircle className="me-2" />
                        ) : (
                            <FaExclamationTriangle className="me-2" />
                        )}
                        <span>{notification.message}</span>
                    </div>
                    <button
                        className="notification-close"
                        onClick={() => setNotification(null)}
                    >
                        ×
                    </button>
                </div>
            )}

            <Container
                fluid
                className="min-vh-100 bg-light d-flex align-items-center justify-content-center"
            >
                <Row className="w-100 justify-content-center">
                    <Col md={6} lg={5} xl={4}>
                        <Card className="shadow-lg border-0">
                            <Card.Body className="p-5">
                                <div className="text-center mb-4">
                                    <img src={logoImage} style={{ width: "100px", height: "100px" }} alt="Logo" className="mb-1" />
                                    <h2 className="fw-bold text-dark">Create Account</h2>
                                    <p className="text-muted">Join our Arogyam Community</p>
                                </div>

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">
                                            <FaUser className="me-2" />
                                            Full Name
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            isInvalid={!!errors.name}
                                            className="py-2"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">
                                            <FaEnvelope className="me-2" />
                                            Email Address
                                        </Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            isInvalid={!!errors.email}
                                            className="py-2"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">
                                            <FaUser className="me-2" />
                                            Phone Number
                                        </Form.Label>
                                        <Form.Control
                                            type="tel"
                                            name="number"
                                            value={formData.number}
                                            onChange={handleChange}
                                            placeholder="Enter your phone number"
                                            isInvalid={!!errors.number}
                                            className="py-2"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.number}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">
                                            <FaLock className="me-2" />
                                            Password
                                        </Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Enter your password"
                                                isInvalid={!!errors.password}
                                                className="py-2 pe-5"
                                            />
                                            <Button
                                                variant="link"
                                                className="position-absolute top-50 end-0 translate-middle-y border-0 text-muted"
                                                onClick={() => setShowPassword(!showPassword)}
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </Button>
                                        </div>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.password}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            <FaLock className="me-2" />
                                            Confirm Password
                                        </Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Confirm your password"
                                                isInvalid={!!errors.confirmPassword}
                                                className="py-2 pe-5"
                                            />
                                            <Button
                                                variant="link"
                                                className="position-absolute top-50 end-0 translate-middle-y border-0 text-muted"
                                                onClick={() =>
                                                    setShowConfirmPassword(!showConfirmPassword)
                                                }
                                                tabIndex={-1}
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </Button>
                                        </div>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.confirmPassword}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="w-100 fw-semibold py-2"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner
                                                    animation="border"
                                                    size="sm"
                                                    className="me-2"
                                                />
                                                Creating Account...
                                            </>
                                        ) : (
                                            "Create Account"
                                        )}
                                    </Button>
                                </Form>

                                <hr className="my-4" />

                                <div className="text-center">
                                    <p className="mb-0 text-muted">
                                        Already have an account?{" "}
                                        <Link
                                            to="/login"
                                            className="text-primary fw-semibold text-decoration-none"
                                        >
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Fotter />
        </>
    );
};

export default Signup;
