import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Alert,
    Spinner,
} from "react-bootstrap";
import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaArrowLeft,
} from "react-icons/fa";
import { authAPI } from "../services/Api";
import { useAuth } from "../context/AuthContext";
import logoImage from "../images/arogyamlogo.png";
import { toast } from "react-toastify";
import Header from "../components/Header";
import Fotter from "../components/Fotter";

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
            toast.success(location.state.message);
            if (location.state.email) {
                setEmail(location.state.email);
            }
        }
    }, [location.state]);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await authAPI.login({ email, password });
            setShowOtpForm(true);
            setTimer(120);
            toast.success("OTP sent to your email!");
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to send OTP. Please try again."
            );
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
            toast.success("Login successful!");
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
            toast.success("New OTP sent!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to resend OTP");
        }
    };

    const handleForgotPassword = () => {
        toast.info("Forgot password functionality coming soon!");
    };

    const goBackToLogin = () => {
        setShowOtpForm(false);
        setOtp("");
        setTimer(0);
        setError("");
    };

    if (showOtpForm) {
        return (
            <>
                <Header />
                <Container
                    fluid
                    className="d-flex justify-content-center align-items-center vh-100 bg-light"
                >
                    <Row className="w-100 justify-content-center">
                        <Col xs={12} sm={8} md={6} lg={4}>
                            <Card className="shadow-lg border-0 rounded-4 p-3">
                                <Card.Body>
                                    <div className="text-center mb-4">
                                        <img
                                            src={logoImage}
                                            alt="Logo"
                                            className="mb-1"
                                            style={{ width: "100px", height: "100px" }}
                                        />
                                        <h3 className="fw-bold">Verify OTP</h3>
                                        <p className="text-muted">Enter the OTP sent to {email}</p>
                                    </div>

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
                                                className="text-center"
                                                style={{ fontSize: "1.2rem", letterSpacing: "0.5rem" }}
                                            />
                                        </Form.Group>

                                        {timer > 0 && (
                                            <div className="text-center mb-3">
                                                <p className="text-muted">
                                                    OTP expires in: <strong>{formatTime(timer)}</strong>
                                                </p>
                                            </div>
                                        )}

                                        <Button
                                            variant="primary"
                                            type="submit"
                                            className="w-100 py-2 fw-bold mb-3"
                                            disabled={verifyingOtp || timer === 0}
                                        >
                                            {verifyingOtp ? (
                                                <>
                                                    <Spinner
                                                        animation="border"
                                                        size="sm"
                                                        className="me-2"
                                                    />
                                                    Verifying...
                                                </>
                                            ) : (
                                                "Verify OTP"
                                            )}
                                        </Button>

                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="outline-secondary"
                                                onClick={goBackToLogin}
                                                className="flex-fill"
                                            >
                                                <FaArrowLeft className="me-2" />
                                                Back
                                            </Button>
                                            <Button
                                                variant="outline-primary"
                                                onClick={handleResendOtp}
                                                disabled={timer > 0}
                                                className="flex-fill"
                                            >
                                                Resend OTP
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }

    return (<>
        <Header />
        <Container
            fluid
            className="d-flex justify-content-center align-items-center vh-100 bg-light"
        >
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <Card className="shadow-lg border-0 rounded-4 p-3">
                        <Card.Body>
                            <div className="text-center mb-4">
                                <img
                                    src={logoImage}
                                    alt="Logo"
                                    className="mb-1"
                                    style={{ width: "100px", height: "100px" }}
                                />
                                <h3 className="fw-bold">Welcome Back</h3>
                                <p className="text-muted">Login to continue</p>
                            </div>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleLogin}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FaEnvelope />
                                        </span>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FaLock />
                                        </span>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <span
                                            className="input-group-text"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                </Form.Group>

                                <div className="text-center mb-3">
                                    <Button
                                        variant="link"
                                        className="p-0 text-decoration-none text-muted"
                                        onClick={handleForgotPassword}
                                    >
                                        Forgot Password?
                                    </Button>
                                </div>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 py-2 fw-bold"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Sending OTP...
                                        </>
                                    ) : (
                                        "Send OTP"
                                    )}
                                </Button>
                            </Form>

                            <div className="text-center mt-3">
                                <p className="mb-0">
                                    Don't have an account?{" "}
                                    <Link to="/signup" className="fw-bold text-decoration-none">
                                        Sign Up
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

export default Login;
