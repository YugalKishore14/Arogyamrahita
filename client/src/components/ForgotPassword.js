import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/Api';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authAPI.forgotPassword(email);
            toast.success('Password reset link sent to your email!');
            navigate('/login'); // Redirect to login page after success
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link.');
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
                                    <h3 className="fw-bold">Forgot Password</h3>
                                    <p className="text-muted">Enter your email to reset your password.</p>
                                </motion.div>

                                {error && <Alert variant="danger">{error}</Alert>}

                                <Form onSubmit={handleSubmit}>
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
                                            {loading ? 'Sending...' : 'Reset Password'}
                                        </Button>
                                    </motion.div>
                                </Form>
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

// export const authAPI = {
//     forgotPassword: async (email) => {
//         const response = await api.post('/auth/forgot-password', { email });
//         return response.data;
//     },
// };