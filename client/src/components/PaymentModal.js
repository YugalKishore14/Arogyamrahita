import React, { useState } from 'react';

// onPlaceOrder(address, onSuccess, onError)
const PaymentModal = ({ isOpen, onClose, onPlaceOrder }) => {
    const [method] = useState('cod'); // Only allow COD
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [address, setAddress] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        pincode: ''
    });
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handlePay = async () => {
        // Validate address fields
        if (!address.name || !address.phone || !address.email || !address.address || !address.city || !address.pincode) {
            setError('Please fill all address fields.');
            return;
        }
        setError('');
        setProcessing(true);
        try {
            await onPlaceOrder(address, () => {
                setProcessing(false);
                setSuccess(true);
            }, (err) => {
                setProcessing(false);
                setError('Order failed. Try again.');
            });
        } catch (e) {
            setProcessing(false);
            setError('Order failed. Try again.');
        }
    };

    const handleClose = () => {
        setSuccess(false);
        setProcessing(false);
        setAddress({ name: '', phone: '', email: '', address: '', city: '', pincode: '' });
        setError('');
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: '#fff',
                padding: 32,
                borderRadius: 12,
                minWidth: 320,
                textAlign: 'center',
                boxShadow: '0 2px 16px rgba(0,0,0,0.2)'
            }}>
                <h2>Cash on Delivery</h2>
                {success ? (
                    <>
                        <p style={{ color: 'green', fontWeight: 'bold' }}>Order Placed Successfully!</p>
                        <button onClick={handleClose} style={{ marginTop: 16, padding: '8px 24px', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer' }}>Close</button>
                    </>
                ) : (
                    <>
                        <div style={{ margin: '16px 0', color: '#1976d2', fontWeight: 500 }}>Pay with cash when your order arrives.</div>
                        <div style={{ marginBottom: 12, textAlign: 'left' }}>
                            <input type="text" placeholder="Full Name" value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} style={{ padding: 8, width: '100%', marginBottom: 8 }} disabled={processing} />
                            <input type="text" placeholder="Phone Number" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} style={{ padding: 8, width: '100%', marginBottom: 8 }} disabled={processing} />
                            <input type="email" placeholder="Email" value={address.email} onChange={e => setAddress({ ...address, email: e.target.value })} style={{ padding: 8, width: '100%', marginBottom: 8 }} disabled={processing} />
                            <textarea placeholder="Delivery Address" value={address.address} onChange={e => setAddress({ ...address, address: e.target.value })} style={{ padding: 8, width: '100%', marginBottom: 8 }} disabled={processing} />
                            <input type="text" placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} style={{ padding: 8, width: '100%', marginBottom: 8 }} disabled={processing} />
                            <input type="text" placeholder="Pincode" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} style={{ padding: 8, width: '100%', marginBottom: 8 }} disabled={processing} />
                        </div>
                        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
                        <button onClick={handlePay} disabled={processing} style={{ marginTop: 8, padding: '8px 24px', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', cursor: processing ? 'not-allowed' : 'pointer' }}>
                            {processing ? 'Placing Order...' : 'Place Order'}
                        </button>
                        <br />
                        <button onClick={handleClose} disabled={processing} style={{ marginTop: 16, padding: '8px 24px', borderRadius: 6, background: '#aaa', color: '#fff', border: 'none', cursor: processing ? 'not-allowed' : 'pointer' }}>Cancel</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;
