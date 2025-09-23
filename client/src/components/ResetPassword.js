import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/Api';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
    const query = useQuery();
    const email = query.get('email') || '';
    const token = query.get('token') || '';
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!newPassword || !confirmPassword) {
            setError('Please fill all fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            await authAPI.resetPassword({ email, token, newPassword });
            // toast.success('Password reset successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <Card className="p-4 shadow">
                        <Card.Body>
                            <Card.Title className="mb-4">Reset Password</Card.Title>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" style={{ position: 'relative' }}>
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <span
                                        style={{ position: 'absolute', right: 12, top: 38, cursor: 'pointer', zIndex: 2 }}
                                        onClick={() => setShowNewPassword(v => !v)}
                                    >
                                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </Form.Group>
                                <Form.Group className="mb-3" style={{ position: 'relative' }}>
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <span
                                        style={{ position: 'absolute', right: 12, top: 38, cursor: 'pointer', zIndex: 2 }}
                                        onClick={() => setShowConfirmPassword(v => !v)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </Form.Group>
                                <Button type="submit" variant="primary" disabled={loading} className="w-100">
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ResetPassword;
