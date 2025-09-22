import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/Api';
import { motion } from 'framer-motion';
import styles from '../css/Login.module.css'; // Reuse same CSS module

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await authAPI.forgotPassword(email);
            setSuccess('Password reset link sent to your email!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className={styles.container}>
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <Card className={styles.card}>
                            <Card.Body>
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center mb-4">
                                    <h3 className={styles.title}>Forgot Password</h3>
                                    <p className={styles.subtitle}>Enter your email to reset your password.</p>
                                    <p className={styles.subtitle} style={{ fontSize: '0.9rem', color: '#0dcaf0' }}>
                                        <strong>Note:</strong> Click the link received in your email to reset password.
                                    </p>
                                </motion.div>

                                {error && <Alert variant="danger">{error}</Alert>}
                                {success && <Alert variant="success">{success}</Alert>}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className={styles.labelName}>Email Address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className={styles.input}
                                        />
                                    </Form.Group>

                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                        <Button variant="primary" type="submit" className={`${styles.button} w-100`} disabled={loading}>
                                            {loading ? 'Sending...' : 'Reset Password'}
                                        </Button>
                                    </motion.div>
                                </Form>

                                <div className="text-center mt-3">
                                    <Link to="/login" className={styles.link}>Back to Login</Link>
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
