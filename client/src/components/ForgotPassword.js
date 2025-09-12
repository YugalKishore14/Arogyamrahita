// import React, { useState } from 'react';
// import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
// import { Link, useNavigate } from 'react-router-dom';
// import { authAPI } from '../services/Api';
// import { toast } from 'react-toastify';
// import { motion } from "framer-motion";

// const ForgotPassword = () => {
//     const [email, setEmail] = useState('');
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');
//         setSuccess('');
//         try {
//             await authAPI.forgotPassword(email);
//             setSuccess('Password reset link sent to your email!');
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to send reset link.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Container
//             fluid
//             className="d-flex justify-content-center align-items-center vh-100 bg-light"
//         >
//             <Row className="w-100 justify-content-center">
//                 <Col xs={12} sm={8} md={6} lg={4}>
//                     <motion.div
//                         initial={{ opacity: 0, y: 50 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.6 }}
//                     >
//                         <Card className="shadow-lg border-0 rounded-4 p-3">
//                             <Card.Body>
//                                 <motion.div
//                                     initial={{ opacity: 0, scale: 0.9 }}
//                                     animate={{ opacity: 1, scale: 1 }}
//                                     transition={{ duration: 0.4 }}
//                                     className="text-center mb-4"
//                                 >
//                                     <h3 className="fw-bold">Forgot Password</h3>
//                                     <p className="text-muted">Enter your email to reset your password.</p>
//                                 </motion.div>

//                                 {error && <Alert variant="danger">{error}</Alert>}
//                                 {success && <Alert variant="success">{success}</Alert>}

//                                 <Form onSubmit={handleSubmit}>
//                                     <Form.Group className="mb-3" controlId="formBasicEmail">
//                                         <Form.Label>Email address</Form.Label>
//                                         <Form.Control
//                                             type="email"
//                                             placeholder="Enter email"
//                                             value={email}
//                                             onChange={(e) => setEmail(e.target.value)}
//                                             required
//                                         />
//                                     </Form.Group>

//                                     <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
//                                         <Button
//                                             variant="primary"
//                                             type="submit"
//                                             className="w-100 py-2 fw-bold"
//                                             disabled={loading}
//                                         >
//                                             {loading ? 'Sending...' : 'Reset Password'}
//                                         </Button>
//                                     </motion.div>
//                                 </Form>
//                                 <div className="text-center mt-3">
//                                     <Link to="/login">Back to Login</Link>
//                                 </div>
//                             </Card.Body>
//                         </Card>
//                     </motion.div>
//                 </Col>
//             </Row>
//         </Container>
//     );
// };

// export default ForgotPassword;



import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/Api";
import { motion } from "framer-motion";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // reset mode flag
    const [resetMode, setResetMode] = useState(false);
    const [token, setToken] = useState(null);

    // Check if token is present in URL
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const resetToken = query.get("token");
        if (resetToken) {
            setResetMode(true);
            setToken(resetToken);
        }
    }, [location]);

    // Handle Forgot Password
    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await authAPI.forgotPassword(email);
            setSuccess("Password reset link sent to your email!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send reset link.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Reset Password
    const handleResetSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await authAPI.resetPassword(token, password);
            setSuccess("Password reset successful!");
            setTimeout(() => navigate("/login"), 3000); // redirect after success
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center vh-100 bg-light"
        >
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className="shadow-lg border-0 rounded-4 p-3">
                            <Card.Body>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="text-center mb-4"
                                >
                                    <h3 className="fw-bold">
                                        {resetMode ? "Reset Password" : "Forgot Password"}
                                    </h3>
                                    <p className="text-muted">
                                        {resetMode
                                            ? "Enter your new password."
                                            : "Enter your email to reset your password."}
                                    </p>
                                </motion.div>

                                {error && <Alert variant="danger">{error}</Alert>}
                                {success && <Alert variant="success">{success}</Alert>}

                                {!resetMode ? (
                                    // 🔹 Forgot Password Form
                                    <Form onSubmit={handleForgotSubmit}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </Form.Group>

                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                className="w-100 py-2 fw-bold"
                                                disabled={loading}
                                            >
                                                {loading ? "Sending..." : "Reset Password"}
                                            </Button>
                                        </motion.div>
                                    </Form>
                                ) : (
                                    // 🔹 Reset Password Form
                                    <Form onSubmit={handleResetSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>New Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Enter new password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Confirm password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                        </Form.Group>

                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                            <Button
                                                variant="success"
                                                type="submit"
                                                className="w-100 py-2 fw-bold"
                                                disabled={loading}
                                            >
                                                {loading ? "Resetting..." : "Set New Password"}
                                            </Button>
                                        </motion.div>
                                    </Form>
                                )}

                                <div className="text-center mt-3">
                                    <Link to="/login">Back to Login</Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPassword;