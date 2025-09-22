import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { authAPI } from "../services/Api";
import { useAuth } from "../context/AuthContext";
import logoImage from "../images/arogyamlogo.png";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import styles from "../css/Login.module.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(0);
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    useEffect(() => {
        if (location.state?.message) {
            // toast.success(location.state.message);
            if (location.state.email) setEmail(location.state.email);
        }
    }, [location.state]);

    useEffect(() => {
        let interval;
        if (timer > 0) interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await authAPI.login({ email, password });
            setShowOtpForm(true);
            setTimer(120);
            // toast.success("OTP sent to your email!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerification = async (e) => {
        e.preventDefault();
        setVerifyingOtp(true);
        setError("");
        try {
            const response = await authAPI.verifyOtp({ email, otp });
            login(response.token, response.user);
            // toast.success("Login successful!");
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            await authAPI.resendOtp({ email });
            setTimer(300);
            // toast.success("New OTP sent!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to resend OTP");
        }
    };

    const goBackToLogin = () => {
        setShowOtpForm(false);
        setOtp("");
        setTimer(0);
        setError("");
    };

    // ===== OTP FORM =====
    if (showOtpForm) {
        return (
            <Container fluid className={styles.container}>
                <Row className="w-100 justify-content-center">
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            <Card className={styles.card}>
                                <Card.Body>
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center mb-4">
                                        <img src={logoImage} alt="Logo" className={styles.logo} />
                                        <h3 className={styles.title}>Verify OTP</h3>
                                        <p className={styles.subtitle}>Enter the OTP sent to {email}</p>
                                    </motion.div>

                                    {error && <Alert variant="danger">{error}</Alert>}

                                    <Form onSubmit={handleOtpVerification}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>OTP Code</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter 6-digit OTP"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                maxLength={6}
                                                required
                                                className={styles.otpInput}
                                            />
                                        </Form.Group>

                                        {timer > 0 && (
                                            <div className="text-center mb-3">
                                                <p className={styles.subtitle}>
                                                    OTP expires in: <strong>{formatTime(timer)}</strong>
                                                </p>
                                            </div>
                                        )}

                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                            <Button variant="primary" type="submit" className={`${styles.button} mb-3 w-100`} disabled={verifyingOtp || timer === 0}>
                                                {verifyingOtp ? (
                                                    <>
                                                        <Spinner animation="border" size="sm" className="me-2" /> Verifying...
                                                    </>
                                                ) : (
                                                    "Verify OTP"
                                                )}
                                            </Button>
                                        </motion.div>

                                        <div className="d-flex gap-2">
                                            <motion.div whileTap={{ scale: 0.95 }} className="flex-fill">
                                                <Button variant="outline-secondary" onClick={goBackToLogin} className="w-100">
                                                    <FaArrowLeft className="me-2" /> Back
                                                </Button>
                                            </motion.div>
                                            <motion.div whileTap={{ scale: 0.95 }} className="flex-fill">
                                                <Button variant="outline-primary" onClick={handleResendOtp} disabled={timer > 0} className="w-100">
                                                    Resend OTP
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        );
    }

    // ===== LOGIN FORM =====
    return (
        <Container fluid className={styles.container}>
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <Card className={styles.card}>
                            <Card.Body>
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center mb-4">
                                    <img src={logoImage} alt="Logo" className={styles.logo} />
                                    <h3 className={styles.title}>Welcome Back</h3>
                                    <p className={styles.subtitle}>Login to continue</p>
                                </motion.div>

                                {error && <Alert variant="danger">{error}</Alert>}

                                <Form onSubmit={handleLogin}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={styles.labelName}><FaEnvelope className="me-2" /> Email</Form.Label>
                                        <Form.Control type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input} />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className={styles.labelName}><FaLock className="me-2" /> Password</Form.Label>
                                        <div className={styles.passwordWrapper}>
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className={styles.input}
                                            />
                                            <span
                                                className={styles.passwordToggle}
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                        </div>
                                    </Form.Group>

                                    <div className="text-center mb-3">
                                        <Link to="/forgot-password" className={styles.link}>Forgot Password?</Link>
                                    </div>

                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                        <Button variant="primary" type="submit" className={`${styles.button} w-100`} disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2" /> Sending OTP...
                                                </>
                                            ) : (
                                                "Send OTP"
                                            )}
                                        </Button>
                                    </motion.div>
                                </Form>

                                <div className="text-center mt-3">
                                    <p className={styles.p}>
                                        Don't have an account? <Link to="/signup" className={styles.link}>Sign Up</Link>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
